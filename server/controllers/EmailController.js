var mandrill = require('mandrill-api/mandrill');

var _sendTemplateMessage = function (template, message, cb) {
  var mandrill_client = new mandrill.Mandrill('l6WnyZ3DxPxKd5pemFio7Q');
  var template_name = template;
  var async = false;

  mandrill_client.messages.sendTemplate({
    "template_name": template_name,
    "template_content": [],
    "message": message,
    "async": async
  }, function(result) {
    cb(result);
  }, function(e) {
    cb(e);
  });
}

module.exports = {
  sendTemplateMessage: _sendTemplateMessage
}
