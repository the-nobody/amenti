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
