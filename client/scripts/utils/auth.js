class Auth  {
  constructor(){
    this.firebaseURL = "https://trip-plan.firebaseio.com";
  }
  twitterLogin(cb) {

    var that = this;
    var ref = new Firebase(this.firebaseURL);

    if (localStorage.token) {
      if (cb) cb(true);
      this.onChange(true);
      return;
    }

    ref.authWithOAuthPopup("twitter", function(error, authData) {
      if (error) {
        if(cb) cb(false);
        that.onChange(false);
      } else {
        localStorage.token = authData.token;
        console.log(authData.twitter);
        localStorage.twitter = JSON.stringify(authData.twitter);
        if(cb) cb(true);
        that.onChange(true);
      }
    });

  }
  getToken() {
    return localStorage.token;
  }
  logout(cb) {
    delete localStorage.token;
    if (cb) cb();
    this.onChange(false);
  }
  loggedIn() {
    return !!localStorage.token;
  }
  onChange() {}
}
export default new Auth();




