import React from 'react';
import Router from 'react-router';
import UserStore from '../../stores/UserStore';
import UserActions from '../../actions/UserActions';

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

  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange, this);
  },

  handleSubmit: function (event) {
    event.preventDefault();
    var that = this;
    UserActions.loginUser(this.state.email, this.state.password, function(error) {
      that.setState({error:error});
    });
  },

  onChangeEmail(e) { this.setState({email: e.target.value}) },
  onChangePassword(e) { this.setState({password: e.target.value}) },

  _onChange: function() {

    if(UserStore.getCurrentUser()) {
      if (Login.attemptedTransition) {
        var transition = Login.attemptedTransition;
        Login.attemptedTransition = null;
        transition.retry();
      } else {
        this.replaceWith('/dashboard');
      }
    } else {
      this.setState({ error: true });
    }

  },

  render: function () {
    var errors = this.state.error ? React.createElement("p", null,  this.state.error) : '';
    return (
      React.createElement("div", null, 
        React.createElement("h1", null, "Hi, we'd like to know who you are so we can get your real self on some real trips"), 
        React.createElement("form", {onSubmit: this.handleSubmit}, 
          React.createElement("div", {className: "ui input"}, 
            React.createElement("input", {onChange: this.onChangeEmail, type: "text", placeholder: "email"})
          ), 
          React.createElement("div", {className: "ui input"}, 
            React.createElement("input", {onChange: this.onChangePassword, type: "password", placeholder: "password"})
          ), 
          React.createElement("br", null), 
          React.createElement("br", null), 
          React.createElement("button", {className: "ui inverted blue button", type: "submit"}, "Login"), 
          errors
        )
      )
    );
  }
});

export default Login;
