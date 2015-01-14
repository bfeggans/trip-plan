import React from 'react';
import {TripApi} from 'lib/services/TripApi';
import TripList from 'lib/modules/trips/TripList';

var TripMain = React.createClass({displayName: "TripMain",
  getInitialState: function() {
    this.trips = [];
    return {trips: [],destination: "",travelDates: ""};
  },
  componentWillMount: function() {

    this.TripApi = new TripApi({
      // TODO look into better way to handle this event
      // we want to hide firebase implementation details
      // like `snapshot.val()` from this componenet
      onChildAdded: function(snapshot) {
        this.addTripToList(snapshot.val());
      }.bind(this)
    });

  },
  componentWillUnmount: function() {
    this.TripApi.firebaseRef.off();
  },
  destinationOnChange: function(e){
    this.setState({destination: e.target.value});
  },
  travelDatesOnChange: function(e){
    this.setState({travelDates: e.target.value});
  },
  addTripToList: function(trip) {
    this.trips.push(trip);
    this.setState({trips: this.trips});
  },
  createTrip: function(e) {
    e.preventDefault();

    this.validateForm().then(function(result) {

      this.TripApi.createTrip({
        destination: this.state.destination,
        travelDates: this.state.travelDates
      });
      this.resetForm();

    }.bind(this), function(err) {
      this.setState({formError: "Fill in something!"});
    }.bind(this));

  },
  validateForm: function() {

    // TODO implement this method on keydown of input fields

    return new Promise(function(resolve,reject) {

      if (this.state.destination &&
          this.state.destination.trim().length !== 0 &&
          this.state.travelDates &&
          this.state.travelDates.trim().length !== 0) {

        resolve();

      } else {
        reject();
      }

    }.bind(this));

  },
  resetForm: function(){
    this.setState({destination: "",travelDates: "",formError: ""});
  },
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("h2", null, "Create a trip"), 
        React.createElement("form", {onSubmit:  this.createTrip}, 
          React.createElement("input", {onChange:  this.destinationOnChange, value:  this.state.destination, placeholder: "Enter destination..."}), 
          React.createElement("input", {onChange:  this.travelDatesOnChange, value:  this.state.travelDates, placeholder: "Enter travel dates..."}), 
          React.createElement("button", {type: "submit"}, "Add"), 
          React.createElement("span", null, this.state.formError)
        ), 
        React.createElement("h2", null, "See your trips"), 
        React.createElement(TripList, {trips:  this.state.trips})
      )
    )
  }
});

export default TripMain;