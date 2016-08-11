/* State Machine */
class State {
  constructor(states) {
    this._states = states || {};
    this._states.lock = states.lock || "statelock:default";
    this._current = "lock";
  }
  
  setter(state) {
    const _current = this._states[this._current] || false;
    const _state = this._states[state] || false;

    if (!_state) return;

    if (state === this._current) {
      return console.log(`You are already in state: ${state}`);
    }

    if (_current) {
      guide.speak(`${_current}:leave`);
    }

    guide.speak(`${_state}:enter`);

    this._current = state;

    guide.speak(`${_state}`);
    return Promise.resolve();
  }
  
  get(state) {
    return this._states[state];
  }

  current() {
    return this._current;
  }

  add(state, msg) {
    this._states[state] = msg;
    return this._states[state];
  }
}

module.exports = State;
