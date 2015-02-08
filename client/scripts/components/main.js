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

import UserStore from '../../stores/UserStore';
import UserActions from '../../actions/UserActions';

var { Route, RouteHandler, Link, DefaultRoute } = Router;

/*
 * Application Component
 */
var App = React.createClass({displayName: "App",
  getInitialState: function () {
    return {
      loggedIn: UserStore.getCurrentUser()
    };
  },

  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange, this);
  },

  _onChange: function () {
    var user = UserStore.getCurrentUser();
    if(user) {
      this.setState({loggedIn: user});
    }
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
var _startApplication = function() {
  UserStore.removeChangeListener(_startApplication);
  Router.run(routes, function (Handler) {
    React.render(React.createElement(Handler, null), document.getElementById('app'));
  });
}
UserStore.addChangeListener(_startApplication);
UserActions.checkLoggedIn();

export default {}
