if (process.env.NEW_RELIC_LICENSE_KEY) { 
    var newrelic = require('newrelic') 
}
var express = require('express');
var http = require('http');
var request = require('request');
var path = require('path');
var fs = require('fs');
//cfenv provides access to your Cloud Foundry environment
//for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
var bodyParser = require('body-parser');
var router = express.Router();

//all environments
var app = express();
app.set('port', process.env.PORT || 3001);
app.set('json spaces', 2);
app.use(bodyParser.json());
app.use(router);
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.VCAP_SERVICES) {
	// Running on Bluemix. Parse for  the port and host that we've been assigned.
        var agent = require('bluemix-autoscaling-agent');
	var env = JSON.parse(process.env.VCAP_SERVICES);
	var host = process.env.VCAP_APP_HOST;
	var port = process.env.VCAP_APP_PORT;

	console.log('VCAP_SERVICES: %s', process.env.VCAP_SERVICES);
}

//route to inventory rest controller
var restServices = require('./routes/itemservices.js');
restServices(app, request);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
