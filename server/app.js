var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mandrill = require('mandrill-api/mandrill');

app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));
app.use(express.static('./client'));

app.get('/', function(req, res) {
    res.render('./client/index.html');
});

app.post('/api/trip', function(req, res) {

  // console.log('params: ' + JSON.stringify(req.params));
  // console.log('body: ' + JSON.stringify(req.body));
  // console.log('query: ' + JSON.stringify(req.query));

  function sendTemplateMessage(template, message) {
    var mandrill_client = new mandrill.Mandrill('l6WnyZ3DxPxKd5pemFio7Q');
    var template_name = template;
    var async = false;

    mandrill_client.messages.sendTemplate({
      "template_name": template_name,
      "template_content": [],
      "message": message,
      "async": async
    }, function(result) {
      res.json(result);
    }, function(e) {
      res.json(e);
    });
  }

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
          "content": "localhost:5000/" + req.body.id
        }
      ]
    };
    sendTemplateMessage('new-trip', message);
  });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});