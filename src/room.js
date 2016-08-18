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
    opts.auto = false;
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
  build(place="inner") {
    // store previous state and set state to biuld
    const stateBeforeBuid = this.state;
    this.setState("build");

    this.el = sel.get(this.selector);
    this.el.dataset.id = this.id;
        
    const tmp = document.createElement("DIV");

    switch (place) {
    case "append":
      this.el.insertAdjacentHTML("beforeend", tmp.innerHTML);
      break;

    case "prepend":
      this.el.insertAdjacentHTML("afterbegin", tmp.innerHTML);
      break;
      
    default:
      tmp.innerHTML = this.template;
    }

    if (typeof this.onBuild == "function") {
      this.onBuild();
    }
    // set the state back to what it was before build;
    this.setState(stateBeforeBuid);
    return Promise.resolve();
  }

  // DESTROY ROOM
  destroy() {
    sel.get(this.selector).innerHTML = "";
  }
}
module.exports = Room;
