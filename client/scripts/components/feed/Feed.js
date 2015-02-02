import React from 'react';
import FeedActions from '../../actions/FeedActions';
import FeedStore from '../../stores/FeedStore';
import Card from '../common/Card';

var getMessages = function(){
  return {
    messages: FeedStore.getFeeds()
  }
}

var Feed = React.createClass({displayName: "Feed",
  getInitialState:function(){
    return getMessages();
  },
  componentDidMount:function(){
    // Listen for changes on the Feed Store
    FeedStore.addChangeListener(this._onChange, this);

    // Grab initial messages 
    FeedActions.viewMessages(this.props.tripId);
  },
  componentWillUnmount:function(){
    FeedStore.removeChangeListener(this._onChange, this);
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
    this.setState(FeedStore.getFeeds());
  },
  render: function() {

    var messages = this.state.messages;
    console.log(messages);

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