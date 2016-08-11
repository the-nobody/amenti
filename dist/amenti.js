"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/******/(function (modules) {
	// webpackBootstrap
	/******/ // The module cache
	/******/var installedModules = {};

	/******/ // The require function
	/******/function __webpack_require__(moduleId) {

		/******/ // Check if module is in cache
		/******/if (installedModules[moduleId])
			/******/return installedModules[moduleId].exports;

		/******/ // Create a new module (and put it into the cache)
		/******/var module = installedModules[moduleId] = {
			/******/exports: {},
			/******/id: moduleId,
			/******/loaded: false
			/******/ };

		/******/ // Execute the module function
		/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

		/******/ // Flag the module as loaded
		/******/module.loaded = true;

		/******/ // Return the exports of the module
		/******/return module.exports;
		/******/
	}

	/******/ // expose the modules object (__webpack_modules__)
	/******/__webpack_require__.m = modules;

	/******/ // expose the module cache
	/******/__webpack_require__.c = installedModules;

	/******/ // __webpack_public_path__
	/******/__webpack_require__.p = "";

	/******/ // Load entry module and return exports
	/******/return __webpack_require__(0);
	/******/
})(
/************************************************************************/
/******/[
/* 0 */
/***/function (module, exports, __webpack_require__) {

	module.exports = {
		Hall: __webpack_require__(1),
		Guide: __webpack_require__(4),
		Room: __webpack_require__(6),
		sel: __webpack_require__(7)
	};

	/***/
},
/* 1 */
/***/function (module, exports, __webpack_require__) {

	// GREAT HALL
	var Base = __webpack_require__(2);

	var Hall = function (_Base) {
		_inherits(Hall, _Base);

		function Hall(opts) {
			_classCallCheck(this, Hall);

			opts = opts || {};
			opts.id = opts.id || Math.floor((1 + Math.random()) * 0x10000);
			opts.rooms = opts.rooms || [];
			opts.states = {
				lock: "hall:" + opts.id + ":lock",
				open: "hall:" + opts.id + ":open",
				idle: "hall:" + opts.id + ":idle",
				close: "hall:" + opts.id + ":close"
			};
			return _possibleConstructorReturn(this, Object.getPrototypeOf(Hall).call(this, opts));
		}

		_createClass(Hall, [{
			key: "open",
			value: function open() {
				this.state.set("idle");
				return Promise.resolve();
			}
		}, {
			key: "close",
			value: function close() {
				this.state.set("close");
				return Promise.resolve();
			}
		}]);

		return Hall;
	}(Base);

	module.exports = Hall;

	/***/
},
/* 2 */
/***/function (module, exports, __webpack_require__) {

	var State = __webpack_require__(3);
	// utility for setting this options in a class
	// Builder

	var Base = function Base(opts) {
		_classCallCheck(this, Base);

		opts = opts || {};
		opts.states = opts.states || {};

		for (var opt in opts) {
			this[opt] = opts[opt];
		}
		this.state = new State(this.states);
	};

	module.exports = Base;

	/***/
},
/* 3 */
/***/function (module, exports) {

	/* State Machine */
	var State = function () {
		function State(states) {
			_classCallCheck(this, State);

			this._states = states || {};
			this._states.lock = states.lock || "statelock:default";
			this._current = "lock";
		}

		_createClass(State, [{
			key: "setter",
			value: function setter(state) {
				var _current = this._states[this._current] || false;
				var _state = this._states[state] || false;

				if (!_state) return;

				if (state === this._current) {
					return console.log("You are already in state: " + state);
				}

				if (_current) {
					guide.speak(_current + ":leave");
				}

				guide.speak(_state + ":enter");

				this._current = state;

				guide.speak("" + _state);
				return Promise.resolve();
			}
		}, {
			key: "get",
			value: function get(state) {
				return this._states[state];
			}
		}, {
			key: "current",
			value: function current() {
				return this._current;
			}
		}, {
			key: "add",
			value: function add(state, msg) {
				this._states[state] = msg;
				return this._states[state];
			}
		}]);

		return State;
	}();

	module.exports = State;

	/***/
},
/* 4 */
/***/function (module, exports, __webpack_require__) {

	// Emitter: using node event emitter
	var Emitter = __webpack_require__(5).EventEmitter;
	var Base = __webpack_require__(2);

	// GUIDE Class

	var Guide = function (_Base2) {
		_inherits(Guide, _Base2);

		function Guide(opts) {
			_classCallCheck(this, Guide);

			var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Guide).call(this, opts));

			_this2.halls = {};
			_this2.rooms = {};
			_this2._emitter = new Emitter({});
			return _this2;
		}

		_createClass(Guide, [{
			key: "speak",
			value: function speak(msg) {
				var res = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

				this._emitter.emit(msg, res);
				return Promise.resolve();
			}
		}, {
			key: "listen",
			value: function listen(msg, callback) {
				this._emitter.on(msg, callback);
				return Promise.resolve();
			}
		}, {
			key: "once",
			value: function once(msg, callback) {
				this._emitter.once(msg, callback);
				return Promise.resolve();
			}
		}, {
			key: "remove",
			value: function remove(msg, callback) {
				this._emitter.removeListener(msg, callback);
				return Promise.resolve();
			}

			// process a route/hash change in the url

		}, {
			key: "route",
			value: function route(trigger) {
				var self = this;
				function hashChange() {
					self.speak(location.hash.substr(2));
				}
				if (trigger && location.hash.substr(2).length) hashChange();
				window.addEventListener("hashchange", hashChange, false);
			}

			// add a hall or room

		}, {
			key: "add",
			value: function add(type, res) {
				var _this3 = this;

				res = Array.isArray(res) ? res : [res];
				var retIds = [];
				res.forEach(function (val) {
					_this3[type][val.id] = val;
					retIds.push(val.id);
				});
				return retIds;
			}

			// delete a hall or room

		}, {
			key: "del",
			value: function del(type, id) {
				delete this[type][id];
				return this[type];
			}
		}]);

		return Guide;
	}(Base);

	module.exports = Guide;

	/***/
},
/* 5 */
/***/function (module, exports) {

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
	EventEmitter.prototype.setMaxListeners = function (n) {
		if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError('n must be a positive number');
		this._maxListeners = n;
		return this;
	};

	EventEmitter.prototype.emit = function (type) {
		var er, handler, len, args, i, listeners;

		if (!this._events) this._events = {};

		// If there is no 'error' event listener then throw.
		if (type === 'error') {
			if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
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

		if (isUndefined(handler)) return false;

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
			for (i = 0; i < len; i++) {
				listeners[i].apply(this, args);
			}
		}

		return true;
	};

	EventEmitter.prototype.addListener = function (type, listener) {
		var m;

		if (!isFunction(listener)) throw TypeError('listener must be a function');

		if (!this._events) this._events = {};

		// To avoid recursion in the case that type === "newListener"! Before
		// adding it to the listeners, first emit "newListener".
		if (this._events.newListener) this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);

		if (!this._events[type])
			// Optimize the case of one listener. Don't need the extra array object.
			this._events[type] = listener;else if (isObject(this._events[type]))
			// If we've already got an array, just append.
			this._events[type].push(listener);else
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
				console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
				if (typeof console.trace === 'function') {
					// not supported in IE 10
					console.trace();
				}
			}
		}

		return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function (type, listener) {
		if (!isFunction(listener)) throw TypeError('listener must be a function');

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
	EventEmitter.prototype.removeListener = function (type, listener) {
		var list, position, length, i;

		if (!isFunction(listener)) throw TypeError('listener must be a function');

		if (!this._events || !this._events[type]) return this;

		list = this._events[type];
		length = list.length;
		position = -1;

		if (list === listener || isFunction(list.listener) && list.listener === listener) {
			delete this._events[type];
			if (this._events.removeListener) this.emit('removeListener', type, listener);
		} else if (isObject(list)) {
			for (i = length; i-- > 0;) {
				if (list[i] === listener || list[i].listener && list[i].listener === listener) {
					position = i;
					break;
				}
			}

			if (position < 0) return this;

			if (list.length === 1) {
				list.length = 0;
				delete this._events[type];
			} else {
				list.splice(position, 1);
			}

			if (this._events.removeListener) this.emit('removeListener', type, listener);
		}

		return this;
	};

	EventEmitter.prototype.removeAllListeners = function (type) {
		var key, listeners;

		if (!this._events) return this;

		// not listening for removeListener, no need to emit
		if (!this._events.removeListener) {
			if (arguments.length === 0) this._events = {};else if (this._events[type]) delete this._events[type];
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
			while (listeners.length) {
				this.removeListener(type, listeners[listeners.length - 1]);
			}
		}
		delete this._events[type];

		return this;
	};

	EventEmitter.prototype.listeners = function (type) {
		var ret;
		if (!this._events || !this._events[type]) ret = [];else if (isFunction(this._events[type])) ret = [this._events[type]];else ret = this._events[type].slice();
		return ret;
	};

	EventEmitter.prototype.listenerCount = function (type) {
		if (this._events) {
			var evlistener = this._events[type];

			if (isFunction(evlistener)) return 1;else if (evlistener) return evlistener.length;
		}
		return 0;
	};

	EventEmitter.listenerCount = function (emitter, type) {
		return emitter.listenerCount(type);
	};

	function isFunction(arg) {
		return typeof arg === 'function';
	}

	function isNumber(arg) {
		return typeof arg === 'number';
	}

	function isObject(arg) {
		return (typeof arg === "undefined" ? "undefined" : _typeof(arg)) === 'object' && arg !== null;
	}

	function isUndefined(arg) {
		return arg === void 0;
	}

	/***/
},
/* 6 */
/***/function (module, exports, __webpack_require__) {

	/*
 room
 */

	var Base = __webpack_require__(2);
	var sel = __webpack_require__(7);

	var Room = function (_Base3) {
		_inherits(Room, _Base3);

		function Room(opts) {
			_classCallCheck(this, Room);

			opts = opts || {};

			opts.id = opts.id || Math.floor((1 + Math.random()) * 0x10000);

			opts.selector = opts.selector || "body";
			opts.place = opts.place || "replace";

			opts.halls = opts.halls || [];

			opts.onOpen = opts.onOpen || false;
			opts.onBuild = opts.onBuild || false;

			opts.isOpen = false;

			opts.states = {
				lock: "room:" + opts.id + ":lock",
				open: "room:" + opts.id + ":open",
				idle: "room:" + opts.id + ":idle",
				close: "room:" + opts.id + ":close",
				build: "room:" + opts.id + ":build"
			};

			return _possibleConstructorReturn(this, Object.getPrototypeOf(Room).call(this, opts));
		}
		// INIT
		// init returns a promise resolve for .then use after init
		// this allows chaining of loading of multiple views in a page.


		_createClass(Room, [{
			key: "open",
			value: function open() {
				var _this5 = this;

				if (this.isOpen) {
					return this.build();
				}
				this.isOpen = true;
				this.build().then(function () {
					if (typeof _this5.onOpen == "function") {
						_this5.onOpen();
					}
				});
				// if window.guide add this room to it on opeen
				if (window.guide) {
					window.guide.rooms[this.id] = this;
				}
				this.state.set("idle");
				return Promise.resolve();
			}
		}, {
			key: "close",
			value: function close() {
				var _this6 = this;

				var closeRoom = this.selector;
				this.destroy().then(function () {
					_this6.isOpen = false;

					console.log("ROOM: " + closeRoom + " has been closed");
				});
			}
			// BUILD

			// build element template and call it from the templates global variable
			// initialize any views contained in the view
			// returns a Promise

		}, {
			key: "build",
			value: function build(place) {
				place = place || this.place;

				this.el = sel(this.selector);

				var $parent = this.el.parentNode || this.el;

				// dom parser to transform template into html node
				var tmp = document.createElement("DIV");
				tmp.innerHTML = this.template;

				var templ = tmp.children[0];
				templ.dataset.id = this.id;

				// check dom for element with data-id and if is already in dom set place property to inner
				var $id = sel(this.selector + "[data-id=\"" + this.id + "\"]");
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

		}, {
			key: "destroy",
			value: function destroy() {
				this.el.innerHTML = "";
				return Promise.resolve();
			}
		}]);

		return Room;
	}(Base);

	module.exports = Room;

	/***/
},
/* 7 */
/***/function (module, exports) {

	function Sel(selector) {
		return document.querySelector(selector);
	}

	Sel.all = function (selector) {
		return document.querySelectorAll(selector);
	};

	Sel.add = function (el, _class) {
		_class = _class.split(" ");
		_class.forEach(function (cl) {
			el.classList.add(cl);
		});
		return el.classList;
	};

	Sel.remove = function (el, _class) {
		if (!el || !_class) return "";
		_class = _class.split(" ");
		_class.forEach(function (cl) {
			el.classList.remove(cl);
		});
		return el.classList;
	};

	Sel.next = function (el) {
		return el.nextElementSibling;
	};

	Sel.prev = function (el) {
		return el.previousElementSibling;
	};

	Sel.has = function (el, _class) {
		return el.classList.contains(_class);
	};

	Sel.toggle = function (el, _class) {
		return el.classList.toggle(_class);
	};

	module.exports = Sel;

	/***/
}
/******/]);