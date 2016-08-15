
function Sel(selector) {
  return document.querySelector(selector);
}

Sel.dom = cb => {
  document.addEventListener("DOMContentLoaded", function(event) {
    cb.call(event);
  });
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
