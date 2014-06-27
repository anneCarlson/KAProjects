// author(annie)
/*
        A module that keeps track of a single user through
        authentication.
*/
var KhanAcademy = require("temboo/Library/KhanAcademy/OAuth");

// Our app's registered secret and key
var consumerSecret = process.env.KHAN_SECRET;
var consumerKey = process.env.KHAN_KEY;
var tembooKey = process.env.TEMBOO_KEY;

/*
       Constructor, made for each user authenticating.
*/
var UserAuthentication = function() {
        var tsession = require("temboo/core/temboosession");
        // These are our Temboo parameters, see annie if you need to
        // access our account
        console.log(tembooKey);
        this.session = new tsession.TembooSession("khanprojects", "myFirstApp", tembooKey);
        //this.callbackID;
}

/*
        Get's a request token for a single user. Takes forwardingURL
        as a parameter which tells temboo where to redirect users
        after they have authenticated with Khan.
*/
UserAuthentication.prototype.getRequestToken = function(forwardingURL, callback) {
        var initializeOAuthChoreo = new KhanAcademy.InitializeOAuth(this.session);

        // Instantiate and populate the input set for the choreo
        var initializeOAuthInputs = initializeOAuthChoreo.newInputSet();

        // Set inputs
        initializeOAuthInputs.set_ConsumerSecret(consumerSecret);
        initializeOAuthInputs.set_ConsumerKey(consumerKey);
        initializeOAuthInputs.set_ForwardingURL(forwardingURL);

        // Run the choreo, specifying success and error callback handlers
        initializeOAuthChoreo.execute(
                initializeOAuthInputs,
                function(results){
                        //this.callbackID = results.get_CallbackID();
                        callback(results.get_AuthorizationURL(), results.get_CallbackID());
                        //res.redirect(results.get_AuthorizationURL());
                }.bind(this),function(error){
                        // TODO(annie): inform user of failure, ask them if
                        // they want to attempt to authenticate again.
                        console.log(error.type); console.log(error.message);}
        );
}

/*
        Completes the OAuth process by retrieving a Khan Academy
        OAuth token and token secret for a user, after they have
        visited the authorization URL returned by the
        InitializeOAuth Choreo and clicked "allow."
*/
UserAuthentication.prototype.retrieveTokens = function(callbackId, callback) {
        var finalizeOAuthChoreo = new KhanAcademy.FinalizeOAuth(this.session);
        // Instantiate and populate the input set for the choreo
        var finalizeOAuthInputs = finalizeOAuthChoreo.newInputSet();
        if(callbackId==''){
            callback(new Error('not logged in'));
            return;
        }
        // Set inputs
        finalizeOAuthInputs.set_CallbackID(callbackId);
        finalizeOAuthInputs.set_ConsumerSecret(consumerSecret);
        finalizeOAuthInputs.set_ConsumerKey(consumerKey);
        // Run the choreo, specifying success and error callback handlers
        finalizeOAuthChoreo.execute(
                finalizeOAuthInputs,
                function(results){
                        // TODO(annie): get userdata and insert into database
                        // TODO(annie): insert values into database
                        //res.redirect('/home');
                        callback(results.get_OAuthToken(), results.get_OAuthTokenSecret());
                }, function(error){
                        // TODO(annie): inform user of failure, ask them if
                        // they want to attempt to authenticate again.
                        console.log(error.type); console.log(error.message);
                        callback(error);}
);
}

module.exports = UserAuthentication;
