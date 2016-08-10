/* global guide */
const Base = require("./base.js");
const sel = require("./sel.js");

class Room extends Base {
  constructor(opts) {
    opts = opts || {};

    opts.id = opts.id || Math.floor((1 + Math.random()) * 0x10000);

    opts.selector = opts.selector || "body";
    opts.place = opts.place || "replace";

    opts.halls = opts.halls || [];

    opts.isOpen = opts.isOpen || false;

    opts.onOpen = opts.onOpen || false;
    opts.onBuild = opts.onBuild || false;

    opts.states = {
      lock: `room:${opts.id}:lock`,
      open: `room:${opts.id}:open`,
      idle: `room:${opts.id}:idle`,
      close: `room:${opts.id}:close`,
      build: `room:${opts.id}:build`
    };
    
    super(opts);

    this._events = {};

  }

  on(eventType, selector, callback) {
    $(this.selector).on(eventType, selector, callback);
  }

  off(eventType, selector, callback) {
    $(this.selector).off(eventType, selector, callback);
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
      }).then(() => {
        this.setEvents();
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
  // apply any events contained in the view
  // initialize any views contained in the view
  // returns a Promise
  build(place) {
    place = place || this.place;

    this.el = sel(this.selector);

    const $parent = this.el.parentNode || this.el;

    // dom parser to transform template into html node
    const parser = new DOMParser();
    const templ = parser.parseFromString(this.template, "text/html").querySelector("body").children[0];
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
  // kill all events in the view
  // set html of view element to blank
  // return promise
  destroy() {
    this.off(this.selector);
    this.el.innerHTML = "";
    return Promise.resolve();
  }

  // apply events to view if there are events to apply
  // loop over events and use the dom delegate plugin
  setEvents() {
    const eventSplitter = /\s+/;
    if (this.events) {
      for (var x in this.events) {
        this._events[x] = this._events[x] || [];
        const ev = x.split(eventSplitter);
        const evt = {
          selector: ev[1],
          type: ev[0],
          callback: this[this.events[x]]
        };
        this._events[x].push(evt);
        this.on(ev[0], ev[1], this[this.events[x]]);
      }
    }
    return Promise.resolve();
  }
}

module.exports = Room;
