import React from 'react';
import Authentication from '../mixins/AuthenticationMixin';
import TripMain from '../trips/TripMain';

var Dashboard = React.createClass({
  mixins: [ Authentication ],

  render: function () {
    return (
      <TripMain />
    );
  }
});

export default Dashboard;