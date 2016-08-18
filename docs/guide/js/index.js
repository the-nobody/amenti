/* global amenti, guideTemplate, roomTemplate, hallTemplate, Prism */
(function() {
  // first we are going to create a few rooms
  var header = new amenti.Room({
    selector: "header",
    template: `
      <h1 class="logo">amenti</h1>
      <nav>
        <a href="../index.html">Home</a>
        <a href="#goto:room">Room</a>
        <a href="#goto:hall">Hall</a>
        <a href="#goto:guide">Guide</a>
        <a href="https://github.com/the-nobody/amenti" target="github">Github</a>
      </nav>
    `
  });

  var main = new amenti.Room({
    selector: "main",
    template: guideTemplate
  });

  // let's create a guide to hold all the rooms and makes routes available
  var mainHall = new amenti.Hall({
    rooms: {header,main}
  });

  // now let's stor the hall in a guide and setup some routes to change the content.
  var guide = new amenti.Guide({
    halls: {mainHall}
  });

  // routes for when stuff happens
  guide.route("goto:room", _goRoom);
  function _goRoom() {
    main.template = roomTemplate;
    main.build();
    Prism.highlightElement(amenti.sel(".language-javascript"));
  }

  guide.route("goto:hall", _goHall);
  function _goHall() {
    main.template = hallTemplate;
    main.build();
    Prism.highlightElement(amenti.sel(".language-javascript"));
  }

  guide.route("goto:guide", _goGuide);
  function _goGuide() {
    main.template = guideTemplate;
    main.build();
    Prism.highlightElement(amenti.sel(".language-javascript"));
  }
  guide.open();
  // set the guide into the window
  window.guide = guide;
})();
