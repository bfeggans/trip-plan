/*
 * Invitation Store
 */

import {Store} from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import InvitationConstants from '../constants/InvitationConstants';
import _ from 'underscore';

var _invitations = [];

function _loadInvitationData(data) {

  data.map( (invite) => _invitations.push(invite) );
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
      //_loadInvitationData(payload.data); // TODO update the invitations
      break;

    default:
      return true;

  }

  // If action was responded to, emit change event
  _invitationStore.emitChange();

  return true;

});

export default _invitationStore;
