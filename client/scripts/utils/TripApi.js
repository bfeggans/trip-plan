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
      destination: attrs.destination,
      travelDates: attrs.travelDates,
      id: id
    }

    this.firebaseRef.push(trip);
    cb(trip);
  }

}