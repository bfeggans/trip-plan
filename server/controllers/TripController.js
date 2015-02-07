var firebase = require('firebase');
var EmailController = require('./../controllers/EmailController');

var BASE_URL = "http://trip-plan.herokuapp.com/#/trip/";

var _createTrip = function (req, res) {

  var inviteesRef = new firebase("https://trip-plan.firebaseio.com/invitees");
  inviteesRef.set(req.body.invitees);

  req.body.invitees.map(function(toEmail) {
    var message = {
      "subject": req.body.name,
      "from_email": "trip@plan.com",
      "from_name": "Trip Plan Planner", // TODO get planners name
      "to": [{
        "email": toEmail,
        "name": "Recipient Name",
        "type": "to"
      }],
      "headers": {
        "Reply-To": "message.reply@example.com" // TODO get planners email
      },
      "merge": true,
      "global_merge_vars": [
        {
          "name": "DESCRIPTION",
          "content": req.body.description
        },
        {
          "name": "TRIP_URL",
          "content": BASE_URL + req.body.id
        }
      ]
    };
    EmailController.sendTemplateMessage('new-trip', message, function(result){
      res.json(result);
    });
  });

}

module.exports = {
  createTrip: _createTrip
}
