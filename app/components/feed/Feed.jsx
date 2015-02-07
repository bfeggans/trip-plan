import React from 'react';
import Router from 'react-router';
import FeedActions from '../../actions/FeedActions';
import FeedStore from '../../stores/FeedStore';
import Card from '../common/Card';

var getMessages = function(id){
  return {
    messages: FeedStore.getFeedsByTripId(id)
  }
}
var twitterObj = JSON.parse(localStorage['twitter'] || '{}');

var Feed = React.createClass({

  mixins: [ Router.Navigation, Router.State ],

  getInitialState:function(){
    return getMessages(this.props.tripId);
  },
  componentDidMount:function(){
    // Listen for changes on the Feed Store
    FeedStore.addChangeListener(this._onChange, this);
  },
  componentWillUnmount:function(){
    FeedStore.removeChangeListener(this._onChange, this);
  },
  componentWillReceiveProps:function(nextProps) {
    // Grab initial messages
    FeedActions.viewMessages(nextProps.tripId);
  },
  createMessage:function(){
    FeedActions.createMessage({
      author: twitterObj.displayName,
      messageText: this.state.messageText,
      // id: (Math.floor(Math.random() * 1000)),
      id: null,
      tripId: this.props.tripId,
      date: Date.now()
    });

    this.setState({messageText: ""})
  },
  handleRemoveMessage:function(childComponent){
    FeedActions.removeMessage(childComponent.props.message.id);
  },
  handleLikes:function(childComponent, username){
    FeedActions.likeMachine(childComponent.props.message, twitterObj.username);
  },
  messageOnChange:function(e){
    this.setState({messageText: e.target.value});
  },
  _onChange:function(){
    this.setState(getMessages(this.props.tripId));
  },
  render: function() {
    var messages = this.state.messages;
    return (
      <div>
        { messages.map(function(message) {
          return <Card message={ message } profPic={ twitterObj.cachedUserProfile.profile_image_url } handleLikes={ this.handleLikes } handleRemoveMessage={ this.handleRemoveMessage }/>
        }, this) }
        <div className="ui action left icon input">
          <input type="text" onChange={ this.messageOnChange } value={ this.state.messageText } placeholder="Comment here..." />
          <div className="ui teal button" onClick={ this.createMessage }>Add</div>
        </div>
      </div>
    )
  }
});

export default Feed;
