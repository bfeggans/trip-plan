import React from 'react';

var Trip = React.createClass({displayName: "Trip",

  // TODO
  // router stuff, see: https://github.com/rackt/react-router/blob/master/examples/master-detail/app.js

  render: function() {
    return (
      React.createElement("h1", null, "Trip Details")
    )
  }

});

export default Trip;