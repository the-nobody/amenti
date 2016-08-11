(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
// used for the browserify package
window.amenti = require("./index.js");

},{"./index.js":3}],3:[function(require,module,exports){
module.exports = {
  Hall: require("./src/hall.js"),
  Guide: require("./src/guide.js"),
  Room: require("./src/room.js"),
  sel: require("./src/sel.js")
};

},{"./src/guide.js":5,"./src/hall.js":6,"./src/room.js":7,"./src/sel.js":8}],4:[function(require,module,exports){
const State = require("./state.js");
// utility for setting this options in a class
// Builder
class Base {
  constructor(opts) {
    opts = opts || {};
    opts.states = opts.states || {};
    
    for (var opt in opts) {
      this[opt] = opts[opt];
    }
    this.state = new State(this.states);
  }
}

module.exports = Base;

},{"./state.js":9}],5:[function(require,module,exports){
// Emitter: using node event emitter
const Emitter = require("events").EventEmitter;
const Base = require("./base.js");

// GUIDE Class
class Guide extends Base {
  constructor(opts) {
    super(opts);
    this.halls = {};
    this.rooms = {};
    this._emitter = new Emitter({});
  }
  
  speak(msg, res=false) {
    this._emitter.emit(msg, res);
    return Promise.resolve();
  }
  listen(msg, callback) {
    this._emitter.on(msg, callback);
    return Promise.resolve();
  }
  once(msg, callback) {
    this._emitter.once(msg, callback);
    return Promise.resolve();
  }
  remove(msg, callback) {
    this._emitter.removeListener(msg, callback);
    return Promise.resolve();
  }
  
  // process a route/hash change in the url
  route(trigger) {
    const self = this;
    function hashChange() {
      self.speak(location.hash.substr(2));
    }
    if (trigger && location.hash.substr(2).length) hashChange();
    window.addEventListener("hashchange", hashChange, false);
  }
  
  // add a hall or room
  add(type, res) {
    res = Array.isArray(res) ? res : [res];
    const retIds = [];
    res.forEach(val => {
      this[type][val.id] = val;
      retIds.push(val.id);
    });
    return retIds;
  }
  
  // delete a hall or room
  del(type, id) {
    delete this[type][id];
    return this[type];
  }
}

module.exports = Guide;

},{"./base.js":4,"events":1}],6:[function(require,module,exports){
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

},{"./base.js":4}],7:[function(require,module,exports){
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

},{"./base.js":4,"./sel.js":8}],8:[function(require,module,exports){

function Sel(selector) {
  return document.querySelector(selector);
}

Sel.all = selector => {
  return document.querySelectorAll(selector);
};

Sel.add = (el, _class) => {
  _class = _class.split(" ");
  _class.forEach(cl => {
    el.classList.add(cl);
  });
  return el.classList;
};
  
Sel.remove = (el, _class) => {
  if (!el || !_class) return "";
  _class = _class.split(" ");
  _class.forEach(cl => {
    el.classList.remove(cl);
  });
  return el.classList;
};

Sel.next = el => {
  return el.nextElementSibling;
};

Sel.prev = el => {
  return el.previousElementSibling;
};

Sel.has = (el, _class) => {
  return el.classList.contains(_class);
};

Sel.toggle = (el, _class) => {
  return el.classList.toggle(_class);
};


module.exports = Sel;

},{}],9:[function(require,module,exports){
/* State Machine */
class State {
  constructor(states) {
    this._states = states || {};
    this._states.lock = states.lock || "statelock:default";
    this._current = "lock";
  }
  
  setter(state) {
    const _current = this._states[this._current] || false;
    const _state = this._states[state] || false;

    if (!_state) return;

    if (state === this._current) {
      return console.log(`You are already in state: ${state}`);
    }

    if (_current) {
      guide.speak(`${_current}:leave`);
    }

    guide.speak(`${_state}:enter`);

    this._current = state;

    guide.speak(`${_state}`);
    return Promise.resolve();
  }
  
  get(state) {
    return this._states[state];
  }

  current() {
    return this._current;
  }

  add(state, msg) {
    this._states[state] = msg;
    return this._states[state];
  }
}

module.exports = State;

},{}]},{},[2]);
