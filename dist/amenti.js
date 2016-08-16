/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// used to create a global window amenti for the browserify build
	var Amenti = {
	  Hall: __webpack_require__(1),
	  Guide: __webpack_require__(4),
	  Room: __webpack_require__(5),
	  sel: __webpack_require__(6)
	};

	window.amenti = Amenti;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	// GREAT HALL
	var Base = __webpack_require__(2);

	class Hall extends Base {
	  constructor(opts={}) {
	    opts.rooms = opts.rooms || {};
	    super(opts);
	  }
	  
	  open() {
	    // when the hall opens we want to open all it's rooms.
	    for (var room in this.rooms) {
	      var _current = this.rooms[room];
	      _current.open();
	    }
	    this.setState("open");
	    return Promise.resolve();
	  }
	  
	  close() {
	    for (var room in this.rooms) {
	      var _current = this.rooms[room];
	      _current.close();
	    }
	    this.setState("close");
	    return Promise.resolve();
	  }
	}
	module.exports = Hall;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var {EventEmitter} = __webpack_require__(3);
	// utility for setting this options in a class
	// Builder
	class Base {
	  constructor(opts={}) {
	    opts.id = opts.id || Math.floor((1 + Math.random()) * 0x10000);
	    opts.states = opts.states || ["lock", "open", "close"];
	    for (var opt in opts) {
	      this[opt] = opts[opt];
	    }
	    this._emitter = new EventEmitter({});
	    this.state = this.states[0];
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
	  
	  setState(state) {
	    var _current = this.state;
	    var _state = this.states.includes(state);
	    var self = this;
	    
	    if (!_state) { throw new Error("The state you passed in was not a valid state.  Please use addState('*state*')."); }
	    if (state === _current) { throw new Error(`Currently in state: ${state}`); }

	    if (_current) {
	      self.speak(`${_current}:leaving`).then(() => {
	        self.speak(`${state}:entering`).then(() => {
	          self.state = state;
	          self.speak(`${self._current}:entered`);
	        });
	      });
	    }
	    return Promise.resolve();
	  }
	  addState(state) {
	    this.states.push(state);
	  }
	}

	module.exports = Base;


/***/ },
/* 3 */
/***/ function(module, exports) {

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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	// guide only handles guiding/routing traffic.
	var Base = __webpack_require__(2);

	// GUIDE Class
	class Guide extends Base {
	  constructor(opts={}) {
	    opts.halls = opts.halls || {};
	    super(opts);
	  }
	  // process a route/hash change in the url
	  route(trigger, callback) {
	    var self = this;
	    
	    // set listener
	    self.listen(trigger, callback);
	    
	    function hashChange() {
	      self.speak(location.hash.substr(1));
	    }
	    if (trigger && location.hash.substr(2).length) hashChange();
	    window.addEventListener("hashchange", hashChange, false);
	  }
	  open() {
	    for (var hall in this.halls) {
	      this.halls[hall].open();
	    }
	    this.setState("open");
	    return Promise.resolve();
	  }
	  close() {
	    for (var hall in this.halls) {
	      this.halls[hall].close();
	    }
	    this.setState("close");
	    return Promise.resolve();
	  }
	}

	module.exports = Guide;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*
	room
	*/

	var Base = __webpack_require__(2);
	var sel = __webpack_require__(6);

	class Room extends Base {
	  constructor(opts={}) {
	    opts.selector = opts.selector || "body";
	    opts.template = opts.template || "";
	    opts.onOpen = opts.onOpen || false;
	    opts.onBuild = opts.onBuild || false;
	    opts.states = ["lock", "open", "close", "build"];
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

	    var tmp = document.createElement("DIV");
	    var self = this;
	    tmp.innerHTML = this.template;
	    // assign a data-id to all the first level children
	    // so remove is simple
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
	    sel.all(`[data-id="${this.id}"]`).forEach(ele => {
	      ele.remove();
	    });
	  }
	}
	module.exports = Room;


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	function Sel(selector) {
	  return document.querySelector(selector);
	}

	Sel.dom = cb => {
	  document.addEventListener("DOMContentLoaded", function(event) {
	    cb.call(event);
	  });
	};

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


/***/ }
/******/ ]);