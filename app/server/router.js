var crypto = require('crypto');

var CT = require('./modules/country-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');
var AWS = require('aws-sdk');
var UserAuthentication = require('./api/userAuthentication');

/*
 * Load the S3 information from the environment variables.
 */
var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

AWS.config.update({ accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY });

authenticate = function(session, res, req, from, callback) {
    console.log(from);
    if(session == undefined) {
        req.session.from = from;
        res.redirect('/');
    } else {
        AM.authenticate(session.username, session.session_id, function(e) {
            console.log('authenticated \n');
            if(e) {
                req.session.from = from;
                res.redirect('/');
            }else
                callback();
        });
    }
}

module.exports = function(app) {

// main login page //
    /*
        updates projects and such
    */
    //AM.updatePrereqsVideos();

	app.get('/', function(req, res){
	// check if the user's credentials are saved in a cookie //
		if (req.cookies.user == undefined || req.cookies.session_id == undefined){
			res.render('login', { title: 'Hello - Please Login To Your Account' });
		}	else{
	    // attempt automatic login //
			AM.autoLogin(req.cookies.user, req.cookies.session_id, function(err, o){
				if (o != null){
				    req.session.user = o;
                    //if their token and secret our outdated, make the user log in manually
				    if(err == 'must-reauthenticate'){
				    	res.render('login', { title: 'Hello - Please Login To Your Account' });
				    } else {
				        if(req.session.from)
				            res.redirect(req.session.from);
				        else
						    res.redirect('/myProjects');
				    }
				}	else{
					res.render('login', { title: 'Hello - Please Login To Your Account' });
				}
			});
		}
	});

	app.post('/', function(req, res){
		AM.manualLogin(req.param('user'), req.param('pass'), function(e, o){
			if (!o){
				res.send(e, 400);
			}	else{
			    req.session.user = o;
				if (req.param('remember-me') == 'true'){
					res.cookie('user', o.username, { maxAge: 900000 });
					res.cookie('session_id', o.session_id, { maxAge: 900000 });
				}
				//if their token and secret our outdated, send error that will tell
				//client side to force the user to reauthenticate
				if(e == 'must-reauthenticate'){
			    	res.send(o, 300);
			    } else if(e == 'server-error'){
			        console.log('router server-error');
			    	res.send(o, 500);
			    }
			    else {
					res.send(o, 200);
			    }
			}
		});
	});

// logged-in user account information page //

	app.get('/home', function(req, res) {
	    authenticate(req.session.user, res, req, '/home', function() {
            if (req.session.user == null){
            // if user is not logged-in redirect back to login page //
                res.redirect('/');
            }   else{
                AM.getUpdateInformation(req.session.user.username, function(o){
                    if(o) {
                        res.render('home', {
                            title : 'Control Panel',
                            udata : {'username': req.session.user.username, 'email': o.email, 'name': o.name}
                        });
                    }else {
                        res.render('home', {
                            title : 'Control Panel',
                            udata : req.session.user
                        });
                    }
                });
            }
	    });
	});

	app.post('/home', function(req, res){
	    authenticate(req.session.user, res, req, '/', function() {
            if (req.param('user') != undefined) {
                AM.updateAccount({
                    user 		: req.param('user'),
                    name 		: req.param('name'),
                    email 		: req.param('email'),
                    pass		: req.param('pass')
                }, function(e, o){
                    if (e){
                        res.send('error-updating-account', 400);
                    }	else{
                        req.session.user = o;
                    // update the user's login cookies if they exists //
                        if (req.cookies.user != undefined && req.cookies.pass != undefined){
                            res.cookie('user', o.username, { maxAge: 900000 });
                            res.cookie('session_id', o.session_id, { maxAge: 900000 });
                        }
                        res.send('ok', 200);
                    }
                });
            }	else if (req.param('logout') == 'true'){
                if(!req.session.user){
                    res.clearCookie('user');
                    res.clearCookie('session_id');
                    res.send('not ok', 200);
                }else {
                    AM.logout(req.session.user.username, req.session.user.session_id, function() {
                        res.clearCookie('user');
                        res.clearCookie('session_id');
                        req.session.destroy(function(e){ res.send('ok', 200); });
                    });
                }
            }
        });
	});

//actual content pages

	app.get('/myProjects', function(req, res){
	    authenticate(req.session.user, res, req, '/myProjects', function() {
	    	res.render('myProjects', {
				udata : req.session.user
	    	})
	    });
	});

	app.get('/allProjects', function(req, res){
	    authenticate(req.session.user, res, req, '/allProjects', function() {
	    	res.render('allProjects', {
				udata : req.session.user
	    	})
	    });


	});

	app.get('/createNewProject', function(req, res){
		 authenticate(req.session.user, res, req, '/createNewProject', function() {
	    	AM.createNewProject(req.session.user.username, function(err, proj){
	    		if(err){
	    			res.send('error!');
	    		} else {
	    			var url = '/editProject/' + proj._id;
	    			res.redirect(url);
	    		}
	    	})
	    });
	})

	app.get('/ajax/allProjects', function(req, res){
	    authenticate(req.session.user, res, req, '/ajax/allProjects', function() {
            AM.getAllProjects(req.session.user.username, function(err, projArray){
                if(err){
                    res.send("Error!" + err);
                } else {
                    res.send(projArray);
                }
            })
        });
	});

	app.get('/ajax/clonedProjects', function(req, res){
	    authenticate(req.session.user, res, req, '/ajax/clonedProjects', function() {
            AM.getClonesForUser(req.session.user.username, function(err, projArray){
                if(err){
                    res.send("Error!" + err);
                } else {
                    res.send(projArray);
                }
            })
        });
	});

    app.get('/ajax/cloneProject/:projectID', function(req, res){
	    authenticate(req.session.user, res, req, '/ajax/cloneProject/' + req.params.projectID, function() {
            AM.cloneProject({user: req.session.user.username, id: req.params.projectID}, function(err, o){
                if(err){
                    res.send("Error!" + err);
                } else {
                    res.send(200);
                }
            })
        });
	});

	app.get('/ajax/loadProjects/:projectID', function(req, res){
        authenticate(req.session.user, res, req, '/ajax/loadProjects/' + req.params.projectID, function() {
            AM.getProjectByID(req.params.projectID, req.session.user.username, function(err, proj){
                if(err){
                    //TODO (Sam): make this more informative
                    res.send("Error!" + err);
                } else {
                    res.send(proj);
                }
            })
		});
	})

	app.get('/ajax/loadClonedProject/:clonedID', function(req, res){
	    authenticate(req.session.user, res, req, '/ajax/loadClonedProject/' + req.params.clonedID, function() {
            AM.getClonedProjectByID(req.params.clonedID, req.session.user.username, function(err, c){
                if(err){
                    res.send("Error!" + err);
                } else {
                    res.send(c);
                }
            })
        });
	});

	//req.body should contain the params for updateClonedProject
	app.post('/ajax/saveClonedProject/:clonedID', function(req, res){
	    authenticate(req.session.user, res, req, '/ajax/saveClonedProject/' + req.params.clonedID, function() {
            AM.updateClonedProject(req.body, req.session.user.username, function(err, c){
                if(err){
                    res.send("Error!" + err);
                } else {
                    res.send("success");
                }
            })
        });
	});

	app.post('/ajax/updateUserInfo', function(req, res){
	    req.connection.setTimeout(10*1000*60, function(){res.send("Must reauthentiate")});
	    authenticate(req.session.user, res, req, '/ajax/updateUserInfo', function() {
	        AM.updateUserInfo(req.session.user.username, function(err) {
	            if(err)
	                res.send("Must reauthentiate");
	            else
	                res.send("success");
	        });
	    });
	});

	app.get('/ajax/allPrerequisites', function(req, res){
	    authenticate(req.session.user, res, req, '/ajax/allPrerequisites', function() {
            AM.getAllPrereqs(function(err, prereqs){
                    if(err){
                        //TODO (Sam): make this more informative
                        res.send("Error!" + err);
                    } else {
                        res.send(prereqs);
                    }
                })
		});
	});

	app.get('/ajax/userGenRecPrereqs', function(req, res){
	    authenticate(req.session.user, res, req, '/ajax/userGenRecPrereqs', function() {
            AM.getAllRecPrereqsForUser(req.session.user.username, function(err, p){
                if(err){
                    res.send("Error!" + err);
                } else {
                    res.send(p);
                }
            })
        });
	});

	app.get('/ajax/cloneGenRecPrereqs/:clonedID', function(req, res){
	    authenticate(req.session.user, res, req, '/ajax/cloneGenRecPrereqs/' +req.params.clonedID, function() {
            AM.getAllRecPrereqsForClone(req.params.clonedID, req.session.user.username, function(err, p){
                if(err){
                    console.log('error in /ajax/cloneGenRecPrereqs/:clonedID call');
                    res.send("Error!" + err);
                } else {
                    res.send(p);
                }
            })
        });
	});

	app.get('/ajax/allVideos', function(req, res){
	    authenticate(req.session.user, res, req, '/ajax/allVideos', function() {
		AM.getAllVideos(function(err, vids){
                if(err){
                    //TODO (Sam): make this more informative
                    res.send("Error!" + err);
                } else {
                    res.send(vids);
                }
            })
		});
	});

	app.post('/ajax/publishProject/:projectID', function(req, res){
	    authenticate(req.session.user, res, req, '/ajax/publishProject/'+req.params.projectID, function() {
	        if(req.body.prerequisites == undefined){
                req.body.prerequisites = [];
            }
		    AM.publishProject(req.params.projectID, req.session.user.username, req.body, function(err, vids){
                if(err){
                    //TODO (Sam): make this more informative
                    res.send("Error!" + err);
                } else {
                    res.send("success");
                }
            })
		});
	});

	app.post('/ajax/saveProject/:projectID', function(req, res){
        authenticate(req.session.user, res, req, '/ajax/saveProject/'+req.params.projectID, function() {
            if(req.body.prerequisites == undefined){
                req.body.prerequisites = [];
            }
            AM.updateProject(req.params.projectID, req.session.user.username, req.body, function(err){
                if(err){
                    //TODO (Sam): make this more informative?
                    res.send("Error!" + err);
                } else {
                    res.send("success");
                }
            })
		});
	});

// creating new accounts //

    var userauth;

    /*
        The page we direct a user to when we want them to
        authenticate. Gets a request token and for the user before
        rerouting them to '.../forwardedTo'. redirectURL should
        be where we want the user to go after authenticating
    */
    app.get('/authenticate', function(req, res){
        userauth= new UserAuthentication();
        if(req.session.user == null) {
            console.log('user is null');
            res.redirect('/');
        } else {
        userauth.getRequestToken("http://localhost:8080/updateInfo/"+req.session.user.username, function(url, callbackid) {
                AM.addCallbackId({khan_callback_id: callbackid, username: req.session.user.username}, function(e) {
                        if(e)
                            res.redirect('/');
                        else
                            res.redirect(url);
                    });
            });
        }
    });

    app.get('/updateInfo/:user', function(req, res){
        var user = req.params.user;
        res.render('updateInfo', {
				udata : user
	    	});
	});

    /*
        After authenticating with Khan, the user is automatically
        rerouted to this page which retrieves the tokens for them.
        This then redirects them to home.
    */
    app.get('/forwardedTo/:user', function(req, res){
        req.connection.setTimeout(180*1000);
        var user = req.params.user;
        //TODO(annie): let the user know their account is being created
        //Gets and sets a user's token and secret
        AM.getTokenandSecret({username: user}, function(e, callbackId) {
                if(e) {
                    res.redirect('/');
                } else{
                    // retrieves the users token and secrets

                    //if everything went well, login
                    userauth.retrieveTokens(callbackId, function(token, secret) {
                            //updates the users token and secrets
                            //AM.updateAuthentication() sets callbackId to null, so that users can't
                            //autologin by going to this url
                            AM.updateAuthentication({khan_token: token, khan_secret: secret, username: user}, function(e){
                                    if(e) {
                                        res.redirect('/');
                                    }else {
                                        //if everything went well, login
                                        AM.loginAfterAuthentication(user, function(err, o) {
                                                if(err) {
                                                    if(err == 'user-not-found') res.redirect('/');
                                                    console.log(err);
                                                    console.log('Oh no! We couldn\'t update your proficiencies!');
                                                } else {
                                                    req.session.user = o;
                                                    console.log('done');
                                                    res.redirect('/allProjects');
                                                }
                                            });
                                    }
                                });
                        });
                }
            });
    });

//creating a new account
	app.get('/signup', function(req, res) {
	    res.render('signup', {  title: 'Signup'});
	});

	app.post('/signup', function(req, res){
        AM.addNewAccount({
            name 	: req.param('name'),
            email 	: req.param('email'),
            user 	: req.param('user'),
            pass	: req.param('pass'),
        }, function(e, o){
            if (e){
                res.send(e, 400);
            }	else{
                req.session.user = o;
                res.send('ok', 200);
            }
        });
	});

// password reset //

	app.post('/lost-password', function(req, res){
	// look up the user's account via their email //
		AM.getAccountByEmail(req.param('email'), function(o){
			if (o){
				res.send('ok', 200);
				EM.dispatchResetPasswordLink(o, function(e, m){
				// this callback takes a moment to return //
				// should add an ajax loader to give user feedback //
					if (!e) {
					//	res.send('ok', 200);
					}	else{
						res.send('email-server-error', 400);
						for (k in e) console.log('error : ', k, e[k]);
					}
				});
			}	else{
				res.send('email-not-found', 400);
			}
		});
	});

	app.get('/reset-password', function(req, res) {
		var email = req.query["e"];
		var passH = req.query["p"];
		AM.validateResetLink(email, passH, function(e){
			if (e != 'ok'){
			    console.log(e);
				res.redirect('/');
			} else{
	// save the user's email in a session instead of sending to the client //
				req.session.reset = { email:email, passHash:passH };
				res.render('reset', { title : 'Reset Password' });
			}
		})
	});

	app.post('/reset-password', function(req, res) {
		var nPass = req.param('pass');
	// retrieve the user's email from the session to lookup their account and reset password //
		var email = req.session.reset.email;
	// destory the session immediately after retrieving the stored email //
		req.session.destroy();
		AM.updatePassword(email, nPass, function(e, o){
			if (o){
				res.send('ok', 200);
			}	else{
				res.send('unable to update password', 400);
			}
		})
	});

// view & delete accounts //

	app.post('/delete', function(req, res){
        authenticate(req.session.user, res, req, '/', function(){
            AM.deleteAccount(req.body.user, function(e, obj){
                if (!e){
                    res.clearCookie('user');
                    res.clearCookie('pass');
                    req.session.destroy(function(e){ res.send('ok', 200); });
                }   else{
                    res.send('record not found', 400);
                }
            });
        });
	});

	app.get('/editProject/:projectID', function(req, res){
	    authenticate(req.session.user, res, req, '/editProject/'+req.params.projectID, function() {
                AM.getProjectByID(req.params.projectID, req.session.user.username, function(err, proj){
                    if(err){
                        console.log(err);
                        res.render('404', {title: 'Project not found'});
                    } else if(proj == null) {
                        console.log('is null');
                        res.render('404', {title: 'Project not found'});
                    } else {
                        console.log(proj.title);
                        res.render('projectEditor', {projectID: req.params.projectID});
                    }
                })
	    });
	});

    app.get('/viewProject/:projectID', function(req, res){
        authenticate(req.session.user, res, req, '/viewProject/'+req.params.projectID, function() {
            AM.getClonedProjectByID(req.params.projectID, req.session.user.username, function(err, proj){
                if(err){
                    console.log(err);
                    res.render('404', {title: 'Project not found'});
                } else if(proj == null){
                    res.render('404', {title: 'Project not found'});
                } else {
                    console.log(proj.title);
                    res.render('projectViewer', {projectID: req.params.projectID});
                }
            })
    	});
    });

    //Requests for uploading content to s3
    app.get('/sign_s3', function(req, res){
	    var object_name = req.query.s3_object_name;
	    var mime_type = req.query.s3_object_type;
        console.log(req.query);

	    var now = new Date();
	    var expires = Math.ceil((now.getTime() + 1000)/1000); // 50 seconds from now
	    var amz_headers = "x-amz-acl:public-read";

        // var s3 = new AWS.S3();
        // s3.client.putObject({
        //   Bucket: S3_BUCKET,
        //   Key: object_name,
        //   Body: base64data
        // }).done(function (resp) {
        //   console.log('Successfully uploaded package.');
        // });
	    var put_request = "PUT\n\n"+mime_type+"\n"+expires+"\n"+amz_headers+"\n/"+S3_BUCKET+"/"+object_name;
	    console.log(object_name);
	    var signature = crypto.createHmac('sha1', AWS_SECRET_KEY).update(put_request).digest('base64');
	    signature = encodeURIComponent(signature.trim());

	    var url = 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+encodeURIComponent(object_name);

	    var credentials = {
	        signed_request: url+"?AWSAccessKeyId="+AWS_ACCESS_KEY+"&Expires="+expires+"&Signature="+signature,
	        url: url
	    };
	    res.write(JSON.stringify(credentials));
	    res.end();
	});

	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });

	/*app2.get('*',function(req,res){
        res.redirect('https://8080/'+req.url)
    })*/

};
