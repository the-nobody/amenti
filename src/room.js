"use strict";
/*
room
*/

const Base = require("./base.js");
const sel = require("./sel.js");

class Room extends Base {
  constructor(opts={}) {
    opts.selector = opts.selector || "body";
    opts.template = opts.template || "";
    opts.onOpen = opts.onOpen || false;
    opts.onBuild = opts.onBuild || false;
    opts.states = ["lock", "open", "close", "build"];
    super(opts);
  }
  // OPEN ROOM
  open() {
    if (this.state === "open") { return this.build(); }
    this.build()
      .then(() => {
        if (typeof this.onOpen == "function") {
          this.onOpen();
        }
      });
    this.setState("open");
    return Promise.resolve();
  }
  
  // CLOSE ROOM
  close() {
    this.destroy();
    this.setState("close");
    return Promise.resolve();
  }

  // BUILD ROOM
  build() {
    this.el = sel.get(this.selector);
    this.el.dataset.id = this.id;

    const tmp = document.createElement("DIV");
    tmp.innerHTML = this.template;

    this.el.innerHTML = tmp.innerHTML;

    if (typeof this.onBuild == "function") {
      this.onBuild();
    }
    return Promise.resolve();
  }

  // DESTROY ROOM
  destroy() {
    sel.get(this.selector).innerHTML = "";
  }
}
module.exports = Room;
