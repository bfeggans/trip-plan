import React from 'react';
import UserActions from '../../actions/UserActions';
import Router from 'react-router';

var { Route, RouteHandler, Link, DefaultRoute } = Router;

var Logout = React.createClass({displayName: "Logout",

  mixins: [ Router.Navigation, Router.State ],

  componentDidMount: function () {
    UserActions.logoutUser();
  },

  willTransitionTo: function (transition) {
    Login.attemptedTransition = transition;
    transition.redirect('/login');
  },

  render: function () {
    return React.createElement("p", null, "You are now logged out");
  }
});

export default Logout;
