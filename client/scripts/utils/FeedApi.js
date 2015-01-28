import $ from 'jquery';

export default class FeedApi {

  constructor(options) {
    let url = (options && options.url) ? options.url : "https://trip-plan.firebaseio.com/messages/";
    this.firebaseRef = new Firebase(url);
  }

  getMessages(cb) {
    $.get('http://trip-plan.firebaseio.com/messages.json', function(response) {
      console.log('hello from api');
      cb(response);
    });
  }

  newMessage(attrs, cb) {
    let id = this.firebaseRef.push().key();
    var message = {
      author: attrs.author,
      messageText: attrs.messageText,
      id: id
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