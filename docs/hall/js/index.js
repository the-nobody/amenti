// first we are going to create a few rooms
var header = new amenti.Room({
  selector: "header",
  template: `
    <h1 class="logo">amenti:Hall &amp; Rooms</h1>
    <nav>
      <a href="../index.html">Home</a>
      <a href="../rooms/index.html">Rooms</a>
      <a href="#">Hall &amp; Rooms</a>
      <a href="../guide_hall_room/index.html">Guide, Hall &amp; Rooms</a>
    </nav>
  `
});

var main = new amenti.Room({
  selector: "main",
  template: hallTemplate
});

var footer = new amenti.Room({
  selector: "footer",
  template: `
    <h3>Footer</h3>
  `
});

// first let's create a guide to hold all the rooms and makes routes available
var hall = new amenti.Hall({
  rooms: {header,main,footer}
});

hall.open();
