import React from 'react';
import TripStore from '../../stores/TripStore';
import TripActions from '../../actions/TripActions';
import TripList from './TripList';
import UserStore from '../../stores/UserStore';

import Router from 'react-router';
var { Route, RouteHandler, Link, DefaultRoute } = Router;

function getTripState() {
  return {
    trips: TripStore.getTrips(),
    user: UserStore.getCurrentUser().password
  }
}

var TripMain = React.createClass({
  getInitialState: function() {
    return getTripState();
  },
  componentDidMount: function() {
    // Listen for the TripStore to change
    TripStore.addChangeListener(this._onChange, this);

    // TODO only getRemoteData if it hasn't happened yet
    TripActions.requestTripData(null, this.state.user.email);
  },
  componentWillUnmount: function() {
    TripStore.removeChangeListener(this._onChange, this);
  },

  // Event handler for 'change' events coming from the TripStore

  _onChange: function() {
    this.setState(getTripState());
  },

  render: function() {
    return (
      <div>
        <div className="ui horizontal divider">
          Get Excited
        </div>
        <TripList trips={ this.state.trips } />

        <Link to="newtrip" className="ui inverted full-width pink button vertically-spaced centered">Plan a trip</Link>

      </div>
    )
  }
});

export default TripMain;
