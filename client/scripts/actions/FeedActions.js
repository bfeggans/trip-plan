import AppDispatcher from '../dispatcher/AppDispatcher';
import FeedConstants from '../constants/FeedConstants';
import FeedApi from '../utils/FeedApi';
import _ from 'underscore';


class FeedActions {

	constructor(){
		this.api = new FeedApi();
	}

	createMessage(attrs){
		console.log(attrs);
		this.api.newMessage(attrs, function(message){
			AppDispatcher.dispatch({
				actionType: FeedConstants.CREATE_MESSAGE,
				message: message
			});
		});
	}

	viewMessages(tripId){
		this.api.getMessages(function(response){
			var messageData = _.map(response, function(val, key){
				return val;
			});
			AppDispatcher.dispatch({
				actionType: FeedConstants.VIEW_MESSAGES,
				data: messageData,
				tripId: tripId
			});
		});
	}

	removeMessage(arr, attr, value){
		AppDispatcher.dispatch({
			actionType: FeedConstants.REMOVE_MESSAGE,
			arr: arr,
			attr: attr,
			value: value
		})
	}

}

export default new FeedActions();