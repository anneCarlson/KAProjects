var AM = require('./modules/account-manager');

var timeout = 1000 * 60 * 60 * 24;

AM.updatePrereqsVideos(function(err){
    if(err){
        console.log("error: ", err);
    } else {
        console.log("Successfully updated");
    }
})

// setInterval(function(){
// 	AM.updatePrereqsVideos(function(err){
// 		if(err){
// 			console.log("error: ", err);
// 		} else {
// 			console.log("Successfully updated");
// 		}
// 	})
// }, timeout);
