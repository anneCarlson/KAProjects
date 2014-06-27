// author(annie)
/* 
	A simple server that guides the user through the OAuth
	authentication flow. Should only need to be used when 
	making an account or when tokens are expired or invalidated.
	TODO(annie): automate testing to test multiple users 
	authenticating at once.
*/
var express = require('express');
  var app = express();  
var UserAuthentication = require('./userAuthentication');
var userauth; 

/*
	The page we direct a user to when we want them to 
	authenticate. Gets a request token and for the user before
	rerouting them to '.../forwardedTo'.
*/
app.get('/authenticate', function(req, res){
	userauth = new UserAuthentication();
	console.log('here');
    userauth.getRequestToken("http://localhost:8080/forwardedTo", res);    
});

/*
	After authenticating with Khan, the user is automatically
	rerouted to this page which retrieves the tokens for them.
*/
app.get('/forwardedTo', function(req, res){
	if(userauth.callbackID) {
			userauth.retrieveTokens();
    		res.end('<p>Thanks for authenticating!</p>');
    	} else {
    		res.redirect('/authenticate');
    	}
});

app.get('*', function(req, res){
	res.end('<p>default page</p>');
});

app.listen(8080, function(){
    console.log('- Server listening on port 8080');
});