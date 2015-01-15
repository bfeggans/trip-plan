import React from 'react';
import Router from 'react-router';

var { Route, RouteHandler, Link, DefaultRoute } = Router;

var TripList = React.createClass({
  render: function(){
    var that = this;
    var createItem = function(trip, index) {
        return (
          <tr key={ index }>
            <td><Link to="trip" params={trip}>{ trip.destination }</Link></td>
            <td>{ trip.travelDates }</td>
          </tr>
        )
      };
    return (
      <table>
        <thead>
          <th>Destination</th>
          <th>Travel Dates</th>
        </thead>
        <tbody>{ this.props.trips.map(createItem) }</tbody>
      </table>
    )
  }
});

export default TripList;