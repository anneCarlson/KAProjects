// // author(annie)
// var q = require("q");
// //var async = require('async');
// var request = require('request');

// // Our app's registered secret and key
// var consumerSecret = "LnJaCPKRGpgeyUGq";
// var consumerKey = "Y7E9Hz76gev6mhbb";

// /*
//        Constructor
// */
// var APIcaller = function() {
//     var tsession = require("temboo/core/temboosession");
// 	// These are our Temboo parameters, see annie if you need to
// 	// access our account
// 	this.session = new tsession.TembooSession("khanprojects",
// 		"authenticating", "de7c31e11fcc4900b622865ddcff95ce");
// }

// /*
//         Returns all user info for a given user, using their
//         Token and Secret from authentication. Returns a promise
//         of a JSON that should be cached. If an error is thrown,
//         this is likely because the Token has been invalidated.
//         Caller must catch errors and prompt user to
//         reauthenticate.
// */
// APIcaller.prototype.getUserInfo = function(userToken, userSecret){
//     var KhanAcademy = require("temboo/Library/KhanAcademy/Users");

//     var currentUserChoreo = new KhanAcademy.CurrentUser(this.session);

//     // Instantiate and populate the input set for the choreo
//     var currentUserInputs = currentUserChoreo.newInputSet();

//     // Set inputs
//     currentUserInputs.set_OAuthTokenSecret(userSecret);
//     currentUserInputs.set_ConsumerSecret(consumerSecret);
//     currentUserInputs.set_ConsumerKey(consumerKey);
//     currentUserInputs.set_OAuthToken(userToken);

//     var deferred = q.defer();

//     // Run the choreo, specifying success and error callback handlers
//     currentUserChoreo.execute(
//         currentUserInputs,
//         function(results){
//             //TODO(annie): strip unnecessary fields
//             deferred.resolve(JSON.parse(results.get_Response()));},
//         function(error){
//             deferred.reject(new Error(error));}
//     );
//     return deferred.promise;
// }

// /*
//         Returns a promise of a list of all exercises any user
//         can gain proficiencies in, each in JSON format.
// */
// APIcaller.prototype.getAllExercises = function() {
//     var deferred = q.defer();
//     request('http://www.khanacademy.org/api/v1/exercises', function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//             //TODO(annie): strip unnecessary fields
//             deferred.resolve(JSON.parse(body));
//         }
//         else {
//             deferred.reject(new Error(error));
//         }
//     });
//     return deferred.promise;
// }


//         Returns a promise of a list of all relevant videos on
//         Khan Academy (a few videos for teachers are not
//         returned), each in JSON format. It takes a list of all
//         exercises as returned by getAllExercises.

// APIcaller.prototype.getVideosForAllExercises = function(exercises) {
//     var videoList = [];
//     var deferred = q.defer();
//     var counter = 0;
//     for(var i = 0; i<exercises.length; i++) {
//         getVideosForExercise(exercises[i].name).then(
//             function(result){
//                 counter++;
//                 for(var j = 0; j<result.length; j++) {
//                     if(videoList.indexOf(result[j]) == -1) {
//                         videoList.push(result[j]);
//                     }
//                 }
//                 // Once every exercise has returned successfully,
//                 // return the videoList. If any exercise did not
//                 // return successfully, an error is thrown
//                 // instead.
//                 if(counter==exercises.length) {
//                     deferred.resolve(videoList);
//                 }
//             }, function(error){
//                 deferred.reject(new Error(error));
//         });
//     }
//     return deferred.promise;
//     // My failed attempt to do this with the async library
//     /*console.log(exercises.length);
//     var addVidToList = function(vid, doneCallback) {
//         if(videoList.indexOf(video) == -1) {
//             videoList.push(video);
//             return doneCallback(null);
//         }
//     }

//     var addAllVids = function(item, doneCallback){
//             console.log(item.name);
//             this.getVideosForExercise(item.name).then(
//                 function(result){
//                     console.log(result);
//                     async.each(result, addVidToList, function(error){ console.log("error in callback2");});
//                     return doneCallback(null);
//                 }, function(error){
//                     console.log("error in getVideosForAllExercises");
//             });}

//     async.each(exercises, addAllVids, function(error) { console.log(videoList);});*/

// }

// /*
//         A helper function for getVideosForAllExercises that
//         returns a promise of a list of all videos (in JSON
//         format) related to a given exercise, the name of which
//         is passed in as a parameter.
// */
// getVideosForExercise = function(exercise) {
//     var deferred = q.defer();
//     request('http://www.khanacademy.org/api/v1/exercises/' + exercise +'/videos'
//         , function (error, response, body) {
//             if (!error && response.statusCode == 200) {
//                 //TODO(annie): strip unnecessary fields
//                 deferred.resolve(JSON.parse(body));
//             }
//             else {
//                 deferred.reject(new Error(error));
//             }
//         });
//     return deferred.promise;
// }


// module.exports = APIcaller;
