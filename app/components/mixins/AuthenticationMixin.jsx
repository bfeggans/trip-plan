import UserStore from '../../stores/UserStore';
import UserActions from '../../actions/UserActions';
import Login from '../common/Login';

var Authentication = {
  statics: {
    willTransitionTo: function (transition) {
      if (!UserStore.getCurrentUser()) {
        Login.attemptedTransition = transition;
        transition.redirect('/login');
      }
    }
  }
};

export default Authentication;
