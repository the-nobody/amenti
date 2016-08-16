// first we are going to create a few rooms
var header = new amenti.Room({
  selector: "header",
  template: `
    <h1 class="logo">amenti:Hall</h1>
    <nav>
      <a href="../index.html">Home</a>
      <a href="../room/index.html">Room</a>
      <a href="#">Hall</a>
      <a href="../guide/index.html">Guide</a>
      <a href="https://github.com/the-nobody/amenti" target="github">Github</a>
    </nav>
  `
});

var main = new amenti.Room({
  selector: "main",
  template: hallTemplate
});

// first let's create a guide to hold all the rooms and makes routes available
var hall = new amenti.Hall({
  rooms: {header,main}
});

hall.open();
