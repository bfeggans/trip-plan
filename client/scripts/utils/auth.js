class Auth  {
  constructor(){
    this.firebaseURL = "https://trip-plan.firebaseio.com";
  }

  twitterLogin(cb) {

    var that = this;
    var ref = new Firebase(this.firebaseURL);

    ref.authWithOAuthPopup("twitter", function(error, authData) {

      console.log(authData);

      if (error) {
        if(cb) cb(error);
      } else {
        //if(cb) cb(null, authData.twitter, authData.token);
      }
    });

  }

  _firebaseLogin(email, password, cb) {
    var ref = new Firebase(this.firebaseURL);
    ref.authWithPassword({
      email    : email,
      password : password
    }, cb);
  }

  loginUser(email, password, cb) {
    var that = this;
    this._firebaseLogin(email, password, function(error, authData) {
      if (error) {
        if(error.code === "INVALID_USER")  {
          that.registerUser(email, password, function(err, authData) {
            that._firebaseLogin(email, password, function(error, authData) {
              cb(null, authData);
            });
          });
        } else {
          cb(error.message, null);
        }
      } else {
        cb(null, authData);
      }
    });
  }

  registerUser(email, password, cb) {
    var ref = new Firebase(this.firebaseURL);
    ref.createUser({
      email    : email,
      password : password
    }, function(error) {
      if (error === null) {
        cb();
      } else {
        console.log("Error creating user:", error);
      }
    });
  }

}
export default new Auth();
