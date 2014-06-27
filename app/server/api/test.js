// author(annie)
/*
    A tester for apiCaller
*/

var APIcaller = require('./apiCaller');
var apicaller = new APIcaller();

// apicaller.getUserInfo("t6642170736934912","smHgb3FFE3UxWYJz").then(
//     function(result){
//         console.log(result);
//     }, function(error){
//         console.log("fail: test 1");
//     });

// apicaller.getUserExercises("t6642170736934912","smHgb3FFE3UxWYJz").then(
//     function(result){
//         console.log(result);
//     }, function(error){
//         console.log("fail: test 1");
//     });

// apicaller.getUserInfo("t6030465582497792","Lhcx5uFTXDpSUM7K").then(
//     function(result){
//         console.log("fail: test 2");
//     }, function(error){
//         console.log("pass");
//     });


apicaller.getAllExercises().then(
    function(result){
        console.log(result);
        console.log("pass");
        apicaller.getVideosForAllExercises(result).then(
            function(result){
                console.log(result);
            }, function(error){
                console.log(error);
            });
    }, function(error){
        console.log(error);
    });
