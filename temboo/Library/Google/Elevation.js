
var util = require("util");
var choreography = require("temboo/core/choreography");


/*
    GetLocationElevation
    Obtain elevation information for a path generated by a set of geo-coordinates.
*/


var GetLocationElevation = function(session) {
    /*
        Create a new instance of the GetLocationElevation Choreo. A TembooSession object, containing a valid
        set of Temboo credentials, must be supplied.
	*/
    var location = "/Library/Google/Elevation/GetLocationElevation"
    GetLocationElevation.super_.call(this, session, location);

    /*
    Define a callback that will be used to appropriately format the results of this Choreo.
    */
    var newResultSet = function(resultStream) {
        return new GetLocationElevationResultSet(resultStream);
    }

	/*
	Obtain a new InputSet object, used to specify the input values for an execution of this Choreo.
	*/
    this.newInputSet = function() {
        return new GetLocationElevationInputSet();
    }
    
	/*
	Execute this Choreo with the specified inputs, calling the specified callback upon success,
	and the specified errorCallback upon error.
	*/
    this.execute = function(inputs, callback, errorCallback) {
        this._execute(inputs, newResultSet, callback, errorCallback);
    }
}


/*
An InputSet with methods appropriate for specifying the inputs to the GetLocationElevation
Choreo. The InputSet object is used to specify input parameters when executing this Choreo.
*/

var GetLocationElevationInputSet = function() {
    GetLocationElevationInputSet.super_.call(this);
        /*
        Set the value of the Locations input for this Choreo. ((required, string) Enter the location(s) for which elevation data will be obtained.  Input formats: a single latitude/longitude coordinate pair; an array of coordinates separated by a |. A set of encoded coordinates.)
        */
        this.set_Locations = function(value) {
            this.setInput("Locations", value);
        }

        /*
        Set the value of the ResponseFormat input for this Choreo. ((optional, string) The format that response should be in. Can be set to xml or json. Defaults to json.)
        */
        this.set_ResponseFormat = function(value) {
            this.setInput("ResponseFormat", value);
        }

        /*
        Set the value of the Sensor input for this Choreo. ((optional, boolean) Indicates whether or not the directions request is from a device with a location sensor. Value must be either 1 or 0. Defaults to 0 (false).)
        */
        this.set_Sensor = function(value) {
            this.setInput("Sensor", value);
        }

}

/*
A ResultSet with methods tailored to the values returned by the GetLocationElevation Choreo.
The ResultSet object is used to retrieve the results of a Choreo execution.
*/

var GetLocationElevationResultSet = function(resultStream) {
    GetLocationElevationResultSet.super_.call(this, resultStream);    
        /*
        Retrieve the value for the "Response" output from this Choreo execution. ((xml) The response from Google.)
        */
        this.get_Response = function() {
            return this.getResult("Response");
        }
}

util.inherits(GetLocationElevation, choreography.Choreography);
util.inherits(GetLocationElevationInputSet, choreography.InputSet);
util.inherits(GetLocationElevationResultSet, choreography.ResultSet);
exports.GetLocationElevation = GetLocationElevation;


/*
    GetPathElevation
    Obtain elevation information for a path specified by a set of  geo-coordinates.
*/


var GetPathElevation = function(session) {
    /*
        Create a new instance of the GetPathElevation Choreo. A TembooSession object, containing a valid
        set of Temboo credentials, must be supplied.
	*/
    var location = "/Library/Google/Elevation/GetPathElevation"
    GetPathElevation.super_.call(this, session, location);

    /*
    Define a callback that will be used to appropriately format the results of this Choreo.
    */
    var newResultSet = function(resultStream) {
        return new GetPathElevationResultSet(resultStream);
    }

	/*
	Obtain a new InputSet object, used to specify the input values for an execution of this Choreo.
	*/
    this.newInputSet = function() {
        return new GetPathElevationInputSet();
    }
    
	/*
	Execute this Choreo with the specified inputs, calling the specified callback upon success,
	and the specified errorCallback upon error.
	*/
    this.execute = function(inputs, callback, errorCallback) {
        this._execute(inputs, newResultSet, callback, errorCallback);
    }
}


/*
An InputSet with methods appropriate for specifying the inputs to the GetPathElevation
Choreo. The InputSet object is used to specify input parameters when executing this Choreo.
*/

var GetPathElevationInputSet = function() {
    GetPathElevationInputSet.super_.call(this);
        /*
        Set the value of the Path input for this Choreo. ((required, string) Specify the path for which elevation data will be obtained.  Input formats: an array of two or more lat/longitude coordinate pairs; A set of encoded coordinates using the Encoded Polyline Algorithm.)
        */
        this.set_Path = function(value) {
            this.setInput("Path", value);
        }

        /*
        Set the value of the ResponseFormat input for this Choreo. ((optional, string) The format that response should be in. Can be set to xml or json. Defaults to json.)
        */
        this.set_ResponseFormat = function(value) {
            this.setInput("ResponseFormat", value);
        }

        /*
        Set the value of the Samples input for this Choreo. ((required, integer) Enter the number of sample points.  See API docs for additional information.)
        */
        this.set_Samples = function(value) {
            this.setInput("Samples", value);
        }

        /*
        Set the value of the Sensor input for this Choreo. ((optional, boolean) Indicates whether or not the directions request is from a device with a location sensor. Value must be either 1 or 0. Defaults to 0 (false).)
        */
        this.set_Sensor = function(value) {
            this.setInput("Sensor", value);
        }

}

/*
A ResultSet with methods tailored to the values returned by the GetPathElevation Choreo.
The ResultSet object is used to retrieve the results of a Choreo execution.
*/

var GetPathElevationResultSet = function(resultStream) {
    GetPathElevationResultSet.super_.call(this, resultStream);    
        /*
        Retrieve the value for the "Response" output from this Choreo execution. ((xml) The response from Google.)
        */
        this.get_Response = function() {
            return this.getResult("Response");
        }
}

util.inherits(GetPathElevation, choreography.Choreography);
util.inherits(GetPathElevationInputSet, choreography.InputSet);
util.inherits(GetPathElevationResultSet, choreography.ResultSet);
exports.GetPathElevation = GetPathElevation;

