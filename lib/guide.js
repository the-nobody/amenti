"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Emitter: using node event emitter
var Emitter = require("events").EventEmitter;
var Base = require("./base.js");

// GUIDE Class

var Guide = function (_Base) {
  _inherits(Guide, _Base);

  function Guide(opts) {
    _classCallCheck(this, Guide);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Guide).call(this, opts));

    _this.halls = {};
    _this.rooms = {};
    _this._emitter = new Emitter({});
    return _this;
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
      var _this2 = this;

      res = Array.isArray(res) ? res : [res];
      var retIds = [];
      res.forEach(function (val) {
        _this2[type][val.id] = val;
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