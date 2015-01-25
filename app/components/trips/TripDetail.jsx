import React from 'react';
import Router from 'react-router';
import TripActions from '../../actions/TripActions';
import TripStore from '../../stores/TripStore';

import Feed from '../feed/Feed';

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

    var trip = this.state.tripDetails || {};

    if (trip.invitees && trip.invitees.length) {
      var inviteesList = (
        <div className="extra content">
          <a>
            <i className="user icon"></i>
            {trip.invitees && trip.invitees.length} Friends
          </a>
          <div className="ui list">
            {trip.invitees.map(function(invitee) {
              return (
                <div className="item">
                  <img className="ui avatar image" src="http://semantic-ui.com/images/avatar/small/daniel.jpg" />
                  <div className="content">
                    <a className="header">{invitee}</a>
                    <div className="description">"I'm ready to get that money on this trip"</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    return (
      <div>
        <div className="ui ignored positive icon message">
          This trip has momentum. Contribute. Keep it alive!
        </div>
        {/* this ui card could probably be a separate reusable element */}
        <div className="ui card">
          <div className="content">
            <a className="header">{ trip.destination }</a>
            <div className="meta">
              <span className="date">{ trip.travelDates }</span>
            </div>
            <div className="description">
              { trip.description }
            </div>
          </div>
          <div className="image">
            <img src="http://upload.wikimedia.org/wikipedia/commons/d/dc/PIA17944-MarsCuriosityRover-AfterCrossingDingoGapSanddune-20140209.jpg" />
            <div className="confirm-form">
              <h1>Are you coming?</h1>
              <div className="ui massive inverted teal button">Hell yeah!</div>
            </div>
          </div>
          {inviteesList}
        </div>

        <Feed />

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