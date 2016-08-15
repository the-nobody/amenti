var guideTemplate = `
<h2>Guide, Hall &amp; Rooms</h2>
<p>Now let's use a guide todo some route/content changes.</p>

<h3>Here are your Guide need to knows.</h3>
A guide is like a guide in a big building.  You put all your halls into it, and then all those rooms are brought along with it.
This really makes it so you can create some interconnection and send messages between different rooms.  You could fire a message that would
tell one room to close and then send it's data to another room for processing.  Really the whole development process of amenti is very much like building a real world thing.  You then put it all together with a map so it all make sense.

<h4>Properties</h4>
<dl>
  <dt>guide.id</dt>
  <dd>opts.id or random number</dd>
  <dt>guide.halls</dt>
  <dd>opts.halls or empty object: An object containing the halls inside the guide.</dd>
  <dt>guide.states</dt>
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
<h5>Guide Methods</h5>
<dl>
  <dt>guide.open()</dt>
  <dd>Open the hall and all the rooms inside.</dd>
  <dt>guide.close()</dt>
  <dd>Close the hall and all the rooms inside.</dd>
  <dt>guide.speak(msg, resource)</dt>
  <dd>Speak a message from the current holder of the state machine with an optional data resource.</dd>
  <dt>guide.listen(msg, callback)</dt>
  <dd>Liseten for a message on the current holder of the state machine and execute a callback.</dd>
  <dt>guide.once(msg, callback)</dt>
  <dd>Listen once for a message on the current holder of the state machine and execute a callabck.</dd>
  <dt>guide.ignore(msg, callback)</dt>
  <dd>Remove a listener from the holder of the current state machine, and it's callback.</dd>
  <dt>guide.setState(state)</dt>
  <dd>Set a ste for a room, and then speak the leaving, entering, entered events.</dd>
  <dt>guide.addState(state)</dt>
  <dd>Add a state to the guide.</dd>
</dl>
<h5>Examplee</h5>
<pre><code class="language-javascript">var guide = new amenti.Guide({
  halls: {hall}  // the hall from the Hall &amp; Room example;
})
// add a route to the guide.
guide.route("goto:somePlace");

// listen for the route change from the guide and run a callback.
guide.listen("goto:somePlace", _goToSomePlace);
function _goSomePlace() {
  console.log("GO TO SOME PLACE");
}
guide.open();
</code></pre>`;
