// // author(annie)
// /*
//         A module that keeps track of a single user through
//         authentication.
// */
// var KhanAcademy = require("temboo/Library/KhanAcademy/OAuth");

// // Our app's registered secret and key
// var consumerSecret = "hJg3kpxgZPrku2cR";
// var consumerKey = "u3hntsV5MZNVeQbb";

// /*
//        Constructor, made for each user authenticating.
// */
// var UserAuthentication = function() {
//         var tsession = require("temboo/core/temboosession");
//         // These are our Temboo parameters, see annie if you need to
//         // access our account
//         console.log('here')
//         this.session = new tsession.TembooSession("khanprojects", "authenticating", "79PKl9MWOKH7aYOgUpkgPDIxhSUmQ9bC");
//         console.log('not broken')
//         this.callbackID;
// }

// /*
//         Get's a request token for a single user. Takes forwardingURL
//         as a parameter which tells temboo where to redirect users
//         after they have authenticated with Khan.
// */
// UserAuthentication.prototype.getRequestToken = function(forwardingURL, res) {
//         var initializeOAuthChoreo = new KhanAcademy.InitializeOAuth(this.session);

//         // Instantiate and populate the input set for the choreo
//         var initializeOAuthInputs = initializeOAuthChoreo.newInputSet();

//         // Set inputs
//         initializeOAuthInputs.set_ConsumerSecret(consumerSecret);
//         initializeOAuthInputs.set_ConsumerKey(consumerKey);
//         initializeOAuthInputs.set_ForwardingURL(forwardingURL);

//         // Run the choreo, specifying success and error callback handlers
//         initializeOAuthChoreo.execute(
//                 initializeOAuthInputs,
//                 function(results){
//                         this.callbackID = results.get_CallbackID();
//                         // TODO(annie):HELP! How to I just reroute this URL
//                         // instead of opening a new tab?
//                         res.redirect(results.get_AuthorizationURL());
//                 }.bind(this),function(error){
//                         // TODO(annie): inform user of failure, ask them if
//                         // they want to attempt to authenticate again.
//                         console.log(error.type); console.log(error.message);}
//         );
// }

// /*
//         Completes the OAuth process by retrieving a Khan Academy
//         OAuth token and token secret for a user, after they have
//         visited the authorization URL returned by the
//         InitializeOAuth Choreo and clicked "allow."
// */
// UserAuthentication.prototype.retrieveTokens = function() {
//         var finalizeOAuthChoreo = new KhanAcademy.FinalizeOAuth(this.session);
//         // Instantiate and populate the input set for the choreo
//         var finalizeOAuthInputs = finalizeOAuthChoreo.newInputSet();

//         // Set inputs
//         finalizeOAuthInputs.set_CallbackID(this.callbackID);
//         finalizeOAuthInputs.set_ConsumerSecret(consumerSecret);
//         finalizeOAuthInputs.set_ConsumerKey(consumerKey);

//         // Run the choreo, specifying success and error callback handlers
//         finalizeOAuthChoreo.execute(
//                 finalizeOAuthInputs,
//                 function(results){
//                         console.log(results.get_OAuthToken());
//                         console.log(results.get_OAuthTokenSecret());
//                         // TODO(annie): insert values into database
//                 }, function(error){
//                         // TODO(annie): inform user of failure, ask them if
//                         // they want to attempt to authenticate again.
//                         console.log(error.type); console.log(error.message);}
// );
// }

// module.exports = UserAuthentication;
