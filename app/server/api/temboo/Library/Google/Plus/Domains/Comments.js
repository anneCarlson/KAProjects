
var util = require("util");
var choreography = require("temboo/core/choreography");


/*
    Get
    Retrieves the specified comment.
*/


var Get = function(session) {
    /*
        Create a new instance of the Get Choreo. A TembooSession object, containing a valid
        set of Temboo credentials, must be supplied.
	*/
    var location = "/Library/Google/Plus/Domains/Comments/Get"
    Get.super_.call(this, session, location);

    /*
    Define a callback that will be used to appropriately format the results of this Choreo.
    */
    var newResultSet = function(resultStream) {
        return new GetResultSet(resultStream);
    }

	/*
	Obtain a new InputSet object, used to specify the input values for an execution of this Choreo.
	*/
    this.newInputSet = function() {
        return new GetInputSet();
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
An InputSet with methods appropriate for specifying the inputs to the Get
Choreo. The InputSet object is used to specify input parameters when executing this Choreo.
*/

var GetInputSet = function() {
    GetInputSet.super_.call(this);
        /*
        Set the value of the AccessToken input for this Choreo. ((optional, string) A valid access token retrieved during the OAuth process. This is required unless you provide the ClientID, ClientSecret, and RefreshToken to generate a new access token.)
        */
        this.set_AccessToken = function(value) {
            this.setInput("AccessToken", value);
        }

        /*
        Set the value of the Callback input for this Choreo. ((optional, string) Specifies a JavaScript function that will be passed the response data for using the API with JSONP.)
        */
        this.set_Callback = function(value) {
            this.setInput("Callback", value);
        }

        /*
        Set the value of the ClientID input for this Choreo. ((conditional, string) The Client ID provided by Google. Required unless providing a valid AccessToken.)
        */
        this.set_ClientID = function(value) {
            this.setInput("ClientID", value);
        }

        /*
        Set the value of the ClientSecret input for this Choreo. ((conditional, string) The Client Secret provided by Google. Required unless providing a valid AccessToken.)
        */
        this.set_ClientSecret = function(value) {
            this.setInput("ClientSecret", value);
        }

        /*
        Set the value of the CommentID input for this Choreo. ((required, string) The ID of the comment to get.)
        */
        this.set_CommentID = function(value) {
            this.setInput("CommentID", value);
        }

        /*
        Set the value of the Fields input for this Choreo. ((optional, string) Used to specify fields to include in a partial response. This can be used to reduce the amount of data returned. See documentation for syntax rules.)
        */
        this.set_Fields = function(value) {
            this.setInput("Fields", value);
        }

        /*
        Set the value of the PrettyPrint input for this Choreo. ((optional, boolean) A flag used to pretty print the JSON response to make it more readable. Defaults to "true".)
        */
        this.set_PrettyPrint = function(value) {
            this.setInput("PrettyPrint", value);
        }

        /*
        Set the value of the RefreshToken input for this Choreo. ((conditional, string) An OAuth Refresh Token used to generate a new access token when the original token is expired. Required unless providing a valid AccessToken.)
        */
        this.set_RefreshToken = function(value) {
            this.setInput("RefreshToken", value);
        }

        /*
        Set the value of the UserIP input for this Choreo. ((optional, string) Identifies the IP address of the end user for whom the API call is being made. Used to enforce per-user quotas.)
        */
        this.set_UserIP = function(value) {
            this.setInput("UserIP", value);
        }

}

/*
A ResultSet with methods tailored to the values returned by the Get Choreo.
The ResultSet object is used to retrieve the results of a Choreo execution.
*/

var GetResultSet = function(resultStream) {
    GetResultSet.super_.call(this, resultStream);    
        /*
        Retrieve the value for the "NewAccessToken" output from this Choreo execution. ((string) Contains a new AccessToken when the RefreshToken is provided.)
        */
        this.get_NewAccessToken = function() {
            return this.getResult("NewAccessToken");
        }
        /*
        Retrieve the value for the "Response" output from this Choreo execution. ((json) The response from Google.)
        */
        this.get_Response = function() {
            return this.getResult("Response");
        }
}

util.inherits(Get, choreography.Choreography);
util.inherits(GetInputSet, choreography.InputSet);
util.inherits(GetResultSet, choreography.ResultSet);
exports.Get = Get;


/*
    Insert
    Creates a new comment in reply to an activity.
*/


var Insert = function(session) {
    /*
        Create a new instance of the Insert Choreo. A TembooSession object, containing a valid
        set of Temboo credentials, must be supplied.
	*/
    var location = "/Library/Google/Plus/Domains/Comments/Insert"
    Insert.super_.call(this, session, location);

    /*
    Define a callback that will be used to appropriately format the results of this Choreo.
    */
    var newResultSet = function(resultStream) {
        return new InsertResultSet(resultStream);
    }

	/*
	Obtain a new InputSet object, used to specify the input values for an execution of this Choreo.
	*/
    this.newInputSet = function() {
        return new InsertInputSet();
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
An InputSet with methods appropriate for specifying the inputs to the Insert
Choreo. The InputSet object is used to specify input parameters when executing this Choreo.
*/

var InsertInputSet = function() {
    InsertInputSet.super_.call(this);
        /*
        Set the value of the CommentResource input for this Choreo. ((optional, string) A JSON-formatted string containing the comment properties you wish to set. This can be used as an alternative to setting individual inputs representing resource properties.)
        */
        this.set_CommentResource = function(value) {
            this.setInput("CommentResource", value);
        }

        /*
        Set the value of the AccessToken input for this Choreo. ((optional, string) A valid access token retrieved during the OAuth process. This is required unless you provide the ClientID, ClientSecret, and RefreshToken to generate a new access token.)
        */
        this.set_AccessToken = function(value) {
            this.setInput("AccessToken", value);
        }

        /*
        Set the value of the ActivityID input for this Choreo. ((required, string) The ID of the activity to reply to.)
        */
        this.set_ActivityID = function(value) {
            this.setInput("ActivityID", value);
        }

        /*
        Set the value of the Callback input for this Choreo. ((optional, string) Specifies a JavaScript function that will be passed the response data for using the API with JSONP.)
        */
        this.set_Callback = function(value) {
            this.setInput("Callback", value);
        }

        /*
        Set the value of the ClientID input for this Choreo. ((conditional, string) The Client ID provided by Google. Required unless providing a valid AccessToken.)
        */
        this.set_ClientID = function(value) {
            this.setInput("ClientID", value);
        }

        /*
        Set the value of the ClientSecret input for this Choreo. ((conditional, string) The Client Secret provided by Google. Required unless providing a valid AccessToken.)
        */
        this.set_ClientSecret = function(value) {
            this.setInput("ClientSecret", value);
        }

        /*
        Set the value of the Content input for this Choreo. ((required, string) The comment text.)
        */
        this.set_Content = function(value) {
            this.setInput("Content", value);
        }

        /*
        Set the value of the Description input for this Choreo. ((optional, string) A description for the new circle being created.)
        */
        this.set_Description = function(value) {
            this.setInput("Description", value);
        }

        /*
        Set the value of the Fields input for this Choreo. ((optional, string) Used to specify fields to include in a partial response. This can be used to reduce the amount of data returned. See documentation for syntax rules.)
        */
        this.set_Fields = function(value) {
            this.setInput("Fields", value);
        }

        /*
        Set the value of the PrettyPrint input for this Choreo. ((optional, boolean) A flag used to pretty print the JSON response to make it more readable. Defaults to "true".)
        */
        this.set_PrettyPrint = function(value) {
            this.setInput("PrettyPrint", value);
        }

        /*
        Set the value of the RefreshToken input for this Choreo. ((conditional, string) An OAuth Refresh Token used to generate a new access token when the original token is expired. Required unless providing a valid AccessToken.)
        */
        this.set_RefreshToken = function(value) {
            this.setInput("RefreshToken", value);
        }

        /*
        Set the value of the UserID input for this Choreo. ((optional, string) The ID of the user to create a circle for. The value "me" is set as the default to indicate the authenticated user.)
        */
        this.set_UserID = function(value) {
            this.setInput("UserID", value);
        }

        /*
        Set the value of the UserIP input for this Choreo. ((optional, string) Identifies the IP address of the end user for whom the API call is being made. Used to enforce per-user quotas.)
        */
        this.set_UserIP = function(value) {
            this.setInput("UserIP", value);
        }

}

/*
A ResultSet with methods tailored to the values returned by the Insert Choreo.
The ResultSet object is used to retrieve the results of a Choreo execution.
*/

var InsertResultSet = function(resultStream) {
    InsertResultSet.super_.call(this, resultStream);    
        /*
        Retrieve the value for the "NewAccessToken" output from this Choreo execution. ((string) Contains a new AccessToken when the RefreshToken is provided.)
        */
        this.get_NewAccessToken = function() {
            return this.getResult("NewAccessToken");
        }
        /*
        Retrieve the value for the "Response" output from this Choreo execution. ((json) The response from Google.)
        */
        this.get_Response = function() {
            return this.getResult("Response");
        }
}

util.inherits(Insert, choreography.Choreography);
util.inherits(InsertInputSet, choreography.InputSet);
util.inherits(InsertResultSet, choreography.ResultSet);
exports.Insert = Insert;


/*
    List
    Lists all of the comments for an activity.
*/


var List = function(session) {
    /*
        Create a new instance of the List Choreo. A TembooSession object, containing a valid
        set of Temboo credentials, must be supplied.
	*/
    var location = "/Library/Google/Plus/Domains/Comments/List"
    List.super_.call(this, session, location);

    /*
    Define a callback that will be used to appropriately format the results of this Choreo.
    */
    var newResultSet = function(resultStream) {
        return new ListResultSet(resultStream);
    }

	/*
	Obtain a new InputSet object, used to specify the input values for an execution of this Choreo.
	*/
    this.newInputSet = function() {
        return new ListInputSet();
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
An InputSet with methods appropriate for specifying the inputs to the List
Choreo. The InputSet object is used to specify input parameters when executing this Choreo.
*/

var ListInputSet = function() {
    ListInputSet.super_.call(this);
        /*
        Set the value of the AccessToken input for this Choreo. ((optional, string) A valid access token retrieved during the OAuth process. This is required unless you provide the ClientID, ClientSecret, and RefreshToken to generate a new access token.)
        */
        this.set_AccessToken = function(value) {
            this.setInput("AccessToken", value);
        }

        /*
        Set the value of the ActivityID input for this Choreo. ((required, string) ID of the activity to retrieve comments for.)
        */
        this.set_ActivityID = function(value) {
            this.setInput("ActivityID", value);
        }

        /*
        Set the value of the Callback input for this Choreo. ((optional, string) Specifies a JavaScript function that will be passed the response data for using the API with JSONP.)
        */
        this.set_Callback = function(value) {
            this.setInput("Callback", value);
        }

        /*
        Set the value of the ClientID input for this Choreo. ((conditional, string) The Client ID provided by Google. Required unless providing a valid AccessToken.)
        */
        this.set_ClientID = function(value) {
            this.setInput("ClientID", value);
        }

        /*
        Set the value of the ClientSecret input for this Choreo. ((conditional, string) The Client Secret provided by Google. Required unless providing a valid AccessToken.)
        */
        this.set_ClientSecret = function(value) {
            this.setInput("ClientSecret", value);
        }

        /*
        Set the value of the Fields input for this Choreo. ((optional, string) Used to specify fields to include in a partial response. This can be used to reduce the amount of data returned. See documentation for syntax rules.)
        */
        this.set_Fields = function(value) {
            this.setInput("Fields", value);
        }

        /*
        Set the value of the MaxResults input for this Choreo. ((optional, integer) The maximum number of circles to include in the response. Used for paging through results. Valid values are: 1 to 20. Default is 10.)
        */
        this.set_MaxResults = function(value) {
            this.setInput("MaxResults", value);
        }

        /*
        Set the value of the OrderBy input for this Choreo. ((optional, string) The order to return results in. Valid values are: alphabetical and best.)
        */
        this.set_OrderBy = function(value) {
            this.setInput("OrderBy", value);
        }

        /*
        Set the value of the PageToken input for this Choreo. ((optional, string) The "NextPageToken" returned in the Choreo output. Used to page through large result sets.)
        */
        this.set_PageToken = function(value) {
            this.setInput("PageToken", value);
        }

        /*
        Set the value of the PrettyPrint input for this Choreo. ((optional, boolean) A flag used to pretty print the JSON response to make it more readable. Defaults to "true".)
        */
        this.set_PrettyPrint = function(value) {
            this.setInput("PrettyPrint", value);
        }

        /*
        Set the value of the RefreshToken input for this Choreo. ((conditional, string) An OAuth Refresh Token used to generate a new access token when the original token is expired. Required unless providing a valid AccessToken.)
        */
        this.set_RefreshToken = function(value) {
            this.setInput("RefreshToken", value);
        }

        /*
        Set the value of the UserID input for this Choreo. ((optional, string) The ID of the user to get circles for. The value "me" is set as the default to indicate the authenticated user.)
        */
        this.set_UserID = function(value) {
            this.setInput("UserID", value);
        }

        /*
        Set the value of the UserIP input for this Choreo. ((optional, string) Identifies the IP address of the end user for whom the API call is being made. Used to enforce per-user quotas.)
        */
        this.set_UserIP = function(value) {
            this.setInput("UserIP", value);
        }

}

/*
A ResultSet with methods tailored to the values returned by the List Choreo.
The ResultSet object is used to retrieve the results of a Choreo execution.
*/

var ListResultSet = function(resultStream) {
    ListResultSet.super_.call(this, resultStream);    
        /*
        Retrieve the value for the "NewAccessToken" output from this Choreo execution. ((string) Contains a new AccessToken when the RefreshToken is provided.)
        */
        this.get_NewAccessToken = function() {
            return this.getResult("NewAccessToken");
        }
        /*
        Retrieve the value for the "Response" output from this Choreo execution. ((json) The response from Google.)
        */
        this.get_Response = function() {
            return this.getResult("Response");
        }
}

util.inherits(List, choreography.Choreography);
util.inherits(ListInputSet, choreography.InputSet);
util.inherits(ListResultSet, choreography.ResultSet);
exports.List = List;

