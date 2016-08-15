const {EventEmitter} = require("events");
// utility for setting this options in a class
// Builder
class Base {
  constructor(opts={}) {
    opts.id = opts.id || Math.floor((1 + Math.random()) * 0x10000);
    opts.states = opts.states || ["lock", "open", "close"];
    for (var opt in opts) {
      this[opt] = opts[opt];
    }
    this._emitter = new EventEmitter({});
    this.state = this.states[0];
  }
  speak(msg, resource=false) {
    this._emitter.emit(msg, resource);
    return Promise.resolve();
  }
  listen(msg, callback) {
    this._emitter.on(`${msg}`, callback);
    return Promise.resolve();
  }
  once(msg, callback) {
    this._emitter.once(msg, callback);
    return Promise.resolve();
  }
  ignore(msg, callback) {
    this._emitter.removeListener(msg, callback);
    return Promise.resolve();
  }
  
  setState(state) {
    const _current = this.state;
    const _state = this.states.includes(state);
    const self = this;
    
    if (!_state) { throw new Error("The state you passed in was not a valid state.  Please use addState('*state*')."); }
    if (state === _current) { throw new Error(`Currently in state: ${state}`); }

    if (_current) {
      self.speak(`${_current}:leaving`).then(() => {
        self.speak(`${state}:entering`).then(() => {
          self.state = state;
          self.speak(`${self._current}:entered`);
        })
      });
    }
    return Promise.resolve();
  }
  addState(state) {
    this.states.push(state);
  }
}

module.exports = Base;
