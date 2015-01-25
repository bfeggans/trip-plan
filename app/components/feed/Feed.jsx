import React from 'react';

var Feed = React.createClass({
  render: function() {
    return (
      <div className="ui feed">
        <div className="event">
          <div className="label">
            <img src="http://semantic-ui.com/images/avatar/small/joe.jpg" />
          </div>
          <div className="content">
            <div className="summary">
              <a>Joe Henderson</a> said
              <div className="date">
                3 days ago
              </div>
            </div>
            <div className="extra text">
              Hopefully this is just as much fun as last time.
            </div>
            <div className="meta">
              <a className="like">
                <i className="like icon"></i> 5 Likes
              </a>
            </div>
          </div>
        </div>
        <div className="event">
          <div className="label">
            <img src="http://semantic-ui.com/images/avatar/small/daniel.jpg" />
          </div>
          <div className="content">
            <div className="summary">
              <a>Jason Smith</a> said
              <div className="date">
                1 Hour Ago
              </div>
            </div>
            <div className="extra text">
              Joe do you even remember last time?
            </div>
            <div className="meta">
              <a className="like">
                <i className="like icon"></i> 5 Likes
              </a>
            </div>
          </div>
        </div>
        <div className="content event">
          <div className="label">
            <img src="http://semantic-ui.com/images/avatar/small/daniel.jpg" />
          </div>
          <div className="content">
            <div className="summary">
              <a className="user">
                Jason Smith
              </a> confirmed they are coming!
              <div className="date">
                1 Hour Ago
              </div>
            </div>
            <div className="extra text">
              "I'm ready to get that money on this trip"
            </div>
          </div>
        </div>
      </div>
    )
  }
});

export default Feed;