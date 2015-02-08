import React from 'react';
import Router from 'react-router';
import UserStore from '../../stores/UserStore';
import UserActions from '../../actions/UserActions';

var Login = React.createClass({
  mixins: [ Router.Navigation ],

  statics: {
    attemptedTransition: null
  },

  getInitialState: function () {
    return {
      error: false
    };
  },

  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange, this);
  },

  handleSubmit: function (event) {
    event.preventDefault();
    var that = this;
    UserActions.loginUser(this.state.email, this.state.password, function(error) {
      that.setState({error:error});
    });
  },

  onChangeEmail(e) { this.setState({email: e.target.value}) },
  onChangePassword(e) { this.setState({password: e.target.value}) },

  _onChange: function() {

    if(UserStore.getCurrentUser()) {
      if (Login.attemptedTransition) {
        var transition = Login.attemptedTransition;
        Login.attemptedTransition = null;
        transition.retry();
      } else {
        this.replaceWith('/dashboard');
      }
    } else {
      this.setState({ error: true });
    }

  },

  render: function () {
    var errors = this.state.error ? <p>{ this.state.error }</p> : '';
    return (
      <div>
        <h1>Hi, we'd like to know who you are so we can get your real self on some real trips</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="ui input">
            <input onChange={this.onChangeEmail} type="text" placeholder="email" />
          </div>
          <div className="ui input">
            <input onChange={this.onChangePassword} type="password" placeholder="password" />
          </div>
          <br />
          <br />
          <button className="ui inverted blue button" type="submit">Login</button>
          {errors}
        </form>
      </div>
    );
  }
});

export default Login;
