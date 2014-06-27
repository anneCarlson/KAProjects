$(document).ready(function() {
    var showLockedAlert = function(msg){
	$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
	$('.modal-alert .modal-header h3').text('Success!');
	$('.modal-alert .modal-body p').html(msg);
	$('.modal-alert').modal('show');
	$('.modal-alert button').click(function(){window.location.href = '/';})
	setTimeout(function(){window.location.href = '/';}, 3000);
    }

    var attemptLogout = function()
    {
	console.log("Attempting logout");
	$.ajax({
	    url: "/home",
	    type: "POST",
	    data: {logout : true},
	    success: function(data){
	 	showLockedAlert('You are now logged out.<br>Redirecting you back to the homepage.');
	    },
	    error: function(jqXHR){
		console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
	    }
	});
    }

    $('#btn-logout').click(function(){ attemptLogout(); });
});