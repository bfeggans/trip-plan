import {Store} from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import FeedConstants from '../constants/FeedConstants';
import _ from 'underscore';

var _messages = [{messageText:"hello world", author:"blake", id:1},{messageText:"sup earth", author:"meghan", id:2}];

var _createMessage = function(data){
	_messages.push(data);
}

var _removeMessage = function(index){
	_messages.splice(index, 1);
}

var _viewMessages = function(data){
	_messages = data;
}

class FeedStore extends Store {
	getFeeds(){
		console.log('messages coming in here');
		return _messages;
	}
};

var _feedStore = new FeedStore();

AppDispatcher.register(function(payload){

	switch(payload.actionType) {

		case FeedConstants.CREATE_MESSAGE:
			//something here
			_createMessage(payload.message);
			break;
		case FeedConstants.RECEIVE_DATA:
			//something here
			break;
		case FeedConstants.REMOVE_MESSAGE:
			// console.log(payload);
			_removeMessage(payload.id);
			break;
		default:
			//do nothing
			return true;

		}

	//if change, emit change
	_feedStore.emitChange();

	return true;
});

export default _feedStore;