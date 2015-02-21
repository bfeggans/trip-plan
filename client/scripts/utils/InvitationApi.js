import $ from 'jquery';
import _ from 'underscore';

export default class InvitationApi {

  getInvitations(tripId, cb) {
    $.get('https://trip-plan.firebaseio.com/invitations.json', function(response) {

      // put firebase response in appropriate format
      var invitationData = _.filter(response, function(val, key) {
        if(val.tripId === tripId) {
          var record = val;
          record.id = key;
          return record;
        };
      });

      cb(invitationData);
    });
  }

  updateInvitation(invite) {

    var url = 'https://trip-plan.firebaseio.com/invitations/' + invite.id + '.json';

    $.ajax({
      url: url,
      type: 'PUT',
      data: JSON.stringify(invite),
      success: function(){
        console.log('success');
        // TODO figure out what proper to do here
      }
    });

  }

}
