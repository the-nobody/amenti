(function() {
  // first we are going to create a few rooms
  var header = new amenti.Room({
    selector: "header",
    template: `
      <h1 class="logo">amenti:Guide, Hall &amp; Rooms</h1>
      <nav>
        <a href="../index.html">Home</a>
        <a href="#goto:room">Rooms</a>
        <a href="#goto:hallRoom">Hall &amp; Rooms</a>
        <a href="#goto:guideHallRoom">Guide, Hall &amp; Rooms</a>
      </nav>
    `
  });

  var main = new amenti.Room({
    selector: "main",
    template: guideTemplate
  });

  var footer = new amenti.Room({
    selector: "footer",
    template: `
      <h3>Footer</h3>
    `
  });

  // let's create a guide to hold all the rooms and makes routes available
  var mainHall = new amenti.Hall({
    rooms: {header,main,footer}
  });

  // now let's stor the hall in a guide and setup some routes to change the content.
  var guide = new amenti.Guide({
    halls: {mainHall}
  })

  // routes for when stuff happens
  guide.route("goto:room", _goToRoom);
  function _goToRoom() {
    main.template = roomTemplate;
    main.build();
    Prism.highlightElement(amenti.sel(".language-javascript"));
  }

  guide.route("goto:hallRoom", _goToHallRoom);
  function _goToHallRoom() {
    main.template = hallRoomTemplate;
    main.build();
    Prism.highlightElement(amenti.sel(".language-javascript"));
  }

  guide.route("goto:guideHallRoom", _goToGuideHallRoom);
  function _goToGuideHallRoom() {
    main.template = guideHallRoomTemplate;
    main.build();
    Prism.highlightElement(amenti.sel(".language-javascript"));
  }
  guide.open();
  // set the guide into the window
  window.guide = guide;
})()
