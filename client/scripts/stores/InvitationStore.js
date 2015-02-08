/*
 * Invitation Store
 */

import {Store} from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import InvitationConstants from '../constants/InvitationConstants';
import _ from 'underscore';

var _invitations = [];

function _loadInvitationData(data) {
  data.map( (invite) => {
    if(!_.findWhere(_invitations, {id:invite.id})) {
      _invitations.push(invite)
    }
  });
}

function _updateInvitation(invite) {

  var indexOf = function(id, items) {
    var i = 0;
    var len = items.length;
    for (i = 0; i < len; i++) {
      if (id === items[i].id) {
        return i;
      }
    }
    return -1;
  }

  var index = indexOf(invite.id, _invitations)

  if(index === -1) {
    _invitations.push(invite)
  } else {
    _invitations[index] = invite;
  }
  
}

class InvitationStore extends Store {

  getTripInvitations(tripId) {
    return _.where(_invitations, {tripId: tripId});
  }
  // getInvitationsByUser(user)
  // getInviationStatus(user, trip)

}

var _invitationStore = new InvitationStore();

// Register callback with AppDispatcher
AppDispatcher.register(function(payload) {

  switch(payload.actionType) {

    // Respond to RECEIVE_DATA action
    case InvitationConstants.RECEIVE_INVITATIONS:
      _loadInvitationData(payload.data);
      break;
    case InvitationConstants.RESPOND_INVITATION:
      _updateInvitation(payload.data);
      break;

    default:
      return true;

  }

  // If action was responded to, emit change event
  _invitationStore.emitChange();

  return true;

});

export default _invitationStore;
