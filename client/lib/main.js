import $ from 'jquery';
import Auth from 'lib/auth';
import React from 'react';
import Router from 'react-router';

import {TripApi} from 'lib/services/TripApi';

// common react components
import About from 'lib/modules/common/About';
import Dashboard from 'lib/modules/common/Dashboard';
import Login from 'lib/modules/common/Login';
import Logout from 'lib/modules/common/Logout';

// trip react component
import Trip from 'lib/modules/trips/TripDetail';


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
    React.createElement(Route, {name: "trip", path: "trip/:id", handler: Trip})
  )
);

/*
 * Start Application
 */

Router.run(routes, function (Handler) {
  React.render(React.createElement(Handler, null), document.getElementById('app'));
});

export default {}