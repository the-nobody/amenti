/*
room
*/

const Base = require("./base.js");
const sel = require("./sel.js");

class Room extends Base {
  constructor(opts) {
    opts = opts || {};

    opts.id = opts.id || Math.floor((1 + Math.random()) * 0x10000);

    opts.selector = opts.selector || "body";
    opts.place = opts.place || "replace";

    opts.halls = opts.halls || [];

    opts.onOpen = opts.onOpen || false;
    opts.onBuild = opts.onBuild || false;

    opts.isOpen = false;

    opts.states = {
      lock: `room:${opts.id}:lock`,
      open: `room:${opts.id}:open`,
      idle: `room:${opts.id}:idle`,
      close: `room:${opts.id}:close`,
      build: `room:${opts.id}:build`
    };
    
    super(opts);

  }
  // INIT
  // init returns a promise resolve for .then use after init
  // this allows chaining of loading of multiple views in a page.
  open() {
    if (this.isOpen) { return this.build(); }
    this.isOpen = true;
    this.build()
      .then(() => {
        if (typeof this.onOpen == "function") {
          this.onOpen();
        }
      });
    // if window.guide add this room to it on opeen
    if (window.guide) {
      window.guide.rooms[this.id] = this;
    }
    this.state.set("idle");
    return Promise.resolve();
  }

  close() {
    const closeRoom = this.selector;
    this.destroy().then(() => {
      this.isOpen = false;
      
      console.log(`ROOM: ${closeRoom} has been closed`);
    });
  }
  // BUILD
  
  // build element template and call it from the templates global variable
  // initialize any views contained in the view
  // returns a Promise
  build(place) {
    place = place || this.place;

    this.el = sel(this.selector);

    const $parent = this.el.parentNode || this.el;

    // dom parser to transform template into html node
    const tmp = document.createElement("DIV");
    tmp.innerHTML = this.template;

    const templ = tmp.children[0];
    templ.dataset.id = this.id;

    // check dom for element with data-id and if is already in dom set place property to inner
    const $id = sel(`${this.selector}[data-id="${this.id}"]`);
    place = $id ? "inner" : place;

    switch (place) {
    case "inner":
      this.el.innerHTML = templ.innerHTML;
      break;

    default:
      $parent.replaceChild(templ, this.el);
      this.el = templ;
    }
    
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
    return Promise.resolve();
  }
}

module.exports = Room;
