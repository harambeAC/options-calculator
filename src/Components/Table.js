import React, { Component } from 'react';
import Option from './Option';

class Table extends Component {
  constructor(props){
    super(props);
    this.state = props.options;
  }

  sendData = (option, index) => {
    this.state[index] = option; 
    this.props.sendData(this.state);
  }
  
  renderOptions() {
    const rows = []
    for(var i = 0; i<Object.keys(this.state).length; i++){
      rows.push(
            <Option option={this.state[i]} index={i} sendData={this.sendData.bind(this)} />
      );
    }
    return rows;
  }

  componentWillReceiveProps(newProps) {
    this.state = newProps.options;
  }

  render() {
    return(
      <div>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Buy/Sell</th>
            <th scope="col">Quantity</th>
            <th scope="col">Call/Put</th>
            <th scope="col">Strike</th>
            <th scope="col">Days To Expiry</th>
            <th scope="col">Volatility</th>
            <th scope="col">Debit/Credit</th>

            <th scope="col">Delta</th>
            <th scope="col">Gamma</th>
            <th scope="col">Theta</th>
            <th scope="col">Vega</th>
            <th scope="col">Rho</th>
          </tr>
        </thead>

        <tbody>
          {this.renderOptions() }
        </tbody>
      </table>
      </div>

    );
  }
}
export default Table;
