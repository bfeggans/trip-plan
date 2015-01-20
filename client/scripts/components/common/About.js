import React from 'react';

var About = React.createClass({displayName: "About",
  render: function () {
    return (
      React.createElement("div", {className: "page"}, 
        React.createElement("h1", null, "Yo bro, you like to jetset? With three chainz on?"), 
        React.createElement("p", null, "Create a trip. Invite friends. Plan just enough to have fun.")
      )
    );
  }
});

export default About;