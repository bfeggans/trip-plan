import AppDispatcher from '../dispatcher/AppDispatcher';
import FeedConstants from '../constants/FeedConstants';
import FeedApi from '../utils/FeedApi';
import _ from 'underscore';


class FeedActions {

	constructor(){
		this.api = new FeedApi();
	}

	createMessage(attrs){
		this.api.newMessage(attrs, function(response){
			console.log(response);
			var messageData = _.map(response, function(val, key){
				val.id = key;
				return val;
			});
			AppDispatcher.dispatch({
				actionType: FeedConstants.VIEW_MESSAGES,
				data: messageData
			});
		});
	}

	viewMessages(tripId){
		this.api.getMessages(function(response){
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
		});
	}

	removeMessage(id){
		this.api.removeMessage(id, function(response){
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
		});
	}

	likeMachine(message, username){
		if ((message.likes.indexOf(username) > -1)){
			console.log('Already upvoted');
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