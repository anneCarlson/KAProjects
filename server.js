var express = require('express');
var app = express();

app.get('/fonts/*', function (request, response) {
    response.sendfile(__dirname+'/perseus/fonts/'+request.params[0]);
});

app.get('/*', function (request, response) {
    response.sendfile(__dirname+'/'+request.params[0]);
});

app.listen(8080);