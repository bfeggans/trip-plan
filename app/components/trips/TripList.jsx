import React from 'react';
import Router from 'react-router';

var { Route, RouteHandler, Link, DefaultRoute } = Router;

var TripList = React.createClass({
  render: function(){
    var that = this;
    var createItem = function(trip, index) {
        return (
          <div key={ index } className="item">
            <div className="content">
              <Link to="trip" params={trip}>{ trip.destination } - { trip.travelDates }</Link>
            </div>
          </div>
        )
      };
    return (
      <div className="ui animate massive list">
        { this.props.trips.map(createItem) }
      </div>
    )
  }
});

export default TripList;