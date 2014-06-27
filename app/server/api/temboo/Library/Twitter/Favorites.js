
var util = require("util");
var choreography = require("temboo/core/choreography");


/*
    CreateFavorite
    Marks a specified status as a favorite.
*/


var CreateFavorite = function(session) {
    /*
        Create a new instance of the CreateFavorite Choreo. A TembooSession object, containing a valid
        set of Temboo credentials, must be supplied.
	*/
    var location = "/Library/Twitter/Favorites/CreateFavorite"
    CreateFavorite.super_.call(this, session, location);

    /*
    Define a callback that will be used to appropriately format the results of this Choreo.
    */
    var newResultSet = function(resultStream) {
        return new CreateFavoriteResultSet(resultStream);
    }

	/*
	Obtain a new InputSet object, used to specify the input values for an execution of this Choreo.
	*/
    this.newInputSet = function() {
        return new CreateFavoriteInputSet();
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
An InputSet with methods appropriate for specifying the inputs to the CreateFavorite
Choreo. The InputSet object is used to specify input parameters when executing this Choreo.
*/

var CreateFavoriteInputSet = function() {
    CreateFavoriteInputSet.super_.call(this);
        /*
        Set the value of the AccessTokenSecret input for this Choreo. ((required, string) The Access Token Secret provided by Twitter or retrieved during the OAuth process.)
        */
        this.set_AccessTokenSecret = function(value) {
            this.setInput("AccessTokenSecret", value);
        }

        /*
        Set the value of the AccessToken input for this Choreo. ((required, string) The Access Token provided by Twitter or retrieved during the OAuth process.)
        */
        this.set_AccessToken = function(value) {
            this.setInput("AccessToken", value);
        }

        /*
        Set the value of the ConsumerKey input for this Choreo. ((required, string) The Consumer Key provided by Twitter.)
        */
        this.set_ConsumerKey = function(value) {
            this.setInput("ConsumerKey", value);
        }

        /*
        Set the value of the ConsumerSecret input for this Choreo. ((required, string) The Consumer Secret provided by Twitter.)
        */
        this.set_ConsumerSecret = function(value) {
            this.setInput("ConsumerSecret", value);
        }

        /*
        Set the value of the ID input for this Choreo. ((required, string) The ID of the status to favorite.)
        */
        this.set_ID = function(value) {
            this.setInput("ID", value);
        }

        /*
        Set the value of the IncludeEntities input for this Choreo. ((optional, boolean) The "entities" node containing extra metadata will not be included when set to false.)
        */
        this.set_IncludeEntities = function(value) {
            this.setInput("IncludeEntities", value);
        }

}

/*
A ResultSet with methods tailored to the values returned by the CreateFavorite Choreo.
The ResultSet object is used to retrieve the results of a Choreo execution.
*/

var CreateFavoriteResultSet = function(resultStream) {
    CreateFavoriteResultSet.super_.call(this, resultStream);    
        /*
        Retrieve the value for the "Response" output from this Choreo execution. ((json) The response from Twitter.)
        */
        this.get_Response = function() {
            return this.getResult("Response");
        }
}

util.inherits(CreateFavorite, choreography.Choreography);
util.inherits(CreateFavoriteInputSet, choreography.InputSet);
util.inherits(CreateFavoriteResultSet, choreography.ResultSet);
exports.CreateFavorite = CreateFavorite;


/*
    DestroyFavorite
    Removes the specified status from a favorites list.
*/


var DestroyFavorite = function(session) {
    /*
        Create a new instance of the DestroyFavorite Choreo. A TembooSession object, containing a valid
        set of Temboo credentials, must be supplied.
	*/
    var location = "/Library/Twitter/Favorites/DestroyFavorite"
    DestroyFavorite.super_.call(this, session, location);

    /*
    Define a callback that will be used to appropriately format the results of this Choreo.
    */
    var newResultSet = function(resultStream) {
        return new DestroyFavoriteResultSet(resultStream);
    }

	/*
	Obtain a new InputSet object, used to specify the input values for an execution of this Choreo.
	*/
    this.newInputSet = function() {
        return new DestroyFavoriteInputSet();
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
An InputSet with methods appropriate for specifying the inputs to the DestroyFavorite
Choreo. The InputSet object is used to specify input parameters when executing this Choreo.
*/

var DestroyFavoriteInputSet = function() {
    DestroyFavoriteInputSet.super_.call(this);
        /*
        Set the value of the AccessTokenSecret input for this Choreo. ((required, string) The Access Token Secret provided by Twitter or retrieved during the OAuth process.)
        */
        this.set_AccessTokenSecret = function(value) {
            this.setInput("AccessTokenSecret", value);
        }

        /*
        Set the value of the AccessToken input for this Choreo. ((required, string) The Access Token provided by Twitter or retrieved during the OAuth process.)
        */
        this.set_AccessToken = function(value) {
            this.setInput("AccessToken", value);
        }

        /*
        Set the value of the ConsumerKey input for this Choreo. ((required, string) The Consumer Key provided by Twitter.)
        */
        this.set_ConsumerKey = function(value) {
            this.setInput("ConsumerKey", value);
        }

        /*
        Set the value of the ConsumerSecret input for this Choreo. ((required, string) The Consumer Secret provided by Twitter.)
        */
        this.set_ConsumerSecret = function(value) {
            this.setInput("ConsumerSecret", value);
        }

        /*
        Set the value of the ID input for this Choreo. ((required, string) The ID of the status to remove from your favorites.)
        */
        this.set_ID = function(value) {
            this.setInput("ID", value);
        }

        /*
        Set the value of the IncludeEntities input for this Choreo. ((optional, boolean) The "entities" node containing extra metadata will not be included when set to false.)
        */
        this.set_IncludeEntities = function(value) {
            this.setInput("IncludeEntities", value);
        }

}

/*
A ResultSet with methods tailored to the values returned by the DestroyFavorite Choreo.
The ResultSet object is used to retrieve the results of a Choreo execution.
*/

var DestroyFavoriteResultSet = function(resultStream) {
    DestroyFavoriteResultSet.super_.call(this, resultStream);    
        /*
        Retrieve the value for the "Response" output from this Choreo execution. ((json) The response from Twitter.)
        */
        this.get_Response = function() {
            return this.getResult("Response");
        }
}

util.inherits(DestroyFavorite, choreography.Choreography);
util.inherits(DestroyFavoriteInputSet, choreography.InputSet);
util.inherits(DestroyFavoriteResultSet, choreography.ResultSet);
exports.DestroyFavorite = DestroyFavorite;


/*
    ListFavorites
    Retrieves the 20 most recent Tweets favorited by the authenticating or specified user.
*/


var ListFavorites = function(session) {
    /*
        Create a new instance of the ListFavorites Choreo. A TembooSession object, containing a valid
        set of Temboo credentials, must be supplied.
	*/
    var location = "/Library/Twitter/Favorites/ListFavorites"
    ListFavorites.super_.call(this, session, location);

    /*
    Define a callback that will be used to appropriately format the results of this Choreo.
    */
    var newResultSet = function(resultStream) {
        return new ListFavoritesResultSet(resultStream);
    }

	/*
	Obtain a new InputSet object, used to specify the input values for an execution of this Choreo.
	*/
    this.newInputSet = function() {
        return new ListFavoritesInputSet();
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
An InputSet with methods appropriate for specifying the inputs to the ListFavorites
Choreo. The InputSet object is used to specify input parameters when executing this Choreo.
*/

var ListFavoritesInputSet = function() {
    ListFavoritesInputSet.super_.call(this);
        /*
        Set the value of the AccessTokenSecret input for this Choreo. ((required, string) The Access Token Secret provided by Twitter or retrieved during the OAuth process.)
        */
        this.set_AccessTokenSecret = function(value) {
            this.setInput("AccessTokenSecret", value);
        }

        /*
        Set the value of the AccessToken input for this Choreo. ((required, string) The Access Token provided by Twitter or retrieved during the OAuth process.)
        */
        this.set_AccessToken = function(value) {
            this.setInput("AccessToken", value);
        }

        /*
        Set the value of the ConsumerKey input for this Choreo. ((required, string) The Consumer Key provided by Twitter.)
        */
        this.set_ConsumerKey = function(value) {
            this.setInput("ConsumerKey", value);
        }

        /*
        Set the value of the ConsumerSecret input for this Choreo. ((required, string) The Consumer Secret provided by Twitter.)
        */
        this.set_ConsumerSecret = function(value) {
            this.setInput("ConsumerSecret", value);
        }

        /*
        Set the value of the Count input for this Choreo. ((optional, integer) Specifies the number of records to retrieve. Must be less than or equal to 200. Defaults to 20.)
        */
        this.set_Count = function(value) {
            this.setInput("Count", value);
        }

        /*
        Set the value of the IncludeEntities input for this Choreo. ((optional, boolean) The "entities" node containing extra metadata will not be included when set to false.)
        */
        this.set_IncludeEntities = function(value) {
            this.setInput("IncludeEntities", value);
        }

        /*
        Set the value of the MaxId input for this Choreo. ((optional, string) Returns results with an ID less than (older than) or equal to the specified ID.)
        */
        this.set_MaxId = function(value) {
            this.setInput("MaxId", value);
        }

        /*
        Set the value of the ScreenName input for this Choreo. ((optional, string) Screen name of the user to return results for. If ScreenName or UserId are not provided, the authenticating user is assumed.)
        */
        this.set_ScreenName = function(value) {
            this.setInput("ScreenName", value);
        }

        /*
        Set the value of the SinceId input for this Choreo. ((optional, string) Returns results with an ID greater than (more recent than) the specified ID.)
        */
        this.set_SinceId = function(value) {
            this.setInput("SinceId", value);
        }

        /*
        Set the value of the UserId input for this Choreo. ((optional, string) ID of the user to return results for. If ScreenName or UserId are not provided, the authenticating user is assumed.)
        */
        this.set_UserId = function(value) {
            this.setInput("UserId", value);
        }

}

/*
A ResultSet with methods tailored to the values returned by the ListFavorites Choreo.
The ResultSet object is used to retrieve the results of a Choreo execution.
*/

var ListFavoritesResultSet = function(resultStream) {
    ListFavoritesResultSet.super_.call(this, resultStream);    
        /*
        Retrieve the value for the "Response" output from this Choreo execution. ((json) The response from Twitter.)
        */
        this.get_Response = function() {
            return this.getResult("Response");
        }
        /*
        Retrieve the value for the "Limit" output from this Choreo execution. ((integer) The rate limit ceiling for this particular request.)
        */
        this.get_Limit = function() {
            return this.getResult("Limit");
        }
        /*
        Retrieve the value for the "Reset" output from this Choreo execution. ((date) The remaining window before the rate limit resets in UTC epoch seconds.)
        */
        this.get_Reset = function() {
            return this.getResult("Reset");
        }
        /*
        Retrieve the value for the "Remaining" output from this Choreo execution. ((integer) The number of requests left for the 15 minute window.)
        */
        this.get_Remaining = function() {
            return this.getResult("Remaining");
        }
}

util.inherits(ListFavorites, choreography.Choreography);
util.inherits(ListFavoritesInputSet, choreography.InputSet);
util.inherits(ListFavoritesResultSet, choreography.ResultSet);
exports.ListFavorites = ListFavorites;

