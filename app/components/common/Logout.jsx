import React from 'react';
import Auth from '../../utils/auth';

var Logout = React.createClass({
  componentDidMount: function () {
    Auth.logout();
  },

  render: function () {
    return <p>You are now logged out</p>;
  }
});

export default Logout;