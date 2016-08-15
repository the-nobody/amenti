/* State Machine */
class State {
  constructor(states=[]) {
    this._states = states;
    this._current = this._states[0];
  }
  
  set(state) {
    const _current = this._current || false;
    const _state = this._states.includes(state);
    const self = this;

    if (!_state) throw new Error("The state you passed in was not a valid state.  Please use state.add('*state*').");
    if (_state === this._current) throw new Error(`Currently in state: ${state}`);

    if (_current) {
      self.speak(`${_current}:leaving`).then(() => {
        self.speak(`${state}:entering`).then(() => {
          self._current = state;
          self.speak(`${self._current}:entered`);
        })
      });
    }
    return Promise.resolve();
  }
  
  get() {
    return this._current;
  }

  add(state) {
    this._states.push(state);
    return promise.resolve();
  }

}

module.exports = State;
