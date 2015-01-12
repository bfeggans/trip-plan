import $ from 'jquery';
import Auth from 'lib/auth';
import React from 'react';
import Router from 'react-router';

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
  	// TODO implement
    var token = Auth.getToken();
    return (
      <div>
        <h1>Dashboard</h1>
        <p>Your Twitter token - {token}</p>
        <h2>Create a trip</h2>
        <h2>See your trips</h2>
        <h2>See all public trips</h2>
      </div>
    );
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

var routes = (
  <Route handler={App}>
  	<DefaultRoute handler={Dashboard}/>
    <Route name="login" handler={Login} addHandlerKey={true} />
    <Route name="logout" handler={Logout}/>
    <Route name="about" handler={About}/>
    <Route name="dashboard" handler={Dashboard}/>
  </Route>
);

/*
 * Start Application
 */

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('app'));
});

export default {}