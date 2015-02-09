import AppDispatcher from '../dispatcher/AppDispatcher';
import FeedConstants from '../constants/FeedConstants';
import FeedApi from '../utils/FeedApi';
import _ from 'underscore';


class FeedActions {

	constructor(){
		this.api = new FeedApi();
	}

	createMessage(attrs){
		var that = this;

		if (attrs.messageText.indexOf('youtube.com/') > -1){
			$.ajax({
        url: 'http://query.yahooapis.com/v1/public/yql',
        data: {
            q: "select * from json where url ='http://www.youtube.com/oembed?url=" + attrs.messageText + "&format=json'",
            format: "json"
          },
        dataType: "jsonp",
        success:function(response){
	        attrs.messageText = response.query.results.json.html;

        	that.api.newMessage(attrs, function(response){
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
			})
		} else {
			if (attrs.messageText.startsWith('http://') || attrs.messageText.startsWith('https://')){
    		attrs.messageText = '<a href="'+attrs.messageText+'">'+attrs.messageText+'</a>';	
    	}	else if (attrs.messageText.startsWith('www.') || (attrs.messageText.indexOf('.com')) > -1){
    		attrs.messageText = '<a href="http://'+attrs.messageText+'">'+attrs.messageText+'</a>';	
    	}
			this.api.newMessage(attrs, function(response){
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