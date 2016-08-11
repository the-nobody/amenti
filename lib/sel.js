"use strict";

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