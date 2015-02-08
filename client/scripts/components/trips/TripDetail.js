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

var Trip = React.createClass({displayName: "Trip",

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
        React.createElement("div", {className: "confirm-form"}, 
          React.createElement("h1", null, "Bro, are you even invited?")
        )
      )
    } else if(myInvite && myInvite.status === "confirmed") {
      var rsvpCard = (
        React.createElement("div", {className: "confirm-form"}, 
          React.createElement("h1", null, "You are coming!")
        )
      )
    } else {
      var rsvpCard = (
        React.createElement("div", {className: "confirm-form"}, 
          React.createElement("h1", null, "Are you coming?"), 
          React.createElement("div", {onClick: this.respondToInvitation, className: "ui massive inverted teal button"}, "Hell yeah!")
        )
      )
    }

    if (invitations && invitations.length) {
      var inviteesList = (
        React.createElement("div", {className: "extra content"}, 
          React.createElement("a", null, 
            React.createElement("i", {className: "user icon"}), 
            invitations && invitations.length, " Friends"
          ), 
          React.createElement("div", {className: "ui list"}, 
            invitations.map(function(invitee) {
              return (
                React.createElement("div", {className: "item"}, 
                  React.createElement("img", {className: "ui avatar image", src: "http://semantic-ui.com/images/avatar/small/daniel.jpg"}), 
                  React.createElement("div", {className: "content"}, 
                    React.createElement("a", {className: "header"}, invitee.email), 
                    React.createElement("div", {className: "description"}, invitee.status)
                  )
                )
              )
            })
          )
        )
      )
    }

    return (
      React.createElement("div", null, 
        React.createElement("div", {className: "ui ignored positive icon message"}, 
          "This trip has momentum. Contribute. Keep it alive!"
        ), 
        /* this ui card could probably be a separate reusable element */
        React.createElement("div", {className: "ui card"}, 
          React.createElement("div", {className: "content"}, 
            React.createElement("a", {className: "header"},  trip.destination), 
            React.createElement("div", {className: "meta"}, 
              React.createElement("span", {className: "date"},  trip.travelDates)
            ), 
            React.createElement("div", {className: "description"}, 
               trip.description
            )
          ), 
          /* TODO turn this into a separate component */
          React.createElement("div", {className: "image"}, 
            React.createElement("img", {src: "http://upload.wikimedia.org/wikipedia/commons/d/dc/PIA17944-MarsCuriosityRover-AfterCrossingDingoGapSanddune-20140209.jpg"}), 
            rsvpCard
          ), 
          inviteesList
        ), 

        React.createElement(Feed, {tripId:  trip.id})

      )
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
