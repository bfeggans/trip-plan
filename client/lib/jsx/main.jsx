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
    <Route name="trip" path="trip/:id" handler={Trip}/>
  </Route>
);

/*
 * Start Application
 */

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('app'));
});

export default {}