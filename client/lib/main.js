import $ from 'jquery';
import Auth from 'lib/auth';
import React from 'react';
import Router from 'react-router';

import {TripApi} from 'lib/services/TripApi';

var { Route, RouteHandler, Link, DefaultRoute } = Router;

/*
 * Application Component
 */

var App = React.createClass({displayName: "App",
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
      React.createElement(Link, {to: "logout"}, "Log out") :
      React.createElement(Link, {to: "login"}, "Sign in");

    if(this.state.loggedIn) {
      var dashboardLink = React.createElement("li", null, React.createElement(Link, {to: "dashboard"}, "Dashboard"));
    }

    return (
      React.createElement("div", null, 
        React.createElement("ul", null, 
          React.createElement("li", null, loginOrOut), 
          React.createElement("li", null, React.createElement(Link, {to: "about"}, "About")), 
          dashboardLink
        ), 
        React.createElement(RouteHandler, null)
      )
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
var Dashboard = React.createClass({displayName: "Dashboard",
  mixins: [ Authentication ],

  render: function () {
    var token = Auth.getToken();
    return (
      React.createElement("div", null, 
        React.createElement("h1", null, "Dashboard"), 
        React.createElement("p", null, "Your Twitter token - ", token), 
        React.createElement(List, null), 
        React.createElement("h2", null, "See all public trips")
      )
    );
  }
});

var TripList = React.createClass({displayName: "TripList",
  render: function(){
    var createItem = function(trip, index) {
        return (
          React.createElement("tr", {key: index }, 
            React.createElement("td", null, React.createElement(Link, {to: "trip", params: trip},  trip.destination)), 
            React.createElement("td", null,  trip.travelDates)
          )
        )
      };
    return (
      React.createElement("table", null, 
        React.createElement("thead", null, 
          React.createElement("th", null, "Destination"), 
          React.createElement("th", null, "Travel Dates")
        ), 
        React.createElement("tbody", null,  this.props.trips.map(createItem) )
      )
    )
  }
});

var Trip = React.createClass({displayName: "Trip",

  // TODO
  // router stuff, see: https://github.com/rackt/react-router/blob/master/examples/master-detail/app.js

  render: function() {
    return (
      React.createElement("h1", null, "Trip Details")
    )
  }

});

var List = React.createClass({displayName: "List",
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
        React.createElement("h1", null, "Ball Hard"), 
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

/*
 * Login Component
 */

var Login = React.createClass({displayName: "Login",
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
    var errors = this.state.error ? React.createElement("p", null, "Bad login information") : '';
    return (
      React.createElement("form", {onSubmit: this.handleSubmit}, 
        React.createElement("button", {type: "submit"}, "Twitter Login"), 
        errors
      )
    );
  }
});

/*
 * About Component
 */

var About = React.createClass({displayName: "About",
  render: function () {
    return (
      React.createElement("div", {className: "page"}, 
        React.createElement("h1", null, "Yo bro, you like to jetset? With three chainz on?"), 
        React.createElement("p", null, "Create a trip. Invite friends. Plan just enough to have fun.")
      )
    );
  }
});

/*
 * Logout Component
 */

var Logout = React.createClass({displayName: "Logout",
  componentDidMount: function () {
    Auth.logout();
  },

  render: function () {
    return React.createElement("p", null, "You are now logged out");
  }
});

/*
 * Define Routes
 */

// TODO we need to refer to a trip by id not destination
// ala trip/:id
var routes = (
  React.createElement(Route, {handler: App}, 
    React.createElement(DefaultRoute, {handler: Dashboard}), 
    React.createElement(Route, {name: "login", handler: Login, addHandlerKey: true}), 
    React.createElement(Route, {name: "logout", handler: Logout}), 
    React.createElement(Route, {name: "about", handler: About}), 
    React.createElement(Route, {name: "dashboard", handler: Dashboard}), 
    React.createElement(Route, {name: "trip", path: "trip/:destination", handler: Trip})
  )
);

/*
 * Start Application
 */

Router.run(routes, function (Handler) {
  React.render(React.createElement(Handler, null), document.getElementById('app'));
});

export default {}