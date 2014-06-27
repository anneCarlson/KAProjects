// author: annie
var Q = require("q");
var crypto 		= require('crypto');
var moment 		= require('moment');
var _ = require('underscore');
var d = new Date();

/*Connect to the Database*/
var options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 60000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 60000 } }
};
var mongoose = require('mongoose'),
	ObjectID = mongoose.Types.ObjectId;

mongoose.connect('mongodb://projectsapp:learning@ds035846.mlab.com:35846/khanprojects', options, function(err) {

    if (err) console.log(err);
});

// mongoose.connection.on('error', function(err) {
//     console.error('MongoDB error: %s', err);
// });

var APIcaller = require('../api/apiCaller');
var API = new APIcaller();

//Schema for a prerequisite
var prerequisite_schema = mongoose.Schema({
    display_name: String,
    name: String,
    link: String,
    prerequisites: [String]
})

var video_schema = mongoose.Schema({
	display_name: String,
	url: String
})

//Schema for Project
var project_schema = mongoose.Schema({
	//Title of the schema
	title: String,

	//Username of creator
	creator: String,

	//URL to the thumbnail icon
	thumbnail: String,

	//Description of the project
	description: String,

	//List of prerequisite exercises
	prerequisites: [String],

	//JSON object representing contents of the project
	contents: String,
	rubric: String,
	videos: [String]
})

var published_project_schema = mongoose.Schema({
	//Title of the schema
	title: String,

	//Username of creator
	creator: String,

	//URL to the thumbnail icon
	thumbnail: String,

	//Description of the project
	description: String,

	//The id of the original project, empty string for unpublished projects
	original_id: String,

	//List of prerequisite exercises
	prerequisites: [String],

	//JSON object representing contents of the project
	contents: String,
	rubric: String,
	videos: [String]
})

//Schema for Cloned Project
var cloned_project_schema = mongoose.Schema({
	//Username of user that cloned project
	user: String,

	//String representing status of project:
	//	Can be in_queue, available, in_progress, complete
	status: String,

	//URL to the thumbnail icon
	thumbnail: String,

	//Description of the project
	description: String,

	//List of prerequisite exercises
	prerequisites: [String],
	//general recommended skills to learn next to work towards completing this project
	gen_skill_recs: [String],

	//Stringified ID for the Project this instance was cloned from
	project_id: String,

	//Username of creator
	creator: String,

	//Title of the project
	title: String,

	//JSON object representing the contents of the project
	contents: String,
	rubric: String,
	videos: [String]
})

// Schema for single user
var user_schema = mongoose.Schema({
	//Username, password information
	username: String,
	email: String,
	password: String,
	name: String,
	session_ids: [String],
	session_id_times: [Number],

	//Khan Academy token, secret for accessing tree of knowledge
	khan_token: String,
	khan_secret: String,

	//Callback is for authenticating with khan
	khan_callback_id: String,

	//Proficiencies (data from khan API)
	proficiencies: [String],
	additional_skills: [String],

	//general recommended skills to learn next
	gen_skill_recs: [String]
});

//Define collection of users, projects, cloned projects
var User = mongoose.model("user_schema", user_schema);
var Project = mongoose.model("project_schema", project_schema);
var PublishedProject = mongoose.model("published_project_schema", published_project_schema);
var Cloned = mongoose.model("cloned_project_schema", cloned_project_schema);
var Prerequisite = mongoose.model("prerequisite_schema",prerequisite_schema);
var Video = mongoose.model("video_schema", video_schema);

//TODO (Sam): Write real data stripper for these calls
exports.updatePrereqsVideos = function(callback){
    API.getAllExercises().then(function(result){
        console.log('got all exercises');
        // console.log(result);
        for(var i = 0; i < result.length; i++){
            prereq = result[i];
            Prerequisite.findOne({name: this.prereq.name}, function(e,o) {
                if(e)
                    console.log("Error finding " + prereq.name);
                else if(!o) {
                    var newPrereq = new Prerequisite({
                        display_name: this.prereq.display_name,
                        name: this.prereq.name,
                        link: 'https://www.khanacademy.org' + this.prereq.relative_url,
                        prerequisites: this.prereq.prerequisites
                    });

                    newPrereq.save(function(err){
                        if(err)
                            console.log(err);
                    })
                } else {
                    Prerequisite.findOneAndUpdate({name: this.prereq.name}, {
                        display_name: this.prereq.display_name,
                        name: this.prereq.name,
                        link: 'https://www.khanacademy.org' + prereq.relative_url,
                        prerequisites: this.prereq.prerequisites
                    });
                }
            }.bind({prereq: prereq}));
        }
        console.log('now videos');
        API.getVideosForAllExercises(result).then(function(videos1){
            uniqueVideos = {};
            for(var j = 0; j < videos1.length; j++){
                var vid = videos1[j];
                uniqueVideos[vid.url] = {url:vid.url, title:vid.title};
            }
            videos = [];
            keys = Object.keys(uniqueVideos)
            for(var j = 0; j < keys.length; j++){
                videos.push(uniqueVideos[keys[j]]);

            }

            console.log('here at all!');
            for(var j = 0; j < videos.length; j++){
                // console.log(j);
                // console.log(videos.length)
                var vid = videos[j];
                Video.findOne({url: vid.url}, function(e,o) {
                    if(o){
                        console.log(this.vid.url);
                    }
                    if(e)
                        console.log("Error finding " + this.vid.title);
                    else if(!o) {
                        var newVideo = new Video({
                            display_name: this.vid.title,
                            url: this.vid.url
                        })

                        newVideo.save(function(err){
                            if(err)
                                console.log(err);
                            });
                    } else {
                        Video.findOneAndUpdate({url: this.vid.url}, {
                            display_name: this.vid.title,
                            url: this.vid.url
                        });
                    }
                }.bind({vid: vid}));
            }
            console.log("Done");
        }, function(error){
            console.log(error);
        })

    }, function(error){
        console.log(error);
        console.log("Failure getting exercises");
    });
}

/*
	Calls the callback with all strings representing prerequisites
*/
exports.getAllPrereqs = function(callback){
	Prerequisite.find({}, function(err, prereqs){
		if(err){
            console.log('all error')
			callback(err);
		} else {
			callback(null, prereqs);
		}
	})
}

/*
	Gets all prerequisites for a list of prerequisite names
*/
getAllPrereqsForList = function(list, callback){
    var promises = [];
    for(var i = 0 ; i < list.length; i++) {
        var promise = promiseFunction();
        function promiseFunction() {
            var deferred = Q.defer();
            Prerequisite.findOne({name: list[i]}, function(err, o){
                if(err){
                    callback(err);
                    console.log(error);
                    deferred.resolve();
                } else {
                    deferred.resolve(o);
                }
            })
            return deferred.promise;
        }
        promises.push(promise);
	}
	Q.all(promises).then(
	    function(result) {
	        callback(null, result);
	    });
}

exports.getAllRecPrereqsForUser = function(user, callback) {
    User.findOne({username: user}, function(e,o) {
        if(e || !o)
            callback(e);
        else {
            getAllPrereqsForList(o.gen_skill_recs, callback);
        }
    });
}

exports.getAllRecPrereqsForClone = function(id, user, callback) {
    Cloned.findOne({_id: id, user: user}, function(e,o) {
        if(e || !o)
            callback(e);
        else
            getAllPrereqsForList(o.gen_skill_recs, callback);
    });
}

/*
	Calls callback with all strings representing videos
*/
exports.getAllVideos = function(callback){
	Video.find({}, function(err, vids){
		if(err){
			callback(err);
		} else {
			callback(null, vids);
		}
	})
}

/* login validation methods */

/*
    Autologs in a user whose cookies contain a username and salt and hashed
    password. Automatically updates proficiencies with login.
*/
exports.autoLogin = function(user, session_id, callback){
	User.findOne({username: user}, function(err, o){
	    if (err) {
	        console.log('server-error');
	        callback('server-error', null);
		}else if(o) {
		    var ids = [];
            o.session_id_times.forEach(function(el, i) {
                if(d.getTime()-el > 24*60*60*14*1000)
                    ids.push(i);
            });
            o.session_id_times = o.session_id_times.filter(function(el, i) {return ids.indexOf(i) == -1});
            o.session_ids = o.session_ids.filter(function(el, i) {return ids.indexOf(i) == -1});
            User.findOneAndUpdate({username: user}, {session_ids: o.session_ids, session_id_times: o.session_id_times}, function(){
                if(o.session_ids.indexOf(session_id)==-1){
                    callback(null, null);
                } else {
                    // quick call to update proficiencies
                    updateProfsandSkills(user, callback, o, o.additional_skills,
                        {'username': user, 'session_id': session_id});
                }
			});
		} else {
			callback(null, null);
		}
	});
}

/*
    Manually logins users from the login page, updates proficiencies
    automatically. This function can also be used to password gate
    since updating proficiencies is so quick
*/
exports.manualLogin = function(user, pass, callback){
	User.findOne({username: user}, function(err, o){
	    if (err) {
	        console.log("error1");
	        callback('server-error');
		}else if(o == null){
		    console.log("error2");
			callback('user-not-found');
		} else {
			validatePassword(pass, o.password, function(err, res){
				if(res){
	                var ids = [];
                    o.session_id_times.forEach(function(el, i) {
                        if(d.getTime()-el > 24*60*60*14)
                            ids.push(i);
                    });
                    o.session_id_times = o.session_id_times.filter(function(el, i) {return ids.indexOf(i) == -1});
                    o.session_ids = o.session_ids.filter(function(el, i) {return ids.indexOf(i) == -1});
				    // quick call to update proficiencies
				    var session_id = generateSalt();
				    var session_id_time = d.getTime();
				    o.session_ids.push(session_id);
				    o.session_id_times.push(session_id_time);
				    User.findOneAndUpdate({username: user}, {session_ids: o.session_ids, session_id_times: o.session_id_times}, function(err, o){
                        updateProfsandSkills(user, callback, o, o.additional_skills,
                            {'username': user, 'session_id': session_id});
                    });
				} else {
				    console.log("error3");
					callback('invalid-password');
				}
			});
		}
	});
}

/*
    Logins a user without a password after they have authenticated with
    Khan. Is only called as a callback to AM.updateAuthentication which
    sets khan-callback_id to an empty string so that this only works after
    logging on and authenticating with Khan.
*/
exports.loginAfterAuthentication = function(user, callback){
    User.findOne({username: user}, function(err, o){
		if(err){
		    callback('server-error');
		}else if(o){
            var ids = [];
            o.session_id_times.forEach(function(el, i) {
                if(d.getTime()-el > 24*60*60*14)
                    ids.push(i);
            });
            o.session_id_times = o.session_id_times.filter(function(el, i) {return ids.indexOf(i) == -1});
            o.session_ids = o.session_ids.filter(function(el, i) {return ids.indexOf(i) == -1});
            var session_id = generateSalt();
            var session_id_time = d.getTime();
            o.session_ids.push(session_id);
            o.session_id_times.push(session_id_time);
            User.findOneAndUpdate({username: user}, {session_ids: o.session_ids, session_id_times: o.session_id_times}, function(err, o){
                if(err)
                    callback('user-not-found');
                else{

                    API.getUserExercises(o.khan_token, o.khan_secret).then(
                        function(result){
                            var addSkills = result;
                            // quick call to update proficiencies
                            API.getUserInfo(o.khan_token, o.khan_secret).then(
                                function(result){
                                    var profEx = result.proficient_exercises;
                                    function isntProficient(el){
                                        return profEx.indexOf(el) == -1;
                                    }
                                    // Updates proficiencies and removes additional_skills that have been added to
                                    // proficiencies
                                    User.update({username: user},{proficiencies: profEx,
                                        additional_skills: addSkills.filter(isntProficient)}, function(err) {
                                            if(err) {
                                                callback(err);
                                            } else {
                                                updateClonesStatuses(user, function(){});
                                                callback(null, {'username': user, 'session_id': session_id});
                                            }
                                        });
                                }, function(error){
                                    callback('must-reauthenticate', o);
                                });
                        }, function(error) {
                            // if API.getUserInfo() throws an error the user's token
                            // and secret are depreciated and they must reauthenticate
                            // with Khan. Should happen very rarely
                            callback('must-reauthenticate', o);
                        });
                        }
                    });
		} else {
		    callback('user-not-found');
		}
	});
}

exports.updateUserInfo = function(user, callback) {
    User.findOne({username: user}, function(err, o) {
        API.getUserExercises(o.khan_token, o.khan_secret).then(
            function(result){
                var addSkills = result;
                // quick call to update proficiencies
                API.getUserInfo(o.khan_token, o.khan_secret).then(
                    function(result){
                        var profEx = result.proficient_exercises;
                        function isntProficient(el){
                            return profEx.indexOf(el) == -1;
                        }
                        // Updates proficiencies and removes additional_skills that have been added to
                        // proficiencies
                        User.update({username: user},{proficiencies: profEx,
                            additional_skills: addSkills.filter(isntProficient)}, function(err) {
                                if(err) callback('error');
                                else updateSkillRecs(user, function(){updateClonesStatuses(user, callback)});
                            });
                    }, function(error){
                        callback('must-reauthenticate');
                    });
            }, function(error) {

                // if API.getUserInfo() throws an error the user's token
                // and secret are depreciated and they must reauthenticate
                // with Khan. Should happen very rarely
                console.log(error);
                callback('must-reauthenticate');
            });
        });

}

/*
    Helper function for all logins. Can later be used to update proficiencies
    with a button click. Takes a username, a callback, a user schema object,
    and an additional skills list (just o.additional_skills for fast updating
    and he response from API.getUserExercises for a full update.
*/
updateProfsandSkills = function(user, callback, o, addSkills, oToRet) {
    API.getUserInfo(o.khan_token, o.khan_secret).then(
        function(result){
            var profEx = result.proficient_exercises;
            function isntProficient(el){
                return profEx.indexOf(el) == -1;
            }
            // Updates proficiencies and removes additional_skills that have been added to
            // proficiencies
            User.update({username: user},{proficiencies: profEx,
                additional_skills: addSkills.filter(isntProficient)}, function(err) {
                    if(err) callback('user-not-found');
                    else{
                        updateClonesStatuses(user, function(){});
                        updateSkillRecs(user, function(e) {
                            if(e)
                                callback(e);
                            else
                                callback(null, oToRet);
                        });
                    }
                });
        }, function(error){
            callback('must-reauthenticate', oToRet);
        });
}

//The callback passed to this function should do whatever the caller function wants with no arguments
updateSkillRecs = function(user, callback) {
    User.findOne({username: user}, function(e, o){
        if(o) {
            var allUpDateLists = [];
            var userKnows = o.additional_skills.concat(o.proficiencies);
            exports.getClonesForUser(user, function(e, list) {
                if(e)
                    callback(e);
                else{
                    var promises = [ ];
                    for(var i = 0; i< list[0].length; i++){
                        promise = updatedOneClone(list[0][i].prerequisites, list[0][i].status);
                        function updatedOneClone(prereqs, status){
                            var deferred = Q.defer();
                            updateClonedGenSkillRecs(userKnows, prereqs, '', i).then(
                                function(result){
                                    allUpDateLists = allUpDateLists.concat(result[1]);
                                    if(result[1].length ==0 && status == 'in_queue')
                                        status = 'available';
                                    Cloned.update({_id: list[0][result[0]]._id}, {status: status, gen_skill_recs: result[1]}, function(e){
                                        deferred.resolve();
                                        if(e)
                                            console.log("error in updateSkillRecs");
                                    });
                                });
                            return deferred.promise;
                        }
                        promises.push(promise);
                    }
                    Q.all(promises).then(
                        function(){
                            var frequency = {};

                            allUpDateLists.forEach(function(value) { frequency[value] = 0; });

                            var uniques = allUpDateLists.filter(function(value) {
                                return ++frequency[value] == 1;
                            });

                            uniques = uniques.sort(function(a, b) {
                                return frequency[b] - frequency[a];
                            });
                            User.update({username: user}, {gen_skill_recs: uniques}, function() {
                                callback();
                            });
                        }
                    );
                }
            });
        } else {
            console.log('cant find user in updateSkillRecs');
        }
    });
}

/* updates the gen_skill_recs for one cloned project*/
updateClonedGenSkillRecs = function(userKnows, prerecs, parent, index){
    var toRet = Q.defer();
    clonedGenSkillRecs = [];
    var promises = [ ];
    for(var i = 0; i< prerecs.length; i++){
        thisSkill = prerecs[i];
        promise = thisSkillBubbleDown(thisSkill);
        function thisSkillBubbleDown(thisSkill2) {
            var deferred = Q.defer();
            Prerequisite.findOne({name: thisSkill2}, function(e, o) {
                if(o) {
                    if(userKnows.indexOf(o.name) == -1){
                        if(o.prerequisites.filter(function(el){return userKnows.indexOf(el) == -1}).length == 0) {
                            clonedGenSkillRecs.push(o.name);
                            deferred.resolve();
                        } else {
                            updateClonedGenSkillRecs(userKnows, o.prerequisites, thisSkill2, index).then(
                                function(result) {
                                clonedGenSkillRecs.concat(result[1]);
                                deferred.resolve();
                            });
                        }
                    } else {
                        deferred.resolve();
                    }
                } else {
                    Prerequisite.findOne({name: parent}, function(e, o) {
                        if(o) {
                            if(o.prerequisites.filter(function(el){return userKnows.indexOf(el) == -1}).length == 1) {
                                clonedGenSkillRecs.push(parent);
                                deferred.resolve();
                            } else {
                                deferred.resolve();
                            }
                        } else {
                            deferred.resolve();
                        }
                    });
                }
            });
            return deferred.promise;
        }
        promises.push(promise);
    }
    Q.all(promises).then(
        function(){
            var uniqueSkills = [];
            for(var i = 0; i< clonedGenSkillRecs.length; i++){
                el = clonedGenSkillRecs[i];
                if(uniqueSkills.indexOf(el) === -1)
                    uniqueSkills.push(el);
            }
            toRet.resolve([index, uniqueSkills]);
    });
    return toRet.promise;
}

/* authentication and logout */
exports.authenticate = function(username, session_id, callback) {
    User.findOne({username: username}, function(e, o){
        if(e){
            callback('user not found');
        } else {
            if(o == null)
                callback('user not found');
            else {
                var index = o.session_ids.indexOf(session_id);
                if(index==-1)
                    callback('invalid session');
                else
                    // callback(null);
                    o.session_id_times[index] = d.getTime();
                    User.findOneAndUpdate({username: username},
                                          {session_id_times: o.session_id_times[index]},
                                          function(e, o){
                        if(e) {
                            callback('failed to update user');
                        } else {
                            callback(null);
                        }
                    });
            }
        }
    });
}

exports.getUpdateInformation = function(username, callback){
    User.findOne({username: username}, "username name email", function(err, o) {
        if(o)
            callback(o);
        else
            callback();
    });
}


exports.logout = function(username, session_id, callback) {
    User.findOneAndUpdate({username: username}, {session_ids: [], session_id_times: []}, function(e, o){
        callback();
    });
}

/* record insertion, update & deletion methods */

/*
    Creates a new user.
*/
exports.addNewAccount = function(newData, callback){
	User.findOne({username: newData.user}, function(e, o){
		if(e){
		    callback('server-error');
		}else if(o){
			callback('username-taken');
		} else {
			User.findOne({email:newData.email}, function(e, o){
				if(o){
					callback('email-taken');
				} else {
					saltAndHash(newData.pass, function(hash){
						newData.pass = hash;

						var newUser = new User({
							username: newData.user,
							email: newData.email,
							password: newData.pass,
							name: newData.name,
							//generateSalt doubles as a way to make session_ids
							session_ids: [],
							session_id_times: [],

							image: '',

							khan_token: '',
							khan_secret: '',
							khan_callback_id: '',

							proficiencies: [],
							additional_skills: [],
							gen_skill_recs: []
						});

						newUser.save(function(err){
							if(err){
								callback('error saving');
							} else {
							    User.findOne({username: newData.user}, 'username session_ids', function(e, o){
								    callback(null, o);
								});
							}
						});
					});
				}
			})
		}
	})
}

/*
	Takes username and creates a new project object for that user
*/
exports.createNewProject = function(username, callback){
	var newProject = new Project({
		title: '',
		creator: username,
		thumbnail: '',
		description: '',

		prerequisites: [],
		contents: '[]',

		rubric: '',
		videos: []
	});

	newProject.save(function(err){
		if(err){
			callback('error saving');
		} else {
			Project.findById({_id: newProject._id}, function(e, o){
                console.log('found a project');
				callback(null, o);
			});
		}
	});
}

/*
	newData {
		id: String , //The id of the project being cloned
		user: String, //username of user cloning project
	}
*/
exports.cloneProject = function(newData, callback){

    if(newData.id.length == 24) {
        var objID = new ObjectID(newData.id);
        Cloned.findOne({project_id: newData.id, user: newData.user}, function(err, o) {
            if(!o && !err) {
                PublishedProject.findById({_id: objID}, function(err, proj){
                    if(err){
                        callback(err);
                    } else {
                        User.findOne({username: newData.user}, function(e, o){
                            if(err){
                                callback(err);
                            }else if(!o){
                                callback(err);
                            } else {
                                var newCloned = new Cloned({
                                    user: newData.user,
                                    thumbnail: proj.thumbnail,
                                    description: proj.description,
                                    status: knowsPrereqs(o.proficiencies.concat(o.additional_skills), proj.prerequisites),

                                    prerequisites: proj.prerequisites,
                                    project_id: newData.id,
                                    creator: proj.creator,
                                    gen_skill_recs: [],

                                    title: proj.title,
                                    contents: proj.contents,
                                    rubric: proj.rubric,
                                    videos: proj.videos
                                });
                                newCloned.save(function(err){
                                    if(err){
                                        callback(err);
                                    } else {
                                        Cloned.findById({_id: newCloned._id}, function(e, o){
                                            updateSkillRecs(newData.user, function(){
                                                callback(null, o);
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            } else if(o){
                callback(null, o);
            } else {
                callback(err);
            }
        });
	} else {
	    callback('err');
	}
}

//this updates the page data and/or status of a cloned project. It takes newData,
//which much contain an id, updated contents, and a status. If contents or
//status is set to null, they will not be updated
exports.updateClonedProject = function(newData, user, callback) {
    update = {};
    if(newData.contents != null)
        update.contents = newData.contents;
    if(newData.status != null)
        update.status = newData.status;
    Cloned.findOne({_id: new ObjectID(newData.id), user: user}, function(e,o) {
        if(e)
            callback(e, null);
        else if (o) {
            if(o.status != 'complete') {
                Cloned.update({_id: new ObjectID(newData.id), user: user}, update, function(e, o) {
                    if(e)
                        callback(e, null);
                    else if (o) {
                        callback(null, o);
                    } else
                        callback(null, null);
                });
            } else
                callback(null, null);
        } else
            callback(null, null);
    });
}

//helper function that determines whether a cloned project is available or not
knowsPrereqs = function(userKnows, prerecs) {
    if (prerecs.filter(function(el){return userKnows.indexOf(el) == -1}).length == 0)
        return 'available';
    else
        return 'in_queue';
}

//updates the statuses of all cloned projects for a given user
updateClonesStatuses = function(user, callback) {
    User.findOne({username: user}, function(e, o){
        if(o){
            userKnows = o.proficiencies.concat(o.additional_skills);
            Cloned.find({user: user}, function(err, o) {
                if(o) {
                    var promises = []
                    for(i = 0; i < o.length; i++) {
                        var promise = thisPromise();
                        function thisPromise() {
                            var deferred = Q.defer();
                            thisClone = o[i];
                            if(thisClone.status == 'available' || thisClone.status == 'in_queue') {
                                Cloned.update({id: o.id}, {status: knowsPrereqs(userKnows, thisClone.prerequisites)}, function(e, o) {});
                                deferred.resolve();
                            }
                            return deferred;
                        }
                        promises.push(promise);
                    }
                    Q.all(promises).then(callback());
                }
            });
        }
        else {
            console.log('clones did not update status');
        }
    });
}

/*
	Takes id of the project, and JSON newData object with fields
		newData {
			title: String,
			thumbnail: String,
			description: String,

			prerequisites: [String],
			contents: String
		}
*/
exports.updateProject = function(id, author, newData, callback){
    if(id.length == 24) {
        var objID = new ObjectID(id);
        if ( ! newData.videos)
            newData.videos = [];
        if ( ! newData.prerequisites)
            newData.prerequisites = [];
        if ( ! newData.rubric)
            newData.rubric = '';
        Project.update({_id: objID, creator: author}, {
            title: newData.title,
            thumbnail: newData.thumbnail,
            description: newData.description,

            prerequisites: newData.prerequisites,
            contents: newData.contents,
            rubric: newData.rubric,
            videos: newData.videos
        }, function(err){
                if(err){
                    console.log(err);
                    callback(err);
                } else {
                    callback(null);
                }
        });
	} else {
	    callback("error");
	    }
}

/*
	Sets published value of project with given id to true
*/
exports.publishProject = function(id, author, newData, callback){
    if(id.length == 24) {
        var objID = new ObjectID(id);

        if(!newData.videos)
            newData.videos = [];

        Project.findOneAndUpdate({_id: objID, creator: author}, {
            title: newData.title,
            thumbnail: newData.thumbnail,
            description: newData.description,

            prerequisites: newData.prerequisites,
            contents: newData.contents,
            rubric: newData.rubric,
            videos: newData.videos
        }, function(err, o){
                if(err){
                    console.log('err1');
                    console.log(err);
                    callback(err);
                } else if(o){
                    var objID = new ObjectID(id);
                    PublishedProject.remove({original_id: objID}, function(err) {
                        if (err) {
                            callback(err);
                        }
                        else {
                            var newProject = new PublishedProject({
                                title: o.title,
                                creator: o.creator,
                                thumbnail: o.thumbnail,
                                description: o.description,

                                original_id: o._id,
                                prerequisites: o.prerequisites,
                                contents: o.contents,
                                rubric: o.rubric,
                                videos: o.videos
                            });

                            newProject.save(function(err){
                                if(err){
                                    callback('error saving');
                                }
                                else
                                    callback();
                            });
                        }
                    });
                } else {
                    console.log('err2');
                    callback(err);
                }
        });
    } else
        callback("error");
}

/*
	Calls callback with project of id as input.
*/
exports.getProjectByID = function(id, user, callback){
    if(id.length == 24) {
        var objID = new ObjectID(id);
         Project.findById({_id: objID, creator: user}, function(e, o){
            if(e){
                callback(e);
            } else if (o) {
                callback(null, o);
            } else {
               PublishedProject.findById({_id: objID}, function(e, o){
                    if(e){
                        callback(e);
                    } else if (o) {
                        callback(null, o);
                    } else {
                        callback('error');
                    }
                });
            }
        })
    } else
        callback("error");
}

exports.getClonedProjectByID = function(id, user, callback){
    if(id.length == 24) {
        var objID = new ObjectID(id);
        Cloned.findById({_id: objID}, function(e, o){
            if(e){
                callback(e);
            } else if (o && (o.user == user || o.status == 'complete') ){
                callback(null, o);
            } else {
                Project.findById({_id: objID, creator: user}, function(e, o){
                    if(e){
                        callback(e);
                    } else {
                        callback(null, o);
                    }
                })
            }
        });
	} else {
	    callback('error');
	}
}

/*
	Calls callback with all projects created by username
*/
exports.getProjectsByUser = function(username, callback){
	Project.find({creator: username}, function(e, o){
		if(e){
			callback(e);
		} else {
			callback(null, o);
		}
	})
}

/*
	Calls callback with cloned projects for username
*/
exports.getClonesForUser = function(username, callback){
	Cloned.find({user: username}, function(e, o){
		if(e){
			callback(e);
		} else {
			callback(null, [o.filter(function(el){return el.status == 'in_queue';}),
			    o.filter(function(el){return el.status == 'available';}),
			    o.filter(function(el){return el.status == 'in_progress';}),
			    o.filter(function(el){return el.status == 'complete';})]);
		}
	})
}

// returns list for allProjects page
//TODO(annie): write better description and update this
//to actually do what we want
exports.getAllProjects = function(username, callback){
	PublishedProject.find({}, 'title thumbnail description _id creator prerequisites', function(e, o){
		if(e){
			callback(e);
		} else {
		        allProjects = o;
				Project.find({creator: username}, 'title thumbnail description _id creator prerequisites', function(e, o){
                    if(e){
                        callback(e);
                    } else {
                        authoredProjects = o;
                        function isntAuthor(el, index, objArray){
                        	return el.creator != username;/*! _.reduce(authoredProjects, function(memo, val){
                        		return _.isEqual(el.original_id, val._id) || memo;
                        	}, false)*/
                        }
                        Cloned.find({user: username}, function(e, o){
                            if(e){
                                callback(e);
                            } else if (!o) {
                                callback(null, [allProjects.filter(isntAuthor), authoredProjects]);
                            } else {
                                function isntClone(el, index, objArray){
                                    return ! _.reduce(o, function(memo, val){
                                        return _.isEqual(el._id+'', val.project_id) || memo;
                                    }, false)
                                }
                                callback(null, [allProjects.filter(isntAuthor).filter(isntClone), authoredProjects]);
                            }
                        });
                    }
                });
		}
	})
}

/*
    Updates a users token and secret after authenticating with Khan.
    Do not call outside of /forwardTo/:user.
*/
exports.updateAuthentication = function(newData, callback){
    User.findOne({username: newData.username}, function(e, o){
		if(e){
			callback(e);
		} else if(o == null){
			callback('user-not-found');
		} else {
		    // setting khan_callback_id to the empty string is an important security step to make sure
		    // users can't login without a password by going to /forwardedTo/:user.
		    User.update({username: newData.username},{khan_token: newData.khan_token, khan_secret: newData.khan_secret, khan_callback_id: ''}, function(err){
				if(err) callback(err);
				else callback(null, o);
			});
		}
	});
}

/*
    Sets a users callbackId before sending them to Khan to authenticate.
*/
exports.addCallbackId = function(newData, callback){
    User.findOne({username: newData.username}, function(e, o){
		if(e){
			callback(e);
		} else if(o == null){
			callback('user-not-found');
		} else {
		        User.update({username: newData.username},{khan_callback_id: newData.khan_callback_id}, function(err){
				if(err) callback(err);
				else callback(null, o);
			});
		}
	});
}

/*
    Fetches a user's callbackId for updating their token and secret.
    Do not call outside of /forwardTo/:user.
*/
exports.getTokenandSecret = function(newData, callback){
    User.findOne({username: newData.username}, function(e, o){
        if(e){
			callback(e);
		} else if(o == null){
			callback('user-not-found');
		} else {
		    callback(null, o.khan_callback_id);
		}
    });
}

/*
    Updates a users account. Do not call without password gating.
*/
exports.updateAccount = function(newData, callback){
	User.findOne({username: newData.user}, function(e, o){
		if(e){
			callback(e);
		} else if(o == null){
			callback('user-not-found');
		} else {
			if(newData.pass == ''){
				User.update({username: newData.user},{email: newData.email, name: newData.name}, function(err){
					if(err) callback(err);
					else callback(null, o);
				});
			} else {

				saltAndHash(newData.pass, function(hash){
					newData.pass = hash;
					User.update({username: newData.user},{email: newData.email, password: newData.pass, name: newData.name}, function(err){
						if(err) callback(err);
						else callback(null, o);
					});
				});
			}
		}
	});
}

/*
    Updates a users password. Used for resetting password via email.
    We should not touch.
*/
exports.updatePassword = function(email, newPass, callback){
	User.findOne({email: email}, function(e, o){
		if(e){
			callback(e, null);
		} else {
			saltAndHash(newPass, function(hash){
		        newPass = hash;
		        User.update({email: email},{password: newPass}, callback);
			});
		}
	});
}

/* account lookup methods */
exports.deleteAccount = function(u, callback){

	User.findOne({username: u}, function(err, usr){
		if(err){
			callback(err);
		} else {
			usr.remove();

            Project.remove({creator: u}, function(err, result){
                Cloned.remove({user: u}, function(err, result){
                    PublishedProject.remove({creator: u}, function(err, result){
                        callback(err, result);
                    });
                });
            });
		}
	})
}

exports.getAccountByEmail = function(email, callback){
	User.findOne({email: email}, function(e, o){
		callback(o);
	});
}

exports.validateResetLink = function(email, passHash, callback){
	User.findOne({email: email, password: passHash}, function(e, o){
		callback(o ? 'ok' : null);
	});
}

exports.getAllRecords = function(callback){
	User.find({}, function(err, users){
		if(e) callback(e);
		else callback(null, users);
	});
}

exports.delAllRecords = function(callback){
	User.remove({}, callback);
}

/* private encryption & validation methods */

var generateSalt = function()
{
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback)
{
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
}

var validatePassword = function(plainPass, hashedPass, callback)
{
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(null, hashedPass === validHash);
}
