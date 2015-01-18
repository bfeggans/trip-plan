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
      <Link to="logout" className="item">Logout</Link> :
      <Link to="login" className="item">Login</Link>;

    if(this.state.loggedIn) {
      var dashboardLink = <Link to="dashboard" className="item">Home</Link>;
      var newTripLink = <Link to="newtrip" className="item">Create Trip</Link>;
    }

    return (
      <div>
        <div className="ui secondary pointing menu">
          {dashboardLink}
          {newTripLink}
          <div className="right menu">
            <Link to="about" className="item">Help</Link>
            {loginOrOut}
          </div>
        </div>
        <div className="ui page grid">
          <div className="centered row">
            <div className="twelve wide column">
              <RouteHandler/>
            </div>
          </div>
        </div>
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
    <Route name="login" handler={Login} addHandlerKey={true} />
    <Route name="logout" handler={Logout}/>
    <Route name="about" handler={About}/>
    <Route name="dashboard" handler={Dashboard}/>
    <Route name="newtrip" handler={TripCreator}/>
    <Route name="trip" path="trip/:id" handler={Trip}/>
    <DefaultRoute handler={Dashboard}/>
  </Route>
);

/*
 * Start Application
 */

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('app'));
});

export default {}