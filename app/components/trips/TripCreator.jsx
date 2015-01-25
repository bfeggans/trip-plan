import React from 'react';
import Router from 'react-router';
import TripActions from '../../actions/TripActions';

var { Route, RouteHandler, Link, DefaultRoute } = Router;

var TripCreator = React.createClass({

  mixins: [ Router.Navigation, Router.State ],

  getInitialState: function() {
    return {
      destination: "",
      travelDates: "",
      name: "",
      description: ""
    };
  },
  destinationOnChange: function(e){
    this.setState({destination: e.target.value});
  },
  travelDatesOnChange: function(e){
    this.setState({travelDates: e.target.value});
  },
  descriptionOnChange: function(e){
    this.setState({description: e.target.value});
  },
  nameOnChange: function(e){
    this.setState({name: e.target.value});
  },
  inviteesOnChange: function(e){
    var invitees = e.target.value.split(',');
    this.setState({invitees: invitees});
  },
  createTrip: function(e) {
    e.preventDefault();

    this.validateForm().then(function(result) {

      TripActions.createTrip({
        name: this.state.name,
        description: this.state.description,
        destination: this.state.destination,
        travelDates: this.state.travelDates,
        invitees: this.state.invitees
      }, function (trip) {
        this.transitionTo('trip', { id: trip.id });
      }.bind(this));

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
          <textarea onChange={ this.descriptionOnChange } placeholder="Consider yourself a salesperson for this trip"></textarea>
        </div>
        <div className="field">
          <label>OK, give this trip a name</label>
          <input onChange={ this.nameOnChange } placeholder="Last chance to make this trip sound cool" type="text" />
        </div>
        <div className="field">
          <label>Where to</label>
          <input onChange={ this.destinationOnChange } value={ this.state.destination } placeholder="Enter destination"/>
        </div>
        <div className="field">
          <label>When</label>
          <input onChange={ this.travelDatesOnChange } value={ this.state.travelDates } placeholder="Enter a simple when"/>
        </div>
        <div className="field">
          <label>Who (comma separated email addresses)</label>
          <input onChange={ this.inviteesOnChange } value={ this.state.invitees } placeholder="Tell the developer to make this easier to enter"/>
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