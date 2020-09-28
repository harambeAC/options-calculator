import React, { Component } from 'react';
import CanvasJSReact from '../canvasjs.react';
import BlackScholes from './blackscholes'

var CanvasJSChart = CanvasJSReact.CanvasJSChart;


class Graph extends Component {
  constructor(props) {
    super(props)
    this.state = props.data;
    this.getOptionsGraph();
  }

  componentWillReceiveProps(newProps) {
    this.state  = newProps.data;
    this.getOptionsGraph();
  }

  getOptionsGraph(){
    this.optionsData = {};
    this.stockData = {};
    this.optionsDataAtExpiry = {};
    
    // process range of graph
    var min = parseFloat(this.state[0].strike);
    var max = parseFloat(this.state[0].strike);
    for(var i = 1; i<Object.keys(this.state).length; i++){
      var option = this.state[i];
      if(parseFloat(option.stockPrice) < min){
        min = parseFloat(option.strike);
      }
      if(parseFloat(option.stockPrice) > max){
        max = parseFloat(option.strike);
      }
    }

    var mid = (min + max)/2;
    // generate prices for every stock price
    for(var i = min - 0.3 * mid; i < max + 0.3 * mid; i += 0.01 * mid){
      for(var j = 0; j<Object.keys(this.state).length; j++){

        var option = this.state[j];

        let copy = {
          ...option
        };

        if(copy.buyOrSell == 'buy'){
          var buyOrSell = 1;
        }else{
          var buyOrSell = -1;
        }

        // baseline price
        var originalPrice = (new BlackScholes(copy)).price();

        // find price of option now
        copy.stockPrice = i;
        var copyPrice = (new BlackScholes(copy)).price();
        if(!(i in this.optionsData)){
          this.optionsData[i] = option.quantity * buyOrSell * (copyPrice - originalPrice);
        }else{
          this.optionsData[i] += option.quantity * buyOrSell * (copyPrice - originalPrice);
        }

        // find price of stock itself
        if(!(i in this.stockData)){
          this.stockData[i] = option.quantity * buyOrSell * (i - option.stockPrice);
        }else{
          this.stockData[i] += option.quantity * buyOrSell * (i - option.stockPrice);
        }        
 
        // find price of option in to the future
        copy.daysToExpiry = 0;
        var expiryPrice = (new BlackScholes(copy)).price();  
        if(!(i in this.optionsDataAtExpiry)){
          this.optionsDataAtExpiry[i] = option.quantity * buyOrSell * (expiryPrice - originalPrice);
        } else {
          this.optionsDataAtExpiry[i] += option.quantity * buyOrSell * (expiryPrice - originalPrice);
        }
      }
    }
  
    // change back to usable format
    this.optionsData = this.organizeData(this.optionsData);
    this.stockData = this.organizeData( this.stockData)
    this.optionsDataAtExpiry = this.organizeData(this.optionsDataAtExpiry);
  }

  organizeData(optionsData){
    var data = []
    for(const i in optionsData){
      data.push( { x : parseFloat(i), y : optionsData[i] } );
    }
    return data;
  }

  // green : at expiry
  // red : now
  // blue : stock price
	render() {
		return (
		<div>
			<CanvasJSChart options = {{
        exportEnabled: true,
        theme: "light1",
        title:{
          text: "Options Pricing Chart"
        },
        axisY: {
          title: "Profit/Loss",
          includeZero: true,
        },
        axisX: {
          title: "Price of Underlying Security",
        },
        data: [{
          type: "line",
          markerType: "none",
          toolTipContent: "Price {x}: , P/L: {y}",
          dataPoints: this.optionsData,
          color : 'red'
        },{
          type: "line",
          markerType: "none",
          toolTipContent: "Price {x}: , P/L: {y}",
          dataPoints: this.stockData,
          color : 'blue'
        },{
          type: "line",
          markerType: "none",
          toolTipContent: "Price {x}: , P/L: {y}",
          dataPoints: this.optionsDataAtExpiry,
          color : 'green'
        }
      ]}
      }	/>
		</div>
		);
	}
}

export default Graph;