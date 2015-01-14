import React from 'react';
import Authentication from 'lib/modules/common/Authentication';
import Auth from 'lib/auth';
import TripMain from 'lib/modules/trips/TripMain';

var Dashboard = React.createClass({displayName: "Dashboard",
  mixins: [ Authentication ],

  render: function () {
    var token = Auth.getToken();
    return (
      React.createElement("div", null, 
        React.createElement("h1", null, "Dashboard"), 
        React.createElement("p", null, "Your Twitter token - ", token), 
        React.createElement(TripMain, null), 
        React.createElement("h2", null, "See all public trips")
      )
    );
  }
});

export default Dashboard;