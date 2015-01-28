import React from 'react';
import FeedActions from '../../actions/FeedActions';
import FeedStore from '../../stores/FeedStore';
import Card from '../common/Card';

var getMessages = function(){
  return {
    messages: FeedStore.getFeeds()
  }
}

var Feed = React.createClass({
  getInitialState:function(){
    return getMessages();
  },
  componentDidMount:function(){
    // Listen for changes on the Feed Store
    FeedStore.addChangeListener(this._onChange, this);

    // Grab initial messages 
    FeedActions.viewMessages();
  },
  componentWillUnmount:function(){
    FeedStore.removeChangeListener(this._onChange, this);
  },
  createMessage:function(){
    FeedActions.createMessage({
      author: localStorage.name,
      messageText: this.state.messageText,
      id: (Math.floor(Math.random() * 1000))
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

    var messages = this.state.messages || [];

    return (
      <div>
        { messages.map(function(message) {
          return <Card message={ message } handleRemoveMessage={ this.handleRemoveMessage }/>
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