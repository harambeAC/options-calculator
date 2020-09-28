class BlackScholes {

  constructor(state) {
    if(state === null){
      return;
    }
    this.PutCallFlag = state.type;
    this.S = parseFloat(state.stockPrice);
    this.X = parseFloat(state.strike);
    this.T = parseFloat(state.daysToExpiry)/365;
    this.r = parseFloat(state.interestRate);
    this.v = parseFloat(state.volatility);
    this.d1 = (Math.log(this.S / this.X) + (this.r + this.v * this.v / 2) * this.T) / (this.v * Math.sqrt(this.T));
    this.d2 = this.d1 - this.v * Math.sqrt(this.T);
  }

  /* The cummulative Normal distribution function: */
  CND = (x) => {
    if(x < 0) {
        return ( 1-this.CND(-x) );
    } else {
        var k = 1 / (1 + .2316419 * x);
        return ( 1 - Math.exp(-x * x / 2)/ Math.sqrt(2 * Math.PI) * k * (.31938153 + k * (-.356563782 + k * (1.781477937 + k * (-1.821255978 + k * 1.330274429)))) );
    }
  }

  price = () => {
    if (this.PutCallFlag === "call") {
      return ( this.S * this.CND(this.d1) - this.X * Math.exp(-this.r * this.T) *this.CND(this.d2) );
    } else {
      return ( this.X * Math.exp(-this.r * this.T) * this.CND(-this.d2) - this.S * this.CND(-this.d1) );
    }
  }

  delta() {
    if (this.PutCallFlag === "call") {
      return this.CND(this.d1);
    } else {
      return this.CND(this.d1) - 1;
    }
  }

  gamma() {
    return Math.exp(-this.d1 * this.d1 / 2) / (this.S * this.v * Math.sqrt(2 * Math.PI * this.T))
  }

  theta() {
    var term1 =  -(this.S * this.v * Math.exp(-this.d1 * this.d1 / 2) / (2 * Math.sqrt(2 * Math.PI * this.T)));
    var term2 =  ( this.r * this.X * Math.exp(-this.r * this.T) * this.CND(this.d2) );

    if (this.PutCallFlag === "call") {
      return (term1 - term2) / this.T;
    } else {
      return (term1 + term2) / this.T;
    }
  }

  vega() {
    return (this.S * Math.sqrt(this.T) * Math.exp(-this.d1 * this.d1 / 2) / (100 * Math.sqrt(2 * Math.PI)));
  }

  rho() {
    var rho = this.X * this.T * Math.exp(-this.r * this.T) * this.CND(this.d2) / 100;

    if (this.PutCallFlag === "call") {
      return rho;
    } else {
      return -1 * rho;
    }
  }
}

export default BlackScholes;