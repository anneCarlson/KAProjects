var tembooSession = require("./temboosession.js");

var Choreography = function(session, choreoUri) {
    var session = session;
    var uri = choreoUri;

    var getPath = function() {
        return [session.getBasePath(), "choreos", uri].join("/");
    }
    
    this._execute = function(inputSet, formatter, callback, errorCallback) {
        if (!inputSet) {
            inputSet = new InputSet();
        }
        var params = {};
        var body = inputSet.formatInputs();
        var path = getPath();
        session.postRequest(path, params, body, 
            function(stream) {
                callback(formatter(stream));
            }, 
            function(stream) {
                errorCallback(stream);
        });
    }
}

var InputSet = function() {
    var inputs = {};
    // TODO: Someday, aliases.
    var credentialName = null;

    this.setInput = function(name, value) {
        inputs[name] = value;
    }
    this.setCredential = function(target) {
        credentialName = target;
    }

    this.formatInputs = function() {
        fullInputs = {};
        if (Object.keys(inputs).length > 0) {
            var inputArray = [];
            for (var key in inputs) {
                currentInput = {
                    "name": key,
                    "value": inputs[key]
                };
                inputArray.push(currentInput);
                // console.log(inputArray);
            }
            fullInputs["inputs"] = inputArray;
        }
        if (credentialName) {
            fullInputs["preset"] = credentialName;
        }
        var formattedInputs = JSON.stringify(fullInputs);
        // console.log("These are the formatted inputs.");
        // console.log(formattedInputs);
        return formattedInputs;
    }
}

var ResultSet = function(resultStream) {
    // console.log(resultStream);
    var resultHash = JSON.parse(resultStream);
    var id = resultHash["execution"]["id"];
    var status = resultHash["execution"]["status"];
    if (status == "ERROR") {
        var errorTime = resultHash["execution"]["endtime"];
    } else {
        var errorTime = null;
    }
    var lastError = resultHash["execution"]["lasterror"];
    var startTime = resultHash["execution"]["starttime"];
    var endTime = resultHash["execution"]["endtime"];
    var outputs = resultHash["output"];
    //console.log(outputs);

    var processStamp = function(stampString) {
        return new Date(Number(stampString));
    }

    this.getCompletionStatus = function() {
        return status;
    }

    this.getStartTime = function() {
        return processStamp(startTime);
    }

    this.getCompletionTime = function() {
        return processStamp(endTime);
    }
    this.getID = function() {
        return id;
    }

    this.getResult = function(key) {
        return outputs[key];
    }

    this.getKeySet = function() {
        return Object.keys(output);
    }

    this.getOutputs = function() {
        return outputs;
    }

    this.getLastError = function() {
        return lastError;
    }
}

exports.Choreography = Choreography;
exports.InputSet = InputSet;
exports.ResultSet = ResultSet;