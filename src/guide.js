"use strict";
// guide only handles guiding/routing traffic.
const Base = require("./base.js");

// GUIDE Class
class Guide extends Base {
  constructor(opts={}) {
    opts.halls = opts.halls || {};
    super(opts);
  }
  // process a route/hash change in the url
  route(trigger, callback) {
    const self = this;
    
    // set listener
    self.listen(trigger, callback);
    
    function hashChange() {
      const _hash = location.hash.substr(1).split("|");
      self.speak(_hash[0], _hash[1]);
    }
    if (trigger && location.hash.substr(2).length) hashChange();
    window.addEventListener("hashchange", hashChange, false);
  }
  open() {
    for (var hall in this.halls) {
      this.halls[hall].open();
    }
    this.setState("open");
    return Promise.resolve();
  }
  close() {
    for (var hall in this.halls) {
      this.halls[hall].close();
    }
    this.setState("close");
    return Promise.resolve();
  }
}

module.exports = Guide;
