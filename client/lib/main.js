import $ from 'jquery';
import login from 'lib/login';

$(function() {
	$('#twitterLogin').on('click', function() {
		login.twitterLogin();
	});
});

export default {}