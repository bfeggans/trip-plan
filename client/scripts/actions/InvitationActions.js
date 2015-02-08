import AppDispatcher from '../dispatcher/AppDispatcher';
import _ from 'underscore';
import InvitationConstants from '../constants/InvitationConstants';
import InvitationApi from '../utils/InvitationApi';

class InvitationActions {

  constructor() {
    this.api = new InvitationApi();
  }

  requestTripInvitations(tripId) {
    this.api.getInvitations(tripId, function(response) {
      AppDispatcher.dispatch({
        actionType: InvitationConstants.RECEIVE_INVITATIONS,
        data: response
      });
    });
  }

  respondToInvitation(attrs) {
    this.api.updateInvitation(attrs);
    AppDispatcher.dispatch({
      actionType: InvitationConstants.RESPOND_INVITATION,
      data: attrs
    });
  }

}

export default new InvitationActions();
