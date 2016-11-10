"use strict";
// GREAT HALL
const Base = require("./base.js");

class Hall extends Base {
  constructor(opts={}) {
    opts.rooms = opts.rooms || {};
    super(opts);
  }
  
  open() {
    // when the hall opens we want to open all it's rooms.
    this.stateSet("open");
    return Promise.resolve();
  }
  
  close() {
    for (var room in this.rooms) {
      const _current = this.rooms[room];
      _current.close();
    }
    this.stateSet("close");
    return Promise.resolve();
  }
}
module.exports = Hall;
