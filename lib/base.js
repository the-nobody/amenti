"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var State = require("./state.js");
// utility for setting this options in a class
// Builder

var Base = function Base(opts) {
  _classCallCheck(this, Base);

  opts = opts || {};
  opts.states = opts.states || {};

  for (var opt in opts) {
    this[opt] = opts[opt];
  }
  this.state = new State(this.states);
};

module.exports = Base;