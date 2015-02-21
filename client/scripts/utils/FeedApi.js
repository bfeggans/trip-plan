import $ from 'jquery';

export default class FeedApi {

  constructor(options) {
    let url = (options && options.url) ? options.url : "https://trip-plan.firebaseio.com/messages/";
    this.firebaseRef = new Firebase(url);
  }

  getMessages(cb) {
    $.get('https://trip-plan.firebaseio.com/messages.json', function(response) {
      cb(response);
    });
  }

  newMessage(attrs, cb) {
    var message = {
      author: attrs.author,
      messageText: attrs.messageText,
      tripId: attrs.tripId,
      date: attrs.date,
      id: attrs.id,
      //Firebase requires a falsy value to create the array
      likes: ['']
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
    this.firebaseRef.push(message, function(){
      $.get('https://trip-plan.firebaseio.com/messages.json', function(response) {
        cb(response);
      })
    });
    // this cb is used to call the dispatcher
    // cb(message);
  }

  removeMessage(id, cb){
    var url = 'https://trip-plan.firebaseio.com/messages/' + id + '.json';

    $.ajax({
      url: url,
      type: 'DELETE',
      success: function(){
        //get the updated list of messages
        $.get('https://trip-plan.firebaseio.com/messages.json', function(response) {
          cb(response);
        })
      }
    })
  }

  likesAdjuster(message, cb){
    var url = 'https://trip-plan.firebaseio.com/messages/' + message.id + '.json';

    $.ajax({
      url: url,
      type: 'PUT',
      data: JSON.stringify(message),
      success: function(){
        $.get('https://trip-plan.firebaseio.com/messages.json', function(message) {
          cb(message);
        })
      }
    })
  }

}












