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
    invitations: InvitationStore.getTripInvitations(id),
    currentUser: UserStore.getCurrentUser().password.email
  }
}

var Trip = React.createClass({

  mixins: [ Router.State, Authentication ],

  getInitialState: function() {
    var id = this.getParams().id;

    TripActions.requestTripData(id);
    InvitationActions.requestTripInvitations(id);

    return getTripState(id);
  },
  componentDidMount: function() {
    TripStore.addChangeListener(this._onChange, this);
    InvitationStore.addChangeListener(this._onChange, this);
  },
  componentWillUnmount: function() {
    TripStore.removeChangeListener(this._onChange, this);
    InvitationStore.removeChangeListener(this._onChange, this);
  },
  respondToInvitation: function () {
    var myInvite = _.find(this.state.invitations, {email: this.state.currentUser});

    InvitationActions.respondToInvitation({
      id: myInvite.id,
      email: UserStore.getCurrentUser().password.email,
      tripId: this.state.tripDetails.id,
      status: 'confirmed'
    });
  },
  render: function() {

    var trip = this.state.tripDetails || {};
    var invitations = this.state.invitations || [];
    var myInvite = _.find(this.state.invitations, {email: this.state.currentUser});

    if(!myInvite) {
      var rsvpCard = (
        <div className="confirm-form">
          <h1>Bro, are you even invited?</h1>
        </div>
      )
    } else if(myInvite && myInvite.status === "confirmed") {
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

    if (invitations && invitations.length) {
      var inviteesList = (
        <div className="extra content">
          <a>
            <i className="user icon"></i>
            {invitations && invitations.length} Friends
          </a>
          <div className="ui list">
            {invitations.map(function(invitee) {
              return (
                <div className="item">
                  <img className="ui avatar image" src="http://semantic-ui.com/images/avatar/small/daniel.jpg" />
                  <div className="content">
                    <a className="header">{invitee.email}</a>
                    <div className="description">{invitee.status}</div>
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
        <div className="two-col-split">
          <div> {/* left col */}
            <header>
              <h1 className="header">{ trip.destination }</h1>
              {/* <div className="description">
                { trip.travelDates }
                { trip.description }
              </div> */}
            </header>
            {rsvpCard}
            {inviteesList}
          </div>
          <Feed tripId={ trip.id } /> {/* right col */}
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
