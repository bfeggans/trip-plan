/* */ 
(function(Buffer) {
  var test = require("tape");
  var crypto = require("../index");
  test('ciphers', function(t) {
    crypto.listCiphers().forEach(function(cipher) {
      t.test(cipher, function(t) {
        t.plan(1);
        var data = crypto.randomBytes(562);
        var password = crypto.randomBytes(20);
        var crypter = crypto.createCipher(cipher, password);
        var decrypter = crypto.createDecipher(cipher, password);
        var out = [];
        out.push(decrypter.update(crypter.update(data)));
        out.push(decrypter.update(crypter.final()));
        if (cipher.indexOf('gcm') > -1) {
          decrypter.setAuthTag(crypter.getAuthTag());
        }
        out.push(decrypter.final());
        t.equals(data.toString('hex'), Buffer.concat(out).toString('hex'));
      });
    });
  });
  test('getCiphers', function(t) {
    t.plan(1);
    t.ok(crypto.getCiphers().length, 'get ciphers returns an array');
  });
})(require("buffer").Buffer);
