var hallTemplate = `
<h2>Hall with Rooms</h2>
<p>As you can imagine a more complex user interface/application would be comprised of man rooms.  Well these rooms can be collected into halls and then the hall will open the rooms when it opens. This is to aid in room structure and just keeping things more together.</p>

<h3>Here are your Hall need to knows.</h3>
A hall is like a hall in a house.  It holds access points to rooms.

<h4>Properties</h4>
<dl>
  <dt>hall.id</dt>
  <dd>opts.id or random number</dd>
  <dt>hall.rooms</dt>
  <dd>opts.rooms or empty object: An object containing the rooms inside the hall.</dd>
  <dt>hall.states</dt>
  <dd>
    Default hall states.
    <ul>
      <li>lock</li>
      <li>open</li>
      <li>close</li>
    </ul>
  </dd>
</dl>

<h4>Methods</h4>
<h5>Hall Methods</h5>
<dl>
  <dt>hall.open()</dt>
  <dd>Open the hall and all the rooms inside.</dd>
  <dt>hall.close()</dt>
  <dd>Close the hall and all the rooms inside.</dd>
  <dt>hall.speak(msg, resource)</dt>
  <dd>Speak a message from the current holder of the state machine with an optional data resource.</dd>
  <dt>hall.listen(msg, callback)</dt>
  <dd>Liseten for a message on the current holder of the state machine and execute a callback.</dd>
  <dt>hall.once(msg, callback)</dt>
  <dd>Listen once for a message on the current holder of the state machine and execute a callabck.</dd>
  <dt>hall.ignore(msg, callback)</dt>
  <dd>Remove a listener from the holder of the current state machine, and it's callback.</dd>
  <dt>hall.setState(state)</dt>
  <dd>Set a ste for a room, and then speak the leaving, entering, entered events.</dd>
  <dt>hall.addState(state)</dt>
  <dd>Add a state to the hall.</dd>
</dl>
<h5>Examplee</h5>
<pre><code class="language-javascript">var room1 = new amenti.Room({
  selector: "some selector",
  template: "some template"
})
var room2 = new amenti.Room({
  selector: "another selector",
  template: "another template"
})

var hall = new amenti.Hall({
  rooms: {room1, room2}
})
hall.open();</code></pre>
`;
