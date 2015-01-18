import Auth from '../utils/auth';
import React from 'react';
import Router from 'react-router';

import {TripApi} from '../utils/TripApi';

// common react components
import About from './common/About';
import Dashboard from './common/Dashboard';
import Login from './common/Login';
import Logout from './common/Logout';

// trip react component
import Trip from './trips/TripDetail';
import TripCreator from './trips/TripCreator';


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
      React.createElement(Link, {to: "logout", className: "item"}, "Logout") :
      React.createElement(Link, {to: "login", className: "item"}, "Login");

    if(this.state.loggedIn) {
      var dashboardLink = React.createElement(Link, {to: "dashboard", className: "item"}, "Home");
      var newTripLink = React.createElement(Link, {to: "newtrip", className: "item"}, "Create Trip");
    }

    return (
      React.createElement("div", null, 
        React.createElement("div", {className: "ui secondary pointing menu"}, 
          dashboardLink, 
          newTripLink, 
          React.createElement("div", {className: "right menu"}, 
            React.createElement(Link, {to: "about", className: "item"}, "Help"), 
            loginOrOut
          )
        ), 
        React.createElement("div", {className: "ui page grid"}, 
          React.createElement("div", {className: "centered row"}, 
            React.createElement("div", {className: "twelve wide column"}, 
              React.createElement(RouteHandler, null)
            )
          )
        )
      )
    );
  }
});

/*
 * Define Routes
 */

// TODO we need to refer to a trip by id not destination
// ala trip/:id
var routes = (
  React.createElement(Route, {handler: App}, 
    React.createElement(Route, {name: "login", handler: Login, addHandlerKey: true}), 
    React.createElement(Route, {name: "logout", handler: Logout}), 
    React.createElement(Route, {name: "about", handler: About}), 
    React.createElement(Route, {name: "dashboard", handler: Dashboard}), 
    React.createElement(Route, {name: "newtrip", handler: TripCreator}), 
    React.createElement(Route, {name: "trip", path: "trip/:id", handler: Trip}), 
    React.createElement(DefaultRoute, {handler: Dashboard})
  )
);

/*
 * Start Application
 */

Router.run(routes, function (Handler) {
  React.render(React.createElement(Handler, null), document.getElementById('app'));
});

export default {}