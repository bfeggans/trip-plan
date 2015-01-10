class Login  {
	constructor(){
		this.firebaseURL = "https://trip-plan.firebaseio.com";
	}
	twitterLogin() {
		var ref = new Firebase(this.firebaseURL);
		ref.authWithOAuthPopup("twitter", function(error, authData) {
		  if (error) {
		  	console.log("Login Failed!", error);
		  } else {
		  	console.log("Authenticated successfully with payload:", authData);
		  }
		});
	}
}
export default new Login();




