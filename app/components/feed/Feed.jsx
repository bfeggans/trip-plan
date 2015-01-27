import React from 'react';
import FeedActions from '../../actions/FeedActions';
import FeedStore from '../../stores/FeedStore';
import FeedCard from './FeedCard';

var getMessages = function(){
  return {
    messages: FeedStore.getFeeds()
  }
}

var Feed = React.createClass({
  getInitialState:function(){
    return getMessages();
  },
  createMessage:function(){
    FeedActions.createMessage({
      author: "blake",
      messageText: this.state.messageText,
      id: (Math.floor(Math.random() * 100))
    });

    this.setState({messageText: ""})
  },
  removeMessage:function(message){
    FeedActions.removeMessage(message.id);
    console.dir(message);

    this._onChange();
  },
  messageOnChange:function(e){
    this.setState({messageText: e.target.value});
  },
  _onChange:function(){
    this.setState(getMessages());
  },
  render: function() {
    return (
      <div>
        <FeedCard messages={ this.state.messages } removeMessage={ this.removeMessage }/>
        <div className="ui action left icon input">
          <input type="text" onChange={ this.messageOnChange } value={ this.state.messageText } placeholder="Comment here..." />
          <div className="ui teal button" onClick={ this.createMessage }>Add</div>
        </div>
      </div>
    )
  }
});

export default Feed;