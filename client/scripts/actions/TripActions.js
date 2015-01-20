import AppDispatcher from '../dispatcher/AppDispatcher';
import _ from 'underscore';
import TripConstants from '../constants/TripConstants';

import TripApi from '../../utils/TripApi';

class TripActions {

  constructor() {
    this.api = new TripApi();
  }

  requestTripData() {
    this.api.getTrips(function(response) {
      var tripData = _.map(response, function(val, key) {
        return val;
      });
      AppDispatcher.dispatch({
        actionType: TripConstants.RECEIVE_DATA,
        data: tripData
      });
    });
  }

  createTrip(attrs, cb) {
    this.api.createTrip(attrs, function(trip) {
      AppDispatcher.dispatch({
        actionType: TripConstants.CREATE_TRIP,
        data: trip
      });
      cb(trip);
    });
  }

}

export default new TripActions();

