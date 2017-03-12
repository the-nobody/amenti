"use strict";
// guide only handles guiding/routing traffic.
const Base = require("./base.js");

// GUIDE Class
class Guide extends Base {
  constructor(opts={}) {
    opts.halls = {};
    opts.rooms = {};
    super(opts);
  }
  
  // process a route/hash change in the url
  route(trigger, callback) {
    this.listen(trigger, callback);
  }

  open() {
    for (var hall in this.halls) {
      this.halls[hall].open();
    }
    this.stateSet("open");

    
    return Promise.resolve();
  }
  close() {
    for (var hall in this.halls) {
      this.halls[hall].close();
    }
    this.stateSet("close");
    return Promise.resolve();
  }
  
  addHalls(halls) {
    for (var hall in halls) {
      const _current = halls[hall];
      this.halls[_current.id] = _current;
    }
  }
  
  addRooms(rooms) {
    for (var room in rooms) {
      const _current = rooms[room];
      this.rooms[_current.id] = _current;
    }
  }
}

module.exports = Guide;
