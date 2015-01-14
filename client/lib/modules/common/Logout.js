import React from 'react';
import Auth from 'lib/auth';

var Logout = React.createClass({displayName: "Logout",
  componentDidMount: function () {
    Auth.logout();
  },

  render: function () {
    return React.createElement("p", null, "You are now logged out");
  }
});

export default Logout;