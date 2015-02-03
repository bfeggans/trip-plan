import React from 'react';
import Router from 'react-router';
import FeedActions from '../../actions/FeedActions';
import FeedStore from '../../stores/FeedStore';
import Card from '../common/Card';

var getMessages = function(){
  return {
    messages: FeedStore.getFeeds()
  }
}

var Feed = React.createClass({displayName: "Feed",

  mixins: [ Router.Navigation, Router.State ],

  getInitialState:function(){
    return getMessages();
  },
  componentDidMount:function(){
    // Listen for changes on the Feed Store
    FeedStore.addChangeListener(this._onChange, this);
  },
  componentWillUnmount:function(){
    FeedStore.removeChangeListener(this._onChange, this);
  },
  componentWillUpdate: function () {
    // Grab initial messages
    FeedActions.viewMessages(this.props.tripId);
  },
  createMessage:function(){
    FeedActions.createMessage({
      author: localStorage.twitter.displayName,
      messageText: this.state.messageText,
      id: (Math.floor(Math.random() * 1000)),
      tripId: this.props.tripId
    });

    this.setState({messageText: ""})
  },
  handleRemoveMessage:function(childComponent){
    FeedActions.removeMessage(this.state.messages, 'id', childComponent.props.message.id);
  },
  messageOnChange:function(e){
    this.setState({messageText: e.target.value});
  },
  _onChange:function(){
    this.setState(getMessages());
  },
  render: function() {
    var messages = this.state.messages;
    return (
      React.createElement("div", null, 
         messages.map(function(message) {
          return React.createElement(Card, {message: message, handleRemoveMessage:  this.handleRemoveMessage})
        }, this), 
        React.createElement("div", {className: "ui action left icon input"}, 
          React.createElement("input", {type: "text", onChange:  this.messageOnChange, value:  this.state.messageText, placeholder: "Comment here..."}), 
          React.createElement("div", {className: "ui teal button", onClick:  this.createMessage}, "Add")
        )
      )
    )
  }
});

export default Feed;