import $ from 'jquery';

export default class TripApi {

  constructor(options) {
    let url = (options && options.url) ? options.url : "https://trip-plan.firebaseio.com/trips/";
    this.firebaseRef = new Firebase(url);
  }

  getTrips(cb) {
    $.get('http://trip-plan.firebaseio.com/trips.json', function(response) {
      cb(response);
    });
  }

  createTrip(attrs, cb) {
    let id = this.firebaseRef.push().key();
    var trip = {
      name: attrs.name,
      description: attrs.description,
      destination: attrs.destination,
      travelDates: attrs.travelDates,
      invitees: ['me@iamjsmith.com'],
      id: id
    }
    $.ajax({
      type: 'POST',
      data: JSON.stringify(trip),
      contentType: 'application/json',
      url: '/api/trip',
      success: function(result) {
        console.log(result);
      }
    });
    this.firebaseRef.push(trip);
    cb(trip);
  }

}