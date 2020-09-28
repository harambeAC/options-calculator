import React, { Component } from 'react';
import BlackScholes from './blackscholes'
import debounce from 'lodash.debounce';

class Option extends Component {
  constructor(props){
    super(props);
    this.state = props.option;
    this.index = props.index;

    var BC = new BlackScholes(this.state);
    var price = BC.price();

    if(this.state.buyOrSell === 'buy'){
      var buyOrSell = 1
    }else{
      var buyOrSell = -1
    }

    this.state.credit = buyOrSell * price * parseInt(this.state.quantity);
    this.onChange = this.onChange.bind(this);
    this.onChangeDebounced = debounce(this.onChangeDebounced, 100)
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
    this.onChangeDebounced(e)
  }

  onChangeDebounced = (e) => {
    var BC = new BlackScholes(this.state);
    var price = BC.price();

    if(this.state.buyOrSell === 'buy'){
      var buyOrSell = 1
    }else{
      var buyOrSell = -1
    }

    //this.setState({credit : this.state.buyOrSell * price * this.state.quantity});
    this.state.credit = buyOrSell * price * parseFloat(this.state.quantity);
    this.props.sendData(this.state, this.index); 
  }

  componentWillReceiveProps(newProps) {
    this.state = newProps.option;
    this.index = newProps.index;

    var BC = new BlackScholes(this.state);
    var price = BC.price();

    if(this.state.buyOrSell === 'buy'){
      var buyOrSell = 1
    }else{
      var buyOrSell = -1
    }

    //this.setState({credit : buyOrSell * price * this.state.quantity});
    this.state.credit = buyOrSell * price * parseFloat(this.state.quantity);  
  }

  render() {
    var BC = new BlackScholes(this.state);

    return(
      <tr>
          <td>   
              <select name="buyOrSell" onChange={this.onChange} value={this.state.buyOrSell}>    
                <option value='buy'>Buy</option>    
                <option value='sell'>Sell</option>    
              </select>  
          </td>

          <td><input type="text" name="quantity" onChange={this.onChange} value={this.state.quantity}  size="10"/></td>
          
          <td>   
              <select name="type" onChange={this.onChange} value={this.state.type}>    
                <option value='call'>Call</option>    
                <option value='put'>Put</option>    
              </select>  
          </td>

          <td><input type="text" name="strike" onChange={this.onChange} value={this.state.strike}  size="10"/></td>
          <td><input type="text" name="daysToExpiry" onChange={this.onChange} value={this.state.daysToExpiry}  size="10"/></td>
          <td><input type="text" name="volatility" onChange={this.onChange} value={this.state.volatility}  size="10"/></td>
          <td>{this.state.credit.toFixed(3)}</td>

          <td>{BC.delta().toFixed(3)}</td>
          <td>{BC.gamma().toFixed(3)}</td>
          <td>{BC.theta().toFixed(3)}</td>
          <td>{BC.vega().toFixed(3)}</td>
          <td>{BC.rho().toFixed(3)}</td>
      </tr>);
  }
}
  
export default Option;