var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var firebase = require('firebase');

var TripController = require('./controllers/TripController');

app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));
app.use(express.static('./client'));

/*
 * static index page
 */
app.get('/', function(req, res) {
    res.render('./client/index.html');
});

/*
 * api
 */
app.post('/api/trip', TripController.createTrip);


/*
 * kick the tires, light the fires
 */
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
