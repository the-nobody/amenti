"use strict";

const Base = require("./base.js");
const sel = require("./sel.js");

class Room extends Base {
  constructor(opts={}) {
    opts.selector = opts.selector || "body";
    opts.template = opts.template || "";
    opts.auto = opts.auto || false;
    super(opts);
    
    if (this.auto) {
      setTimeout(() => {
        this.open();
      }, 10);
    }
  }
  // OPEN ROOM
  open() {
    this.build().then(() => {
      this.stateSet("open");
    });
    return Promise.resolve();
  }
  
  // CLOSE ROOM
  close() {
    this.destroy();
    this.stateSet("close");
    delete this.el.dataset.id;
    return Promise.resolve();
  }
  
  // BUILD ROOM
  build(place="inner") {
    this.el = sel.get(this.selector);
    this.el.dataset.id = this.id;

    this.stateSet("build");

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
    return Promise.resolve();
  }

  // DESTROY ROOM
  destroy() {
    sel.get(this.selector).innerHTML = "";
  }
}
module.exports = Room;
