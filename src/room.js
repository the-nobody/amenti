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
    opts.states = ["lock", "open", "close", "build"]
    super(opts);
  }
  // INIT
  // init returns a promise resolve for .then use after init
  // this allows chaining of loading of multiple views in a page.
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

  close() {
    this.destroy();
    this.setState("close");
    return Promise.resolve();
  }
  // BUILD
  // build element template and call it from the templates global variable
  // initialize any views contained in the view
  // returns a Promise
  build() {
    this.el = sel(this.selector);

    const $parent = this.el.parentNode || this.el;
    
    const tmp = document.createElement("DIV");
    const self = this;
    tmp.innerHTML = this.template;
    for (var child of tmp.children) {
      child.dataset.id = self.id;
    }
    this.el.innerHTML = tmp.innerHTML;

    // run any onBuild code set in the view
    if (typeof this.onBuild == "function") {
      this.onBuild();
    }
    return Promise.resolve();
  }

  // REMOVE
  // set html of view element to blank
  // return promise
  destroy() {
    this.el.innerHTML = "";
  }
}
module.exports = Room;
