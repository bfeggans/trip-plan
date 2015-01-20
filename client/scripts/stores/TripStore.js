/*
 * Trip Store
 *
 * Implements:
 *  getAll
 *  create
 */

import {Store} from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import TripConstants from '../constants/TripConstants';
import _ from 'underscore';

var _trips = [];

function _loadTripData(data) {
  _trips = data;
}
function _addTrip(data) {
  _trips.push(data);
}

class TripStore extends Store {

  getTrips() {
    return _trips;
  }
  getTripDetails(id) {
    return _.findWhere(_trips, {id:id});
  }

}

var _tripStore = new TripStore();

// Register callback with AppDispatcher
AppDispatcher.register(function(payload) {

  switch(payload.actionType) {

    // Respond to RECEIVE_DATA action
    case TripConstants.RECEIVE_DATA:
      _loadTripData(payload.data);
      break;
    case TripConstants.CREATE_TRIP:
      _addTrip(payload.data);
      break;

    default:
      return true;

  }

  // If action was responded to, emit change event
  _tripStore.emitChange();

  return true;

});

export default _tripStore;