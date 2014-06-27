var AM = require('./account-manager');

var newData = {
	id: "53474b8a938dbf0000cd0896",
	user: "Dooman" 
}

AM.cloneProject(newData, function(err, obj){
	if(err){
		console.log(err);
	} else {
		console.log("done");
	}
})