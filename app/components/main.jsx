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
var App = React.createClass({
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
var _startApplication = function() {
  UserStore.removeChangeListener(_startApplication);
  Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById('app'));
  });
}
UserStore.addChangeListener(_startApplication);
UserActions.checkLoggedIn();

export default {}
