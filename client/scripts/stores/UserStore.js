/*
 * Invitation Store
 */

import {Store} from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import UserConstants from '../constants/UserConstants';
import _ from 'underscore';

var _currentUser = null;

function _loadCurrentUser(user) {
  _currentUser = user;
}

function _removeCurrentUser() {
  _currentUser = null;
}

class UserStore extends Store {

  getCurrentUser() {
    return _currentUser;
  }

}

var _UserStore = new UserStore();

// Register callback with AppDispatcher
AppDispatcher.register(function(payload) {

  switch(payload.actionType) {

    case UserConstants.LOGIN_USER:
      _loadCurrentUser(payload.user);
      break;
    case UserConstants.LOGOUT_USER:
      _removeCurrentUser();
      break;
    default:
      return true;

  }

  // If action was responded to, emit change event
  _UserStore.emitChange();

  return true;

});

export default _UserStore;
