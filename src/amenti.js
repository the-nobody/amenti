// used to create a global window amenti for the browserify build
const Amenti = {
  Hall: require("./hall.js"),
  Guide: require("./guide.js"),
  Room: require("./room.js"),
  sel: require("./sel.js")
};

window.amenti = Amenti;
