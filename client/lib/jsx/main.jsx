import $ from 'jquery';
import Auth from 'lib/auth';
import React from 'react';
import Router from 'react-router';

import {TripApi} from 'lib/services/TripApi';

var { Route, RouteHandler, Link, DefaultRoute } = Router;

/*
 * Application Component
 */

var App = React.createClass({
  getInitialState: function () {
    return {
      loggedIn: Auth.loggedIn()
    };
  },

  setStateOnAuth: function (loggedIn) {
    this.setState({
      loggedIn: loggedIn
    });
  },

  componentWillMount: function () {
    Auth.onChange = this.setStateOnAuth;
    //Auth.twitterLogin();
  },

  render: function () {
    var loginOrOut = this.state.loggedIn ?
      <Link to="logout">Log out</Link> :
      <Link to="login">Sign in</Link>;

    if(this.state.loggedIn) {
    	var dashboardLink = <li><Link to="dashboard">Dashboard</Link></li>;
    }

    return (
      <div>
        <ul>
          <li>{loginOrOut}</li>
          <li><Link to="about">About</Link></li>
       		{dashboardLink}
        </ul>
        <RouteHandler/>
      </div>
    );
  }
});

/*
 * Auth Mixin
 */

var Authentication = {
  statics: {
    willTransitionTo: function (transition) {
      if (!Auth.loggedIn()) {
        Login.attemptedTransition = transition;
        transition.redirect('/login');
      }
    }
  }
};

/*
 * Dashboard Component
 */
var Dashboard = React.createClass({
  mixins: [ Authentication ],

  render: function () {
    var token = Auth.getToken();
    return (
      <div>
        <h1>Dashboard</h1>
        <p>Your Twitter token - {token}</p>
        <List />
        <h2>See all public trips</h2>
      </div>
    );
  }
});

var TripList = React.createClass({
  render: function(){
    var createItem = function(trip, index) {
        return (
          <tr key={ index }>
            <td><Link to="trip" params={trip}>{ trip.destination }</Link></td>
            <td>{ trip.travelDates }</td>
          </tr>
        )
      };
    return (
      <table>
        <thead>
          <th>Destination</th>
          <th>Travel Dates</th>
        </thead>
        <tbody>{ this.props.trips.map(createItem) }</tbody>
      </table>
    )
  }
});

var Trip = React.createClass({

	// TODO
	// router stuff, see: https://github.com/rackt/react-router/blob/master/examples/master-detail/app.js

  render: function() {
    return (
      <h1>Trip Details</h1>
    )
  }

});

var List = React.createClass({
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
      <div>
        <h1>Ball Hard</h1>
        <h2>Create a trip</h2>
        <form onSubmit={ this.createTrip }>
          <input onChange={ this.destinationOnChange } value={ this.state.destination } placeholder="Enter destination..."/>
          <input onChange={ this.travelDatesOnChange } value={ this.state.travelDates } placeholder="Enter travel dates..."/>
          <button type="submit">Add</button>
          <span>{this.state.formError}</span>
        </form>
        <h2>See your trips</h2>
        <TripList trips={ this.state.trips } />
      </div>
    )
  }
});

/*
 * Login Component
 */

var Login = React.createClass({
  mixins: [ Router.Navigation ],

  statics: {
    attemptedTransition: null
  },

  getInitialState: function () {
    return {
      error: false
    };
  },

  handleSubmit: function (event) {
    event.preventDefault();

    Auth.twitterLogin(function (loggedIn) {
      if (!loggedIn)
        return this.setState({ error: true });

      if (Login.attemptedTransition) {
        var transition = Login.attemptedTransition;
        Login.attemptedTransition = null;
        transition.retry();
      } else {
        this.replaceWith('/dashboard');
      }
    }.bind(this));
  },

  render: function () {
    var errors = this.state.error ? <p>Bad login information</p> : '';
    return (
      <form onSubmit={this.handleSubmit}>
        <button type="submit">Twitter Login</button>
        {errors}
      </form>
    );
  }
});

/*
 * About Component
 */

var About = React.createClass({
  render: function () {
    return (
      <div className="page">
        <h1>Yo bro, you like to jetset? With three chainz on?</h1>
        <p>Create a trip. Invite friends. Plan just enough to have fun.</p>
      </div>
    );
  }
});

/*
 * Logout Component
 */

var Logout = React.createClass({
  componentDidMount: function () {
    Auth.logout();
  },

  render: function () {
    return <p>You are now logged out</p>;
  }
});

/*
 * Define Routes
 */

// TODO we need to refer to a trip by id not destination
// ala trip/:id
var routes = (
  <Route handler={App}>
  	<DefaultRoute handler={Dashboard}/>
    <Route name="login" handler={Login} addHandlerKey={true} />
    <Route name="logout" handler={Logout}/>
    <Route name="about" handler={About}/>
    <Route name="dashboard" handler={Dashboard}/>
    <Route name="trip" path="trip/:destination" handler={Trip}/>
  </Route>
);

/*
 * Start Application
 */

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('app'));
});

export default {}