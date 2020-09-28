import React, { Component } from 'react';
import Option from './Option';

class CreditTotalDisplay extends Component {
  constructor(props){
    super(props);
    this.state = props.options;
  }

  renderCreditTotal(){
    var runningTotal = 0;
    for(var i = 0; i<Object.keys(this.state).length; i++){
      runningTotal += parseFloat(this.state[i].credit);
    }
    return runningTotal;
  }

  componentWillReceiveProps(newProps) {
    this.state = newProps.options;
  }

  render() {
    return(
      <div>
          Net Credit: {this.renderCreditTotal() }
      </div>
    );
  }
}
export default CreditTotalDisplay;
