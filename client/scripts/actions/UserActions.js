import AppDispatcher from '../dispatcher/AppDispatcher';
import _ from 'underscore';
import UserConstants from '../constants/UserConstants';
import Auth from '../utils/auth';

class UserActions {

  constructor() {

  }

  checkLoggedIn() {
    if (localStorage.user) {
      AppDispatcher.dispatch({
        actionType: UserConstants.LOGIN_USER,
        user: JSON.parse(localStorage.user)
      });
    } else {
      AppDispatcher.dispatch({
        actionType: UserConstants.LOGIN_USER,
        user: null
      });
    }
    return;
  }

  loginUser(email, password, cb) {

    if (localStorage.user) {
      AppDispatcher.dispatch({
        actionType: UserConstants.LOGIN_USER,
        user: JSON.parse(localStorage.user)
      });
      return;
    }

    Auth.loginUser(email, password, function (err, user) {
      if(err) {
        cb(err);
        return;
      }
      localStorage.user = JSON.stringify(user);
      AppDispatcher.dispatch({
        actionType: UserConstants.LOGIN_USER,
        user: user
      });
    });

  }

  logoutUser() {
    delete localStorage.user;

    AppDispatcher.dispatch({
      actionType: UserConstants.LOGOUT_USER,
    });
  }

}

export default new UserActions();
