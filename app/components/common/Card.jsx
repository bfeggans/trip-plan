import React from 'react';
import FeedActions from '../../actions/FeedActions';
import FeedStore from '../../stores/FeedStore';

var Card = React.createClass({
	callParentRemove:function(e){
    this.props.handleRemoveMessage(this);
  },
	createCard: function(message, index){
			return (
				<div key={ message.id } className="event">
	        <div className="label">
	          <img src="http://semantic-ui.com/images/avatar/small/joe.jpg" />
	        </div>
	        <div className="content">
	          <div className="summary">
	            <a>{ message.author }</a> said
	            <div className="date">
	              3 days ago
	            </div>
	          </div>
	          <div className="extra text">
	            { message.messageText }
	          </div>
	          <div className="meta">
	            <a className="like">
	              <i className="like icon"></i> 5 Likes
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