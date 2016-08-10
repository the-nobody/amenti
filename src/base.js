const State = require("./state.js");
// utility for setting this options in a class
// Builder
class Base {
  constructor(opts) {
    opts = opts || {};
    opts.states = opts.states || {};
    
    for (var opt in opts) {
      this[opt] = opts[opt];
    }
    this.state = new State(this.states);
  }
}

module.exports = Base;
