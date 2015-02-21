import React from 'react';
import Router from 'react-router';

var { Route, RouteHandler, Link, DefaultRoute } = Router;

var TripList = React.createClass({displayName: "TripList",
  render: function(){
    var that = this;
    var createItem = function(trip, index) {
        return (
          React.createElement("div", {key: index, className: "item"}, 
            React.createElement("div", {className: "content"}, 
              React.createElement(Link, {to: "trip", params: trip},  trip.destination, " - ",  trip.travelDates)
            )
          )
        )
      };
    return (
      React.createElement("div", {className: "ui animate massive list"}, 
         this.props.trips.map(createItem) 
      )
    )
  }
});

export default TripList;
