import AppDispatcher from '../dispatcher/AppDispatcher';
import _ from 'underscore';
import TripConstants from '../constants/TripConstants';
import TripStore from '../stores/TripStore';

import TripApi from '../../utils/TripApi';

class TripActions {

  constructor() {
    this.api = new TripApi();
  }

  requestTripData(id) {
    // if an ID is specified check to see if it is in the store before
    // fetching from the remote database
    if(id) {
      var trip = TripStore.getTripDetails(id);
      if(trip) {
        // record found - noop
      } else {
        this.api.getTrip(id, function(response) {
          AppDispatcher.dispatch({
            actionType: TripConstants.RECEIVE_DATA,
            data: response
          });
        });
      }
    } else {
      // if no id in params, then get all the trips
      // we don't check the store here in favor of getting fresh data
      this.api.getTrips(function(response) {
        AppDispatcher.dispatch({
          actionType: TripConstants.RECEIVE_DATA,
          data: response
        });
      });
    }
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
