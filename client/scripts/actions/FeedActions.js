import AppDispatcher from '../dispatcher/AppDispatcher';
import FeedConstants from '../constants/FeedConstants';
import FeedApi from '../utils/FeedApi';
import EmbedApi from '../utils/EmbedApi';
import _ from 'underscore';


class FeedActions {

	constructor(){
		this.api = new FeedApi();
		this.embed = new EmbedApi();
	}

	messageDispatching(response){
		var messageData = _.map(response, function(val, key){
			if(val){
				val.id = key;
				return val;
			}
		});
		AppDispatcher.dispatch({
			actionType: FeedConstants.VIEW_MESSAGES,
			data: messageData
		});
	};

	createMessage(attrs){
		var that = this;
		var link = attrs.messageText.trim();

		if (link.indexOf('http') > -1){
			this.embed.getMedia(link, function(mediaTag){
 				attrs.messageText = mediaTag;    		
    		that.api.newMessage(attrs, function(response){
    			that.messageDispatching(response);
    		});
    	});
		} else {
			if (link.startsWith('www.') || (link.indexOf('.com')) > -1){
    		attrs.messageText = '<a href="http://'+attrs.messageText+'">'+attrs.messageText+'</a>';	
    	}
			this.api.newMessage(attrs, function(response){
    		that.messageDispatching(response);
			});
		}
	}

	viewMessages(tripId){
		var that = this;
		this.api.getMessages(function(response){
			that.messageDispatching(response);
		});
	}

	removeMessage(id){
		var that = this;
		this.api.removeMessage(id, function(response){
			that.messageDispatching(response);
		});
	}

	likeMachine(message, username){
		if ((message.likes.indexOf(username) > -1)){
			message.likes.splice(message.likes.indexOf(username), 1);
		} else {
			message.likes.push(username);
		}

		this.api.likesAdjuster(message, function(message){
			AppDispatcher.dispatch({
				actionType: FeedConstants.VIEW_MESSAGES,
				data: message
			});
		})
	}

}

export default new FeedActions();