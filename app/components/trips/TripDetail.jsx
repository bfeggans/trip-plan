import React from 'react';
import Router from 'react-router';
import TripActions from '../../actions/TripActions';
import TripStore from '../../stores/TripStore';
import Feed from '../feed/Feed';
import InvitationActions from '../../actions/InvitationActions';
import InvitationStore from '../../stores/InvitationStore';
import _ from 'underscore';
import UserStore from '../../stores/UserStore';
import Authentication from '../mixins/AuthenticationMixin';

function getTripState(id) {
  return {
    tripDetails: TripStore.getTripDetails(id),
    invitations: InvitationStore.getTripInvitations(id)
  }
}

var Trip = React.createClass({

  mixins: [ Router.State, Authentication ],

  // TODO
  // router stuff, see: https://github.com/rackt/react-router/blob/master/examples/master-detail/app.js
  getInitialState: function() {
    var id = this.getParams().id;
    return getTripState(id);
  },
  componentDidMount: function() {

    TripStore.addChangeListener(this._onChange, this);
    InvitationStore.addChangeListener(this._onChange, this);

    // TODO only getRemoteData if it hasn't happened yet
    TripActions.requestTripData();

    // TODO wait for TripStore id
    InvitationActions.requestTripInvitations(this.getParams().id);
  },
  componentWillUnmount: function() {
    TripStore.removeChangeListener(this._onChange, this);
    InvitationStore.removeChangeListener(this._onChange, this);
  },
  respondToInvitation: function () {
    var myInvite = _.find(this.state.invitations, {email: UserStore.getCurrentUser().password.email});

    InvitationActions.respondToInvitation({
      id: myInvite.id,
      email: UserStore.getCurrentUser().password.email,
      tripId: this.state.tripDetails.id,
      status: 'confirmed'
    });
  },
  render: function() {

    var trip = this.state.tripDetails || {};
    var myInvite = _.find(this.state.invitations, {email: "me@iamjsmith.com"});

    if(myInvite && myInvite.status === "confirmed") {
      var rsvpCard = (
        <div className="confirm-form">
          <h1>You are coming!</h1>
        </div>
      )
    } else {
      var rsvpCard = (
        <div className="confirm-form">
          <h1>Are you coming?</h1>
          <div onClick={this.respondToInvitation} className="ui massive inverted teal button">Hell yeah!</div>
        </div>
      )
    }

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
            {rsvpCard}
          </div>
          {inviteesList}
        </div>

        <Feed tripId={ trip.id } />

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
