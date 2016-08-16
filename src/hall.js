"use strict"
// GREAT HALL
var Base = require("./base.js");

class Hall extends Base {
  varructor(opts={}) {
    opts.rooms = opts.rooms || {};
    super(opts);
  }
  
  open() {
    // when the hall opens we want to open all it's rooms.
    for (var room in this.rooms) {
      var _current = this.rooms[room];
      _current.open();
    }
    this.setState("open");
    return Promise.resolve();
  }
  
  close() {
    for (var room in this.rooms) {
      var _current = this.rooms[room];
      _current.close();
    }
    this.setState("close");
    return Promise.resolve();
  }
}
module.exports = Hall;
