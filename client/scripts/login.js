document.getElementById('twitterLogin').addEventListener('click', function(){

	var ref = new Firebase("https://trip-plan.firebaseio.com");
	ref.authWithOAuthPopup("twitter", function(error, authData) {
	  if (error) {
	  	console.log("Login Failed!", error);
	  } else {
	  	console.log("Authenticated successfully with payload:", authData);
	  }
	});

});


