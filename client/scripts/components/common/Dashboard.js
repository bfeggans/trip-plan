import React from 'react';
import Authentication from '../mixins/AuthenticationMixin';
import TripMain from '../trips/TripMain';

var Dashboard = React.createClass({displayName: "Dashboard",
  mixins: [ Authentication ],

  render: function () {
    return (
      React.createElement(TripMain, null)
    );
  }
});

export default Dashboard;