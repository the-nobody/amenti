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
  
  speak(msg) {
    //there are two types of events we want to speak.
    // 1. the string event separated by a :
    // 2. the space event in format *event* chain:together:stuff
    // first split the event on the first space;
    const _msg = msg.split("-");
    // if _msg length is 2 then it's in the second state
    switch (_msg.length) {
    case 1:
      this._emitter.emit(msg);
      break;
    case 2:
      console.log(_msg[0], " split event triggered");
      this._emitter.emit(_msg[0], _msg[1]);
      break;
    default:
      console.log("Guide Speaker: um... something was wrong with the format of your msg");
    }
    
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
  add(type, data) {
    data = Array.isArray(data) ? data : [data];
    const retIds = [];
    data.forEach(val => {
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
