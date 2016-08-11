"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
room
*/

var Base = require("./base.js");
var sel = require("./sel.js");

var Room = function (_Base) {
  _inherits(Room, _Base);

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
      var _this2 = this;

      if (this.isOpen) {
        return this.build();
      }
      this.isOpen = true;
      this.build().then(function () {
        if (typeof _this2.onOpen == "function") {
          _this2.onOpen();
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
      var _this3 = this;

      var closeRoom = this.selector;
      this.destroy().then(function () {
        _this3.isOpen = false;

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