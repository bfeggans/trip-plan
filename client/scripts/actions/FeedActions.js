import AppDispatcher from '../dispatcher/AppDispatcher';
import _ from 'underscore';
import FeedConstants from '../constants/FeedConstants';

var FeedActions = {
	createMessage:function(message){
		console.log(message);
		AppDispatcher.dispatch({
			actionType: FeedConstants.CREATE_MESSAGE,
			message: message
		})
	},
	viewMessages:function(){
		AppDispatcher.dispatch({
			actionType: FeedConstants.VIEW_MESSAGES
		})
	},
	removeMessage:function(index){
		AppDispatcher.dispatch({
			actionType: FeedConstants.REMOVE_MESSAGE,
			index: index
		})
	}
}

export default FeedActions;