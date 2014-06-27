$(document).ready(function(){
    $('#myProjectsButton').addClass('active');
	var mPC = new myProjectController();
	
	$('.modal-confirm').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-confirm .modal-header h3').text('Start project');
	$('.modal-confirm .modal-body p').html('You don\'t have all the prerequisites for this project. Are you sure you want to start it?');
	$('.modal-confirm .cancel').html('Cancel');
	$('.modal-confirm .submit').html('Start');
	$('.modal-confirm .submit').addClass('btn-danger');

	$('#tabs').tabs().addClass('ui-tabs-vertical ui-helper-clearfix');
})