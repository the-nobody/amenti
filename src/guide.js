// Emitter: using node event emitter
const Emitter = require("events").EventEmitter;
const Base = require("./base.js");

// GUIDE Class
class Guide extends Base {
  constructor(opts) {
    super(opts);
    this.halls = {};
    this.rooms = {};
    this._emitter = new Emitter({});
  }
  
  speak(msg, res=false) {
    this._emitter.emit(msg, res);
    return Promise.resolve();
  }
  listen(msg, callback) {
    this._emitter.on(msg, callback);
    return Promise.resolve();
  }
  once(msg, callback) {
    this._emitter.once(msg, callback);
    return Promise.resolve();
  }
  remove(msg, callback) {
    this._emitter.removeListener(msg, callback);
    return Promise.resolve();
  }
  
  // process a route/hash change in the url
  route(trigger) {
    const self = this;
    function hashChange() {
      self.speak(location.hash.substr(2));
    }
    if (trigger && location.hash.substr(2).length) hashChange();
    window.addEventListener("hashchange", hashChange, false);
  }
  
  // add a hall or room
  add(type, res) {
    res = Array.isArray(res) ? res : [res];
    const retIds = [];
    res.forEach(val => {
      this[type][val.id] = val;
      retIds.push(val.id);
    });
    return retIds;
  }
  
  // delete a hall or room
  del(type, id) {
    delete this[type][id];
    return this[type];
  }
}

module.exports = Guide;
