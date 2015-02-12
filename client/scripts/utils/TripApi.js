import $ from 'jquery';
import _ from 'underscore';

export default class TripApi {

  constructor(options) {
    let url = (options && options.url) ? options.url : "https://trip-plan.firebaseio.com/trips/";
    this.firebaseRef = new Firebase(url);
  }

  getTrips(user, cb) {
    $.get('http://trip-plan.firebaseio.com/trips.json', function(response) {
      // format firebase data with nested id
      var tripData = _.filter(response, function(val, key) {
        var record = val;
        record.id = key;
        if (record.invitees.indexOf(user) > -1){
          return record;
        }
      });
      cb(tripData);
    });
  }

  getTrip(id, cb) {
    $.get('http://trip-plan.firebaseio.com/trips/' + id +'.json', function(response) {
      // format firebase data with nested id
      var tripData = response;
      tripData.id = id;
      cb([tripData]); // return an array intentionally
    });
  }

  createTrip(attrs, cb) {
    var trip = {
      name: attrs.name,
      description: attrs.description,
      destination: attrs.destination,
      travelDates: attrs.travelDates,
      invitees: attrs.invitees,
    }

    var id = this.firebaseRef.push(trip);
    trip.id = id.key();

    // separate call to fire off emails
    $.ajax({
      type: 'POST',
      data: JSON.stringify(trip),
      contentType: 'application/json',
      url: '/api/trip',
      success: function(result) {
        console.log(result);
      }
    });

    cb(trip);
  }

}
