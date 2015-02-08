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

var Trip = React.createClass({displayName: "Trip",

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

    if (trip.invitees && trip.invitees.length) {
      var inviteesList = (
        React.createElement("div", {className: "extra content"}, 
          React.createElement("a", null, 
            React.createElement("i", {className: "user icon"}), 
            trip.invitees && trip.invitees.length, " Friends"
          ), 
          React.createElement("div", {className: "ui list"}, 
            trip.invitees.map(function(invitee) {
              return (
                React.createElement("div", {className: "item"}, 
                  React.createElement("img", {className: "ui avatar image", src: "http://semantic-ui.com/images/avatar/small/daniel.jpg"}), 
                  React.createElement("div", {className: "content"}, 
                    React.createElement("a", {className: "header"}, invitee), 
                    React.createElement("div", {className: "description"}, "\"I'm ready to get that money on this trip\"")
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
