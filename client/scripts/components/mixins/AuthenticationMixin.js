import Auth from '../../utils/auth';
import Login from '../common/Login';

var Authentication = {
  statics: {
    willTransitionTo: function (transition) {
      if (!Auth.loggedIn()) {
        Login.attemptedTransition = transition;
        transition.redirect('/login');
      }
    }
  }
};

export default Authentication;