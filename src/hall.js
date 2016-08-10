// GREAT HALL
const Base = require("./base.js");

class Hall extends Base {
  constructor(opts) {
    opts = opts || {};
    opts.id = opts.id || Math.floor((1 + Math.random()) * 0x10000);
    opts.rooms = opts.rooms || [];
    opts.states = {
      lock: `hall:${opts.id}:lock`,
      open: `hall:${opts.id}:open`,
      idle: `hall:${opts.id}:idle`,
      close: `hall:${opts.id}:close`
    };
    super(opts);
  }
  
  open() {
    this.state.set("idle");
    return Promise.resolve();
  }
  
  close() {
    this.state.set("close");
    return Promise.resolve();
  }
  
}

module.exports = Hall;
