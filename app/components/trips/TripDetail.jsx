import React from 'react';
import Router from 'react-router';
import TripActions from '../../actions/TripActions';
import TripStore from '../../stores/TripStore';

function getTripState(id) {
  return {
    tripDetails: TripStore.getTripDetails(id)
  }
}

var Trip = React.createClass({

  mixins: [ Router.Navigation, Router.State ],

  // TODO
  // router stuff, see: https://github.com/rackt/react-router/blob/master/examples/master-detail/app.js
  getInitialState: function() {
    var id = this.getParams().id;
    return getTripState(id);
  },

  componentDidMount: function() {
    // Listen for the TripStore to change
    TripStore.addChangeListener(this._onChange, this);

    // TODO only getRemoteData if it hasn't happened yet
    TripActions.requestTripData();
  },

  componentWillUnmount: function() {
    TripStore.removeChangeListener(this._onChange, this);
  },

  render: function() {

    var trip = (this.state.tripDetails) ? this.state.tripDetails : {destination: "", travelDates: ""};

    return (
      <div className="ui card">
        <div className="image">
          <img src="http://upload.wikimedia.org/wikipedia/commons/d/dc/PIA17944-MarsCuriosityRover-AfterCrossingDingoGapSanddune-20140209.jpg" />
        </div>
        <div className="content">
          <a className="header">{ trip.destination }</a>
          <div className="meta">
            <span className="date">{ trip.travelDates }</span>
          </div>
          <div className="description">
            Best Trip EVER
          </div>
        </div>
        <div className="extra content">
          <a>
            <i className="user icon"></i>
            22 Friends
          </a>
        </div>
      </div>
    )
  },

  /**
  * Event handler for 'change' events coming from the TripStore
  */
  _onChange: function() {
    this.setState(getTripState(this.getParams().id));
  },

});

export default Trip;