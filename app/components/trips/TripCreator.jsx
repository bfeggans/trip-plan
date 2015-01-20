import React from 'react';
import Router from 'react-router';
import TripActions from '../../actions/TripActions';

var { Route, RouteHandler, Link, DefaultRoute } = Router;

var TripCreator = React.createClass({

  mixins: [ Router.Navigation, Router.State ],

  getInitialState: function() {
    return {
      destination: "",
      travelDates: ""
    };
  },
  destinationOnChange: function(e){
    this.setState({destination: e.target.value});
  },
  travelDatesOnChange: function(e){
    this.setState({travelDates: e.target.value});
  },
  createTrip: function(e) {
    e.preventDefault();

    this.validateForm().then(function(result) {

      TripActions.createTrip({
        destination: this.state.destination,
        travelDates: this.state.travelDates
      }, function (trip) {

        console.log(trip);

        this.transitionTo('trip', { id: trip.id });
      }.bind(this));

      // TODO need to jump to trip details after creation

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
  render: function(){
    return(
      <form className="ui form" onSubmit={ this.createTrip }>
        <div className="field">
          <label>Describe the trip</label>
          <textarea placeholder="Consider yourself a salesperson for this trip"></textarea>
        </div>
        <div className="field">
          <label>OK, give this trip a name</label>
          <input placeholder="Last chance to make this trip sound cool" type="text" />
        </div>
        <div className="field">
          <label>Where to</label>
          <input onChange={ this.destinationOnChange } value={ this.state.destination } placeholder="Enter destination"/>
        </div>
        <div className="field">
          <label>When</label>
          <input onChange={ this.travelDatesOnChange } value={ this.state.travelDates } placeholder="Enter travel dates"/>
        </div>
        <div className="ui error message">
          <div className="header">{this.state.formError}</div>
        </div>
        <button className="ui submit button" type="submit">Add</button>
      </form>
    );
  }
});

export default TripCreator;