var {EventEmitter} = require("events");
// utility for setting this options in a class
// Builder
class Base {
  constructor(opts) {
    opts = opts || {};
    opts.id = opts.id || Math.floor((1 + Math.random()) * 0x10000);
    opts.states = opts.states || ["lock", "open", "close", "build", "loading", "ready"];
    for (var opt in opts) {
      this[opt] = opts[opt];
    }
    this._emitter = new EventEmitter({});
    this._state = this.states[0];
    this.init();
  }
  
  init() {
    this.listen("loading:entering", () => {
      if (this.el) this.el.classList.add("loading");
    });

    this.listen("loading:leaving", () => {
      if (this.el) this.el.classList.remove("loading");
    });
    
    // init any listen events
    if (this.hasOwnProperty("listeners")) {
      for (var l in this.listeners) {
        this.listen(l, this.listeners[l].bind(this));
      }
    }
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
  
  stateSet(state, resource=false) {
    const _state = this.states.includes(state);
    
    if (!_state) { throw new Error("The state you passed in was not a valid state.  Please use addState('*state*')."); }
    if (state === this._state) { throw new Error(`Currently in state: ${state}`); }
    
    this.speak(`${this._state}:leaving`).then(() => {
      this.speak(`${state}:entering`, resource).then(() => {
        this._state = state;
        this.speak(`${this._state}:entered`, resource);
      });
    });
    return Promise.resolve();
  }
  stateAdd(state) {
    state = Array.isArray(state) ? state : [state];
    state.forEach(st => {
      this.states.push(st);
    });
  }
  
  
}

module.exports = Base;
