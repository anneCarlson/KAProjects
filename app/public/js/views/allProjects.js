$(document).ready(function(){
    $('#allProjectsButton').addClass('active');
	var allPC = new allProjectController();
	$('.modal-confirm').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-confirm .modal-header h3').text('title');
	$('.modal-confirm .modal-body p').html('body');
	$('.modal-confirm .cancel').html('Go Back');
	$('.modal-confirm .submit').html('Add');
})