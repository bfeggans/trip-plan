import React from 'react';
import Router from 'react-router';
import Auth from '../../utils/auth';

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
      React.createElement("div", null, 
        React.createElement("h1", null, "Hi, we'd like to know who you are so we can get your real self on some real trips"), 
        React.createElement("form", {onSubmit: this.handleSubmit}, 
          React.createElement("button", {className: "ui inverted blue button", type: "submit"}, "Twitter Login"), 
          errors
        )
      )
    );
  }
});

export default Login;