import React from 'react';
import FeedActions from '../../actions/FeedActions';
import FeedStore from '../../stores/FeedStore';

var Card = React.createClass({
	callParentRemove:function(e){
    this.props.handleRemoveMessage(this);
  },
  callParentLikes:function(e){
  	this.props.handleLikes(this);
  },
  handleDatePosted:function(date){
  	var now = Date.now();
  	var dateDifference = (now - date);

  	if ((now-date)/1000 < 60){
  		return (Math.floor((dateDifference)/1000) + ' seconds ago');
  	} else if ((dateDifference)/1000/60 < 60){
  		return (Math.floor((dateDifference)/1000/60) + ' minutes ago')
  	} else if ((dateDifference)/1000/60/60 < 24){
  		return (Math.floor((dateDifference)/1000/60/60) + ' hours ago')
  	} else {
  		return (Math.floor((dateDifference)/1000/60/60/24) + ' days ago') 
  	}
  },
	createCard: function(message, index){
			return (
				<div key={ message.id } className="event">
	        <div className="label">
	          <img src={ this.props.profPic } />
	        </div>
	        <div className="content">
	          <div className="summary">
	            <a>{ message.author }</a> said
	            <div className="date">
	              { this.handleDatePosted(message.date) }
	            </div>
	          </div>
	          <div className="extra text">
	            <td dangerouslySetInnerHTML={{__html: message.messageText}} />
	          </div>
	          <div className="meta">
	            <a onClick={ this.callParentLikes } className="like">
	              <i className="chevron up icon"></i> { message.likes.length - 1 } Upvotes
	            </a>
	            <a onClick={ this.callParentRemove } className="delete">
	              <i className="delete icon"></i> Delete Comment
	            </a>
	          </div>
	        </div>
	      </div>
			)
		},
	render: function(){
		return (
			<div className="ui feed">
				{ this.createCard(this.props.message) }
			</div>
			)
	}
})

export default Card;