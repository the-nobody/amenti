# amenti
a lightweight Javascript framework for structuring and providing state to otherwise stateless things.

The framework is based on the principle of Guide, Hall, Room.  With this structure you can build pretty much infinite apps.

### Room
A room is where all the html/dom/rendering magic happens.  Load a template from your favorite templating engine, or work directly with javascript template strings and build some really cool functions to wrap in.  The freedom is yours.

### Hall
A hall is a container of rooms with states.  After a while many rooms get hard to manage, and placing them in a container will make it seamless to interact with more spaces.

### Guide
A guide is a container of halls with states.  This guide can open all it's halls and send messages back and forth. It can also set the state of any hall, or room that exists withing it.

[_* see the docs for examples and reference to all the things._](docs/index.html)
