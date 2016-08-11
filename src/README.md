## base.js
Utility for setting options/properties on a class.  Is only used internally and not exported

## guide.js
A class used to create a guide for an app.  The guid provides a container for halls/rooms and handles emitting events for an app.

### Properties
`halls` - container for halls referenced by id.
`rooms` - container for halls referenced by id.
`_emitter` - nodejs event emitter.

Halls & rooms are objects that contain id references to all the halls and rooms in an app.  When creating a guide this will hold all the data and the halls/rooms will hold named references to the id objects in the guide.

**_emitter** is used to speak and listend across the app.  With this Rooms can open, close, lock, and send messages for other rooms/halls to listen for.

### Methods
All methods return a resolved promise.

`speak(msg)`
Speak a message to the guide a guide the ability to talk to the rooms and halls that it contains.

ex:`guide.speak("sending:message", res);`

Any hall/room can speak that the guide is listening for and get information on other rooms. access outside api data, and create connected functionality between spaces.

Messages can also be separated into 2 groups with a "-".

ex: speak("sending-message");

this will send the value after the "-" into the event callback as the value property.

`listen(msg, callback)`
Listens for a a message from speak. The callback is the function to run when the event is fired.

    guide.listen("sending-message", _sendingMessage);
    function _sendingMessage(ev) {
      console.log(ev);
    }
    // the you can speak the message with a "-" to log the ev.

ex: `guid.listen("sending:message", () => {})`

`once(msg, callback)`
Trigger an event once on a specific message and run the callback.

`remove(msg, callback)`

`route(trigger)`

`add(type, res)`

`del(type, id)`



## hall.js
A hall is like a hallway in a house.  Think of it as being useful when you have lots of rooms that you'd like grouped together.  Then those rooms can have halls that link to other rooms and so on.

### Properties
`id` - opts.id or a random number

`rooms` - opts.rooms array or an empty array
The rooms in the hall.  An array of room ids.

`states` - Object of states for a room
- lock
- open
- idle
- close



### Methods
`open()` - Opens a hall and returns a promise.

`close()` - Closes a hall and returns a promise.



## room.js
A room is like a room in a house.  It holds all your stuff.  The template... the dome stuff...

### Properties
`id` - opts.id or random number

`selector` - opts.selector or body  
The dom selector that will contain the room

`place` - opts.place or replace  
The placement in the html container.

`halls` - opts.halls array or empty array
The halls for the room. An array of hall ids.

`onOpen` - opts.onOpen function to execute when the room opens.
`onBuild` - opts.onBuild function to execute when the room builds.

`isOpen` - maintains the state if the current room is open or not.

`states` - default room states
- lock
- open
- idle
- close
- build

### Methods
`on(eventType, selector, callback)`
- `eventType` : dom event type ie: click, keydown...
- `selector` : dom selector inside the room to trigger on
- `callback` : callback function to execute when the dom event fires

Turn dom events on for a specific selector inside the selector of that room.

`off(eventType, selector, callback)`  
Exactly like the on method only turns events off.

`open()` - The open procedure for a room. Sets isOpen to true.  Runs the build function then executes the onOpen function, and then sets any events.

`close` - destroys the events in the room and set's isOpen to false.
