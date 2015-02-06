import React from 'react';
import FeedActions from '../../actions/FeedActions';
import FeedStore from '../../stores/FeedStore';

var Card = React.createClass({displayName: "Card",
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
				React.createElement("div", {key:  message.id, className: "event"}, 
	        React.createElement("div", {className: "label"}, 
	          React.createElement("img", {src:  this.props.profPic})
	        ), 
	        React.createElement("div", {className: "content"}, 
	          React.createElement("div", {className: "summary"}, 
	            React.createElement("a", null,  message.author), " said", 
	            React.createElement("div", {className: "date"}, 
	               this.handleDatePosted(message.date) 
	            )
	          ), 
	          React.createElement("div", {className: "extra text"}, 
	             message.messageText
	          ), 
	          React.createElement("div", {className: "meta"}, 
	            React.createElement("a", {onClick:  this.callParentLikes, className: "like"}, 
	              React.createElement("i", {className: "chevron up icon"}), " ",  message.likes.length - 1, " Upvotes"
	            ), 
	            React.createElement("a", {onClick:  this.callParentRemove, className: "delete"}, 
	              React.createElement("i", {className: "delete icon"}), " Delete Comment"
	            )
	          )
	        )
	      )
			)
		},
	render: function(){
		return (
			React.createElement("div", {className: "ui feed"}, 
				 this.createCard(this.props.message) 
			)
			)
	}
})

export default Card;