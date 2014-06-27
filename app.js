
/**
	* Node.js Login Boilerplate
	* More Info : http://bit.ly/LsODY8
	* Copyright (c) 2013 Stephen Braitsch
**/

var express = require('express');
var http = require('http');
var https = require('https');
var pem = require('pem');

var app = express();
var app2 = express();
var engines = require('consolidate');
pem.createCertificate({days:1, selfSigned:true}, function(err, keys){
    /*app.configure(function(){
        app.set('port', 8000);
        app.set('views', __dirname + '/app/server/views');
        app.set('view engine', 'jade');
        app.locals.pretty = true;
    //	app.use(express.favicon());
    //	app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.cookieParser());
        app.use(express.session({ secret: 'super-duper-secret-secret' }));
        app.use(express.methodOverride());
        app.use(require('stylus').middleware({ src: __dirname + '/app/public' }));
        app.use(express.static(__dirname + '/app/public'));
        app.engine('html', engines.hogan);
    });*/
    app2.configure(function(){
        app2.set('port', 8080);
        app2.set('views', __dirname + '/app/server/views');
        app2.set('view engine', 'jade');
        app2.locals.pretty = true;
    //	app.use(express.favicon());
    //	app.use(express.logger('dev'));
        app2.use(express.bodyParser());
        app2.use(express.cookieParser());
        app2.use(express.session({ secret: 'super-duper-secret-secret' }));
        app2.use(express.methodOverride());
        app2.use(require('stylus').middleware({ src: __dirname + '/app/public' }));
        app2.use(express.static(__dirname + '/app/public'));
        app2.engine('html', engines.hogan);
    });

    /*app.configure('development', function(){
        app.use(express.errorHandler());
    });*/

    app2.configure('development', function(){
        app2.use(express.errorHandler());
    });

    //var http;
    require('./app/server/router')(app2);
    //require('./app/server/router')(app2);

    /*https.createServer({key: keys.serviceKey, cert: keys.certificate}, app).listen(
        app.get('port'), function(){
            console.log("Express server listening on port " + app.get('port'));
    });*/

    //http = express.createServer().listen(8080);
    http.createServer(app2).listen(
        app2.get('port'), function(){
            console.log("Express server listening on port " + app2.get('port'));
    });
});
