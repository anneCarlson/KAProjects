
var util = require("util");
var choreography = require("temboo/core/choreography");


/*
    GetMonitoredTwitterHandle
     Retrieves detailed information on a specified monitored Twitter account. 
*/


var GetMonitoredTwitterHandle = function(session) {
    /*
        Create a new instance of the GetMonitoredTwitterHandle Choreo. A TembooSession object, containing a valid
        set of Temboo credentials, must be supplied.
	*/
    var location = "/Library/Zendesk/MonitoredTwitterHandles/GetMonitoredTwitterHandle"
    GetMonitoredTwitterHandle.super_.call(this, session, location);

    /*
    Define a callback that will be used to appropriately format the results of this Choreo.
    */
    var newResultSet = function(resultStream) {
        return new GetMonitoredTwitterHandleResultSet(resultStream);
    }

	/*
	Obtain a new InputSet object, used to specify the input values for an execution of this Choreo.
	*/
    this.newInputSet = function() {
        return new GetMonitoredTwitterHandleInputSet();
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
An InputSet with methods appropriate for specifying the inputs to the GetMonitoredTwitterHandle
Choreo. The InputSet object is used to specify input parameters when executing this Choreo.
*/

var GetMonitoredTwitterHandleInputSet = function() {
    GetMonitoredTwitterHandleInputSet.super_.call(this);
        /*
        Set the value of the Email input for this Choreo. ((required, string) The email address you use to login to your Zendesk account.)
        */
        this.set_Email = function(value) {
            this.setInput("Email", value);
        }

        /*
        Set the value of the ID input for this Choreo. ((required, string) ID of the monitored Twitter handle.)
        */
        this.set_ID = function(value) {
            this.setInput("ID", value);
        }

        /*
        Set the value of the Password input for this Choreo. ((required, password) Your Zendesk password.)
        */
        this.set_Password = function(value) {
            this.setInput("Password", value);
        }

        /*
        Set the value of the Server input for this Choreo. ((required, string) Your Zendesk domain and subdomain (e.g., temboocare.zendesk.com).)
        */
        this.set_Server = function(value) {
            this.setInput("Server", value);
        }

}

/*
A ResultSet with methods tailored to the values returned by the GetMonitoredTwitterHandle Choreo.
The ResultSet object is used to retrieve the results of a Choreo execution.
*/

var GetMonitoredTwitterHandleResultSet = function(resultStream) {
    GetMonitoredTwitterHandleResultSet.super_.call(this, resultStream);    
        /*
        Retrieve the value for the "Response" output from this Choreo execution. ((json) The response from Zendesk.)
        */
        this.get_Response = function() {
            return this.getResult("Response");
        }
}

util.inherits(GetMonitoredTwitterHandle, choreography.Choreography);
util.inherits(GetMonitoredTwitterHandleInputSet, choreography.InputSet);
util.inherits(GetMonitoredTwitterHandleResultSet, choreography.ResultSet);
exports.GetMonitoredTwitterHandle = GetMonitoredTwitterHandle;


/*
    ListMonitoredTwitterHandles
    Retrieves a list of monitored Twitter accounts that you have configured in your Zendesk account.  
*/


var ListMonitoredTwitterHandles = function(session) {
    /*
        Create a new instance of the ListMonitoredTwitterHandles Choreo. A TembooSession object, containing a valid
        set of Temboo credentials, must be supplied.
	*/
    var location = "/Library/Zendesk/MonitoredTwitterHandles/ListMonitoredTwitterHandles"
    ListMonitoredTwitterHandles.super_.call(this, session, location);

    /*
    Define a callback that will be used to appropriately format the results of this Choreo.
    */
    var newResultSet = function(resultStream) {
        return new ListMonitoredTwitterHandlesResultSet(resultStream);
    }

	/*
	Obtain a new InputSet object, used to specify the input values for an execution of this Choreo.
	*/
    this.newInputSet = function() {
        return new ListMonitoredTwitterHandlesInputSet();
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
An InputSet with methods appropriate for specifying the inputs to the ListMonitoredTwitterHandles
Choreo. The InputSet object is used to specify input parameters when executing this Choreo.
*/

var ListMonitoredTwitterHandlesInputSet = function() {
    ListMonitoredTwitterHandlesInputSet.super_.call(this);
        /*
        Set the value of the Email input for this Choreo. ((required, string) The email address you use to login to your Zendesk account.)
        */
        this.set_Email = function(value) {
            this.setInput("Email", value);
        }

        /*
        Set the value of the Page input for this Choreo. ((optional, integer) The page number of the results to be returned. Used together with the PerPage parameter to paginate a large set of results.)
        */
        this.set_Page = function(value) {
            this.setInput("Page", value);
        }

        /*
        Set the value of the Password input for this Choreo. ((required, password) Your Zendesk password.)
        */
        this.set_Password = function(value) {
            this.setInput("Password", value);
        }

        /*
        Set the value of the PerPage input for this Choreo. ((optional, integer) The number of results to return per page. Maximum is 100 and default is 100.)
        */
        this.set_PerPage = function(value) {
            this.setInput("PerPage", value);
        }

        /*
        Set the value of the Server input for this Choreo. ((required, string) Your Zendesk domain and subdomain (e.g., temboocare.zendesk.com).)
        */
        this.set_Server = function(value) {
            this.setInput("Server", value);
        }

}

/*
A ResultSet with methods tailored to the values returned by the ListMonitoredTwitterHandles Choreo.
The ResultSet object is used to retrieve the results of a Choreo execution.
*/

var ListMonitoredTwitterHandlesResultSet = function(resultStream) {
    ListMonitoredTwitterHandlesResultSet.super_.call(this, resultStream);    
        /*
        Retrieve the value for the "NextPage" output from this Choreo execution. ((integer) The index for the next page of results.)
        */
        this.get_NextPage = function() {
            return this.getResult("NextPage");
        }
        /*
        Retrieve the value for the "Response" output from this Choreo execution. ((json) The response from Zendesk.)
        */
        this.get_Response = function() {
            return this.getResult("Response");
        }
        /*
        Retrieve the value for the "PreviousPage" output from this Choreo execution. ((integer) The index for the previous page of results.)
        */
        this.get_PreviousPage = function() {
            return this.getResult("PreviousPage");
        }
}

util.inherits(ListMonitoredTwitterHandles, choreography.Choreography);
util.inherits(ListMonitoredTwitterHandlesInputSet, choreography.InputSet);
util.inherits(ListMonitoredTwitterHandlesResultSet, choreography.ResultSet);
exports.ListMonitoredTwitterHandles = ListMonitoredTwitterHandles;

