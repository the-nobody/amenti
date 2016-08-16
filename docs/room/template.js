var roomTemplate = `
<h2>Room</h2>
<p>This is your basic room.  A place where you can do stuff.  What you can do is really upto you.  Amenti is built on a flexible class architecture that allows you to pass in what ever properties you want, and interact with them on a state by state basis.</p>

<h3>Here are your Room need to knows.</h3>
A room is like a room in a house.  It holds all your stuff.

<h4>Properties</h4>
<dl>
  <dt>room.id</dt>
  <dd>opts.id or random number</dd>
  <dt>room.selector</dt>
  <dd>opts.selector or body: The dom selector that will contain the room</dd>
  <dt>room.el</dt>
  <dd>room.el: is the element of the selector.</dd>
  <dt>room.template</dt>
  <dd>opts.template or body: The html template string for the room</dd>
  <dt>room.onOpen</dt>
  <dd>opts.onOpen: function to execute when the room opens.</dd>
  <dt>room.onBuild</dt>
  <dd>opts.onBuild: function to execute when teh room builds.</dd>
  <dt>room.states</dt>
  <dd>
    Default room states.
    <ul>
      <li>lock</li>
      <li>open</li>
      <li>close</li>
      <li>build</li>
    </ul>
  </dd>
</dl>

<h4>Methods</h4>
<h5>Room Methods</h5>
<dl>
  <dt>room.open()</dt>
  <dd>Build the room and execute the onOpen function then return a resolved promise.  Can be interacted with by setting the state of the room or calling the method directly.</dd>
  <dt>room.close()</dt>
  <dd>Run the close procedure and then return a resolved promise.</dd>
  <dt>room.build()</dt>
  <dd>Build method that inserts the template html into the room selector</dd>
  <dt>room.destroy()</dt>
  <dd>Clear the content on the room selector.</dd>
  <dt>room.speak(msg, resource)</dt>
  <dd>Speak a message from the current holder of the state machine with an optional data resource.</dd>
  <dt>room.listen(msg, callback)</dt>
  <dd>Liseten for a message on the current holder of the state machine and execute a callback.</dd>
  <dt>room.once(msg, callback)</dt>
  <dd>Listen once for a message on the current holder of the state machine and execute a callabck.</dd>
  <dt>room.ignore(msg, callback)</dt>
  <dd>Remove a listener from the holder of the current state machine, and it's callback.</dd>
  <dt>room.setState(state)</dt>
  <dd>Set a ste for a room, and then speak the leaving, entering, entered events.</dd>
  <dt>room.addState("state")</dt>
  <dd>Add a state to the current this._states</dd>
</dl>
<h4>Examples</h4>
<h5>Basic Room</h5>
<pre><code class="language-javascript">var room = new amenti.Room({
  selector: "main", // this will put the template content inside a main tag.
  template: "My HTML string stuff can go here."
});

// this will run the open method and set the room into the open state.
room.open();
</code></pre>
<h5>Room in a Room</h5>
<pre><code class="language-javascript">var roomerInner = new amenti.Room({
  selector: ".inner",
  template: "&lt;h2&gt;The inner room&lt;/h2&gt;"
});

var roomOuter = new amenti.Room({
  selector: ".outer",
  template: "&lt;h1&gt;The Outer Room&lt;/h1&gt;&lt;div class='inner'&gt;&lt;/div&gt;",
  onOpen: function() {
    roomerInner.open();
  }
});
roomOuter.open();</code></pre>
`;
