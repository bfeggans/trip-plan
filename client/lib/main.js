import $ from 'jquery';
import Auth from 'lib/auth';
import React from 'react';
import Router from 'react-router';

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
    // TODO implement
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
            React.createElement("td", null, React.createElement("a", {href: "#"},  trip.destination)), 
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

var List = React.createClass({displayName: "List",
  getInitialState: function() {
    this.trips = [];
    return {trips: [],destination: "",travelDates: ""};
  },
  componentWillMount: function() {
    this.firebaseRef = new Firebase("https://trip-plan.firebaseio.com/trips/");
    this.firebaseRef.on("child_added", function(snapshot) {
      this.trips.push(snapshot.val());
      this.setState({trips: this.trips});
    }.bind(this));
  },
  componentWillUnmount: function() {
    this.firebaseRef.off();
  },
  destinationOnChange: function(e){
    this.setState({destination: e.target.value});
  },
  travelDatesOnChange: function(e){
    this.setState({travelDates: e.target.value});
  },
  tripCreate: function(e) {
    e.preventDefault();
    if (this.state.destination && this.state.destination.trim().length !== 0 &&
        this.state.travelDates && this.state.travelDates.trim().length !== 0) {
      this.firebaseRef.push({
        destination: this.state.destination,
        travelDates: this.state.travelDates
      });
      console.log(this);
      this.setState({destination: "",travelDates: ""});
      console.log('but here?');
    }
  },
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("h1", null, "Ball Hard"), 
        React.createElement("h2", null, "Create a trip"), 
        React.createElement("form", {onSubmit:  this.tripCreate}, 
          React.createElement("input", {onChange:  this.destinationOnChange, value:  this.state.destination, placeholder: "Enter destination..."}), 
          React.createElement("input", {onChange:  this.travelDatesOnChange, value:  this.state.travelDates, placeholder: "Enter travel dates..."}), 
          React.createElement("button", {type: "submit"}, "Add")
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

var routes = (
  React.createElement(Route, {handler: App}, 
  	React.createElement(DefaultRoute, {handler: Dashboard}), 
    React.createElement(Route, {name: "login", handler: Login, addHandlerKey: true}), 
    React.createElement(Route, {name: "logout", handler: Logout}), 
    React.createElement(Route, {name: "about", handler: About}), 
    React.createElement(Route, {name: "dashboard", handler: Dashboard})
  )
);

/*
 * Start Application
 */

Router.run(routes, function (Handler) {
  React.render(React.createElement(Handler, null), document.getElementById('app'));
});

export default {}