var firebase = require('firebase');
var EmailController = require('./../controllers/EmailController');

var BASE_URL = "http://trip-plan.herokuapp.com/#/trip/";

var _createTrip = function (req, res) {

  /* invite model looks something like
   * {
   *  id: pk
   *  email: string,
   *  tripId: string,
   *  invitedBy: string,
   *  personalMessage: string,
   *  createDate: date,
   *  status: string,
   *  responseMessage: string,
   *  ? emailSeen
   *  ? emailDispatchDate
   * }
   */

  const STATUS_INVITED = "invited";

  var invitationsRef = new firebase("https://trip-plan.firebaseio.com/invitations");

  req.body.invitees.map(function(toEmail) {

    invitationsRef.push({
      email: toEmail,
      tripId: req.body.id,
      status: STATUS_INVITED
    });

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
