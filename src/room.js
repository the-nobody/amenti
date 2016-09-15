"use strict";

const Base = require("./base.js");
const sel = require("./sel.js");

class Room extends Base {
  constructor(opts={}) {
    opts.selector = opts.selector || "body";
    opts.template = opts.template || "";
    opts.auto = opts.auto || false;
    opts.onOpen = opts.onOpen || false;
    opts.onBuild = opts.onBuild || false;
    opts.states = ["lock", "open", "close", "build"];
    super(opts);
  }
  // OPEN ROOM
  open() {
    this.build().then(() => {
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
    delete this.el.dataset.id;
    return Promise.resolve();
  }

  // BUILD ROOM
  build(place="inner") {
    this.el = sel.get(this.selector);
    this.el.dataset.id = this.id;
    
    this.setState("build");

    const tmp = document.createElement("DIV");
    tmp.innerHTML = this.template;
    switch (place) {
    case "append":
      this.el.insertAdjacentHTML("beforeend", tmp.innerHTML);
      break;

    case "prepend":
      this.el.insertAdjacentHTML("afterbegin", tmp.innerHTML);
      break;
      
    default:
      this.el.innerHTML = tmp.innerHTML;
    }

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
