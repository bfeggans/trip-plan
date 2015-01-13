export class TripApi {
  constructor(options) {

    let url = (options && options.url) ? options.url : "https://trip-plan.firebaseio.com/trips/";

    this.firebaseRef = new Firebase(url);

    this.firebaseRef.on("child_added", options.onChildAdded);

  }
  createTrip(attrs) {
    this.firebaseRef.push({
      destination: attrs.destination,
      travelDates: attrs.travelDates
    });
  }
}