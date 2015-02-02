import $ from 'jquery';

export default class FeedApi {

  constructor(options) {
    let url = (options && options.url) ? options.url : "https://trip-plan.firebaseio.com/messages/";
    this.firebaseRef = new Firebase(url);
  }

  getMessages(cb) {
    $.get('http://trip-plan.firebaseio.com/messages.json', function(response) {
      cb(response);
    });
  }

  newMessage(attrs, cb) {
    var message = {
      author: attrs.author,
      messageText: attrs.messageText,
      id: attrs.id,
      tripId: attrs.tripId
    }
    // $.ajax({
    //   type: 'POST',
    //   data: JSON.stringify(message),
    //   contentType: 'application/json',
    //   url: '/api/message',
    //   success: function(result) {
    //     console.log('Hi from FeedApi')
    //   }
    // });
    this.firebaseRef.push(message);
    // this cb is used to call the dispatcher
    cb(message);
  }

}