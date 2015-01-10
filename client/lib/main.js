import $ from 'jquery';
import login from 'lib/login';

console.log(login);

$(function() {
	$('#twitterLogin').on('click', login.twitterLogin);
});

export default {}