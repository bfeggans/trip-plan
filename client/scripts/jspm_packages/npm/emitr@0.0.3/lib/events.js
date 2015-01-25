/* */ 
"use strict";
var Event = require("./Event");
var MetaEvent = Event.extend(function(event) {
  this.event = event;
});
var ListenerEvent = MetaEvent.extend(function(event, listener, context) {
  MetaEvent.call(this, event);
  this.listener = listener;
  this.context = context;
});
var AddListenerEvent = ListenerEvent.extend();
var RemoveListenerEvent = ListenerEvent.extend();
var DeadEvent = MetaEvent.extend(function(event, args) {
  MetaEvent.call(this, event);
  this.data = args;
});
module.exports = {
  MetaEvent: MetaEvent,
  ListenerEvent: ListenerEvent,
  AddListenerEvent: AddListenerEvent,
  RemoveListenerEvent: RemoveListenerEvent,
  DeadEvent: DeadEvent
};
