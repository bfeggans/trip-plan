import {Store} from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import FeedConstants from '../constants/FeedConstants';
import _ from 'underscore';
import $ from 'jquery';

var _messages = [];
var _tripMessages = [];

var _loadMessages = function(data){
	_messages = data;
}

class FeedStore extends Store {
	getFeeds(){
		return _messages;
	}

	getFeedsByTripId(id){
		return _.where(_messages, {tripId: id});
	}
};

var _feedStore = new FeedStore();

AppDispatcher.register(function(payload){

	switch(payload.actionType) {

		case FeedConstants.VIEW_MESSAGES:
			_loadMessages(payload.data);
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