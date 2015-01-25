import React from 'react';

var Feed = React.createClass({displayName: "Feed",
  render: function() {
    return (
      React.createElement("div", {className: "ui feed"}, 
        React.createElement("div", {className: "event"}, 
          React.createElement("div", {className: "label"}, 
            React.createElement("img", {src: "http://semantic-ui.com/images/avatar/small/joe.jpg"})
          ), 
          React.createElement("div", {className: "content"}, 
            React.createElement("div", {className: "summary"}, 
              React.createElement("a", null, "Joe Henderson"), " said", 
              React.createElement("div", {className: "date"}, 
                "3 days ago"
              )
            ), 
            React.createElement("div", {className: "extra text"}, 
              "Hopefully this is just as much fun as last time."
            ), 
            React.createElement("div", {className: "meta"}, 
              React.createElement("a", {className: "like"}, 
                React.createElement("i", {className: "like icon"}), " 5 Likes"
              )
            )
          )
        ), 
        React.createElement("div", {className: "event"}, 
          React.createElement("div", {className: "label"}, 
            React.createElement("img", {src: "http://semantic-ui.com/images/avatar/small/daniel.jpg"})
          ), 
          React.createElement("div", {className: "content"}, 
            React.createElement("div", {className: "summary"}, 
              React.createElement("a", null, "Jason Smith"), " said", 
              React.createElement("div", {className: "date"}, 
                "1 Hour Ago"
              )
            ), 
            React.createElement("div", {className: "extra text"}, 
              "Joe do you even remember last time?"
            ), 
            React.createElement("div", {className: "meta"}, 
              React.createElement("a", {className: "like"}, 
                React.createElement("i", {className: "like icon"}), " 5 Likes"
              )
            )
          )
        ), 
        React.createElement("div", {className: "content event"}, 
          React.createElement("div", {className: "label"}, 
            React.createElement("img", {src: "http://semantic-ui.com/images/avatar/small/daniel.jpg"})
          ), 
          React.createElement("div", {className: "content"}, 
            React.createElement("div", {className: "summary"}, 
              React.createElement("a", {className: "user"}, 
                "Jason Smith"
              ), " confirmed they are coming!", 
              React.createElement("div", {className: "date"}, 
                "1 Hour Ago"
              )
            ), 
            React.createElement("div", {className: "extra text"}, 
              "\"I'm ready to get that money on this trip\""
            )
          )
        )
      )
    )
  }
});

export default Feed;