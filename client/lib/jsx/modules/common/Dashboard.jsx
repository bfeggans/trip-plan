import React from 'react';
import Authentication from 'lib/modules/common/Authentication';
import Auth from 'lib/auth';
import TripMain from 'lib/modules/trips/TripMain';

var Dashboard = React.createClass({
  mixins: [ Authentication ],

  render: function () {
    var token = Auth.getToken();
    return (
      <div>
        <h1>Dashboard</h1>
        <p>Your Twitter token - {token}</p>
        <TripMain />
        <h2>See all public trips</h2>
      </div>
    );
  }
});

export default Dashboard;