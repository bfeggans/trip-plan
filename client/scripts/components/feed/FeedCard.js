import React from 'react';
import FeedActions from '../../actions/FeedActions';
import FeedStore from '../../stores/FeedStore';

var FeedCard = React.createClass({displayName: "FeedCard",
	createCard: function(message, index){
			return (
				React.createElement("div", {key: index, className: "event"}, 
	        React.createElement("div", {className: "label"}, 
	          React.createElement("img", {src: "http://semantic-ui.com/images/avatar/small/joe.jpg"})
	        ), 
	        React.createElement("div", {className: "content"}, 
	          React.createElement("div", {className: "summary"}, 
	            React.createElement("a", null,  message.author), " said", 
	            React.createElement("div", {className: "date"}, 
	              "3 days ago"
	            )
	          ), 
	          React.createElement("div", {className: "extra text"}, 
	             message.messageText
	          ), 
	          React.createElement("div", {className: "meta"}, 
	            React.createElement("a", {className: "like"}, 
	              React.createElement("i", {className: "like icon"}), " 5 Likes"
	            ), 
	            React.createElement("a", {onClick:  this.props.removeMessage.bind(this, message), className: "delete"}, 
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
				 this.props.messages.map(this.createCard) 
			)
			)
	}
})

export default FeedCard;