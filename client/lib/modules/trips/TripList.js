import React from 'react';
import Router from 'react-router';

var { Route, RouteHandler, Link, DefaultRoute } = Router;

var TripList = React.createClass({displayName: "TripList",
  render: function(){
    var that = this;
    var createItem = function(trip, index) {
        return (
          React.createElement("tr", {key: index }, 
            React.createElement("td", null, React.createElement(Link, {to: "trip", params: trip},  trip.destination)), 
            React.createElement("td", null,  trip.travelDates), 
            React.createElement("td", {onClick:  that.props.removeTrip}, "x")
          )
        )
      };
    return (
      React.createElement("table", null, 
        React.createElement("thead", null, 
          React.createElement("th", null, "Destination"), 
          React.createElement("th", null, "Travel Dates")
        ), 
        React.createElement("tbody", null,  that.props.trips.map(createItem) )
      )
    )
  }
});

export default TripList;