import {Store} from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import FeedConstants from '../constants/FeedConstants';
import _ from 'underscore';
import $ from 'jquery';

// var _messages = [{messageText:"hello world", author:"blake", id:1},{messageText:"sup earth", author:"meghan", id:2}];
var _messages = [];

var _viewMessages = function(data){
	_messages = data;
}

var _createMessage = function(data){
	_messages.push(data);
}

var _removeMessage = function(arr, attr, value){
	console.log('NOT REMOVING FROM FIREBASE - TODO');
	
	var i = arr.length;

	while (i--){
		if (
			arr[i] 
			&& arr[i].hasOwnProperty(attr) 
			&& (arguments.length > 2 && arr[i][attr] == value)){
				arr.splice(i, 1);
		}
	}
}

class FeedStore extends Store {
	getFeeds(){
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
		case FeedConstants.VIEW_MESSAGES:
			_viewMessages(payload.data);
			break;
		case FeedConstants.REMOVE_MESSAGE:
			// console.log(payload);
			_removeMessage(payload.arr, payload.attr, payload.value);
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