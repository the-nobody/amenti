"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* State Machine */
var State = function () {
  function State(states) {
    _classCallCheck(this, State);

    this._states = states || {};
    this._states.lock = states.lock || "statelock:default";
    this._current = "lock";
  }

  _createClass(State, [{
    key: "setter",
    value: function setter(state) {
      var _current = this._states[this._current] || false;
      var _state = this._states[state] || false;

      if (!_state) return;

      if (state === this._current) {
        return console.log("You are already in state: " + state);
      }

      if (_current) {
        guide.speak(_current + ":leave");
      }

      guide.speak(_state + ":enter");

      this._current = state;

      guide.speak("" + _state);
      return Promise.resolve();
    }
  }, {
    key: "get",
    value: function get(state) {
      return this._states[state];
    }
  }, {
    key: "current",
    value: function current() {
      return this._current;
    }
  }, {
    key: "add",
    value: function add(state, msg) {
      this._states[state] = msg;
      return this._states[state];
    }
  }]);

  return State;
}();

module.exports = State;