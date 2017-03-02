(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
module.exports = {
  Hall: require("./src/hall.js"),
  Guide: require("./src/guide.js"),
  Room: require("./src/room.js"),
  sel: require("./src/sel.js"),
};

},{"./src/guide.js":4,"./src/hall.js":5,"./src/room.js":6,"./src/sel.js":7}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],3:[function(require,module,exports){
var {EventEmitter} = require("events");
// utility for setting this options in a class
// Builder
class Base {
  constructor(opts) {
    opts = opts || {};
    opts.id = opts.id || Math.floor((1 + Math.random()) * 0x10000);
    opts.states = opts.states || ["lock", "open", "close", "build", "loading", "ready"];
    for (var opt in opts) {
      this[opt] = opts[opt];
    }
    this._emitter = new EventEmitter({});
    this._state = this.states[0];
    this.init();
  }
  
  init() {
    this.listen("loading:entering", () => {
      if (this.el) this.el.classList.add("loading");
    });

    this.listen("loading:leaving", () => {
      if (this.el) this.el.classList.remove("loading");
    });
    
    // init any listen events
    if (this.hasOwnProperty("listeners")) {
      for (var l in this.listeners) {
        this.listen(l, this.listeners[l].bind(this));
      }
    }
  }
  
  speak(msg, resource=false) {
    this._emitter.emit(msg, resource);
    return Promise.resolve();
  }
  listen(msg, callback) {
    this._emitter.on(`${msg}`, callback);
    return Promise.resolve();
  }
  once(msg, callback) {
    this._emitter.once(msg, callback);
    return Promise.resolve();
  }
  ignore(msg, callback) {
    this._emitter.removeListener(msg, callback);
    return Promise.resolve();
  }
  
  stateSet(state, resource=false) {
    const _state = this.states.includes(state);
    
    if (!_state) { throw new Error("The state you passed in was not a valid state.  Please use addState('*state*')."); }
    if (state === this._state) { throw new Error(`Currently in state: ${state}`); }
    
    this.speak(`${this._state}:leaving`).then(() => {
      this.speak(`${state}:entering`, resource).then(() => {
        this._state = state;
        this.speak(`${this._state}:entered`, resource);
      });
    });
    return Promise.resolve();
  }
  stateAdd(state) {
    state = Array.isArray(state) ? state : [state];
    state.forEach(st => {
      this.states.push(st);
    });
  }
  
  
}

module.exports = Base;

},{"events":2}],4:[function(require,module,exports){
"use strict";
// guide only handles guiding/routing traffic.
const Base = require("./base.js");

// GUIDE Class
class Guide extends Base {
  constructor(opts={}) {
    opts.halls = {};
    opts.rooms = {};
    super(opts);
  }
  // process a route/hash change in the url
  route(trigger, callback) {
    this.listen(trigger, callback);
  }

  open() {
    for (var hall in this.halls) {
      this.halls[hall].open();
    }
    this.stateSet("open");

    
    return Promise.resolve();
  }
  close() {
    for (var hall in this.halls) {
      this.halls[hall].close();
    }
    this.stateSet("close");
    return Promise.resolve();
  }
  
  addHalls(halls) {
    for (var hall in halls) {
      const _current = halls[hall];
      this.halls[_current.id] = _current;
    }
  }
  
  addRooms(rooms) {
    for (var room in rooms) {
      const _current = rooms[room];
      this.rooms[_current.id] = _current;
    }
  }
}

module.exports = Guide;

},{"./base.js":3}],5:[function(require,module,exports){
"use strict";
// GREAT HALL
const Base = require("./base.js");

class Hall extends Base {
  constructor(opts={}) {
    opts.rooms = opts.rooms || {};
    super(opts);
  }
  
  open() {
    // when the hall opens we want to open all it's rooms.
    this.stateSet("open");
    return Promise.resolve();
  }
  
  close() {
    for (var room in this.rooms) {
      const _current = this.rooms[room];
      _current.close();
    }
    this.stateSet("close");
    return Promise.resolve();
  }
}
module.exports = Hall;

},{"./base.js":3}],6:[function(require,module,exports){
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

},{"./base.js":3,"./sel.js":7}],7:[function(require,module,exports){
"use strict";
class Sel {
  static dom(cb) {
    document.addEventListener("DOMContentLoaded", function(event) {
      cb.call(event);
    });
  }

  static get(selector) {
    return document.querySelector(selector);
  }

  static getAll(selector) {
    return document.querySelectorAll(selector);
  }
  
  static next(el) {
    return el.nextElementSibling;
  }
  static prev(el) {
    return el.previousElementSibling;
  }
  static add(el, _class) {
    _class = _class.split(" ");
    _class.forEach(cl => {
      el.classList.add(cl);
    });
    return el.classList;
  }
  static remove(el, _class) {
    if (!el || !_class) return "";
    _class = _class.split(" ");
    _class.forEach(cl => {
      el.classList.remove(cl);
    });
    return el.classList;
  }
  static has(el, _class) {
    return el.classList.contains(_class);
  }
  static toggle(el, _class) {
    return el.classList.toggle(_class);
  }
}
module.exports = Sel;

},{}]},{},[1]);
