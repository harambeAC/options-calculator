import React, { Component } from 'react';
import Table from './Table';
import Graph from './Graph';
import debounce from 'lodash.debounce';
import CreditTotalDisplay from './CreditTotalDisplay';

var defaultOption =  {
    stockPrice : 100,
    interestRate : 0.02,
    buyOrSell : 'buy',
    quantity: 1,
    type : 'call',
    strike : 100,
    daysToExpiry : 365,
    volatility : 0.3,
    credit : 0
};

class App extends Component {
    constructor(){
        super()        
        this.onChange = this.onChange.bind(this);
        this.stockPriceChange = this.stockPriceChange.bind(this);
        this.interestRateChange = this.interestRateChange.bind(this);

        this.onChangeDebounced = debounce(this.onChangeDebounced, 100);
        this.state = {options : [{...defaultOption}]};
    }

    getData = (options) => {
        this.setState({options : options}); 
    }

    onChange(e) {
        var newstate = []

        var longCall = {...defaultOption}
        var shortCall = {...defaultOption}
        var longPut = {...defaultOption}
        var shortPut = {...defaultOption}

        shortCall.buyOrSell = 'sell';
        longPut.type = 'put';
        shortPut.type = 'put';
        shortPut.buyOrSell = 'sell';
        
        switch(e.target.value) {
            case 'longCall':
                newstate.push(longCall);
                break;
            case 'shortCall':
                newstate.push(shortCall);
                break;
            case 'longPut':
                newstate.push(longPut);
                break;
            case 'shortPut':
                newstate.push(shortPut);
                break;

            case 'longCallSpread':
                longCall.strike = 80;
                newstate.push(longCall);
                shortCall.strike = 120;
                newstate.push(shortCall);
                break;     
            case 'shortCallSpread':
                longCall.strike = 120;
                newstate.push(longCall);
                shortCall.strike = 80;
                newstate.push(shortCall);
                break;                
            case 'longPutSpread':
                longPut.strike = 120;
                newstate.push(longPut);
                shortPut.strike = 80;
                newstate.push(shortPut);
                break;
            case 'shortPutSpread':
                longPut.strike = 80;
                newstate.push(longPut);
                shortPut.strike = 120;
                newstate.push(shortPut);
                break; 

            case 'longStraddle':
                newstate.push(longCall);
                newstate.push(longPut);
                break;  
            case 'shortStraddle':
                newstate.push(shortCall);
                newstate.push(shortPut);
                break;

            case 'longStrangle':
                longCall.strike = 120
                newstate.push(longCall);
                longPut.strike = 80
                newstate.push(longPut);
                break;           
            case 'shortStrangle':
                shortCall.strike = 120
                newstate.push(shortCall);
                shortPut.strike = 80
                newstate.push(shortPut);
                break;


                /*            case 'longCallButterfly':
             
                break;
            case 'shortCallButterfly':
              
                break;

            case 'longPutButterfly':
            
                break;
            case 'shortPutButterfly':
                
                break; */

            // butterflies
            case 'longCallButterfly':
                var c1 = {...longCall} 
                c1.strike = 80;
                var c2 = {...longCall}
                c2.strike = 120
                newstate.push(c1);
                newstate.push(c2);
                shortCall.quantity = 2;
                newstate.push(shortCall);
                break;

            case 'longPutButterfly':
                var p1 = {...longPut} 
                p1.strike = 80;
                var p2 = {...longPut}
                p2.strike = 120
                newstate.push(p1);
                newstate.push(p2);
                shortPut.quantity = 2;
                newstate.push(shortPut);
                break;

            case 'shortButterfly':
                newstate.push(longCall);
                newstate.push(longPut);
                shortCall.strike = 120;
                shortPut.strike = 80;
                newstate.push(shortCall);
                newstate.push(shortPut);
                break;

            case 'longIronButterfly':
                newstate.push(longCall);
                newstate.push(longPut);
                shortCall.strike = 80;
                shortPut.strike = 120;
                newstate.push(shortCall);
                newstate.push(shortPut);               
                break;
            case 'shortIronButterfly':
                newstate.push(shortCall);
                newstate.push(shortPut);
                longCall.strike = 80;
                longPut.strike = 120;
                newstate.push(longCall);
                newstate.push(longPut);               
                break;

            case 'longIronCondor':
                longCall.strike = 110;
                newstate.push(longCall);
                shortCall.strike = 120;
                newstate.push(shortCall);

                longPut.strike = 90;
                newstate.push(longPut);
                shortPut.strike = 80;
                newstate.push(shortPut);
                break;           
            case 'shortIronCondor':
                longCall.strike = 120;
                newstate.push(longCall);
                shortCall.strike = 110;
                newstate.push(shortCall);

                longPut.strike = 80;
                newstate.push(longPut);
                shortPut.strike = 90;
                newstate.push(shortPut);
                break;  
            case 'jadeLizard':
                longCall.strike = 80;
                newstate.push(longCall);
                shortCall.strike = 120;
                newstate.push(shortCall);
                shortPut.strike = 80;
                newstate.push(shortPut)
                break;          

            default:
              // code block
        }

        this.onChangeDebounced(e, newstate)
    }
    
    onChangeDebounced = (e, newstate) => {
        this.setState({options : newstate});
    }

    stockPriceChange(e){
        var price = parseFloat(e.target.value);
        if(e.target.value === ""){
            price = 0;
        }
        defaultOption.stockPrice = price;

        var newstate = [...this.state.options]
        for(var i = 0; i<Object.keys(newstate).length; i++){
            newstate[i].stockPrice = price;
        }
        this.onChangeDebounced(e, newstate)
    }

    interestRateChange(e){
        var rate = parseFloat(e.target.value);
        if(e.target.value === ""){
            rate = 0;
        }
        defaultOption.interestRate = rate;

        var newstate = [...this.state.options]
        for(var i = 0; i<Object.keys(newstate).length; i++){
            newstate[i].interestRate = rate;
        }
        this.onChangeDebounced(e, newstate)
    }

    render() {  
        return(
        <div>
            Underlying Stock Price: <input type="text" name="stockPrice" onChange={this.stockPriceChange}  size="15" defaultValue={defaultOption.stockPrice} />
            
            ,    Risk-Free Interest Rate: <input type="text" name="interestRate" onChange={this.interestRateChange}  size="15" defaultValue={defaultOption.interestRate} />
            
            ,    Strategy: <select name="strategies" id="strategies" onChange={this.onChange}>
                <option value="longCall">Long Call</option>
                <option value="shortCall">Short Call</option>

                <option value="longPut">Long Put</option>
                <option value="shortPut">Short Put</option>

                <option value="longCallSpread">Long Call Spread</option>
                <option value="shortCallSpread">Short Call Spread</option>
                
                <option value="longPutSpread">Long Put Spread</option>
                <option value="shortPutSpread">Short Put Spread</option>

                <option value="longStraddle">Long Straddle</option>
                <option value="shortStraddle">Short Straddle</option>

                <option value="longStrangle">Long Strangle</option>
                <option value="shortStrangle">Short Strangle </option>

                <option value="longCallButterfly">Long Call Butterfly</option>
                <option value="longPutButterfly">Long Put Butterfly</option>
                <option value="shortButterfly">Short Butterfly </option>


                <option value="longIronButterfly">Long Iron Butterfly</option>
                <option value="shortIronButterfly">Short Iron Butterfly</option>

                <option value="longIronCondor">Long Iron Condor</option>
                <option value="shortIronCondor">Short Iron Condor </option>
            </select>

            <Table sendData={this.getData.bind(this)} options={this.state.options} />
            <CreditTotalDisplay options={this.state.options}  />
            <Graph data={this.state.options} />
        </div>);
    }
}           

export default App;