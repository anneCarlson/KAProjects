function myProjectController()
{

// bind event listeners to button clicks //
	var that = this;

	var controller = (function(){
		var self = {
			authored: ko.observableArray(),
			completed: ko.observableArray(),
			queued: ko.observableArray(),
			queued2: ko.observableArray(),
			in_progress: ko.observableArray(),
			current_selection: ko.observable(),
			recommendations: ko.observableArray(),
			updating_text: ko.observable(),
			allPrerequisites: ko.observable()
		}

        self.makeInProgress = function(project) {
            var inProgHelper = function() {
                $.post('/ajax/saveClonedProject/'+project._id, {id: project._id, status: 'in_progress'}, function (response){
                    window.location = '/viewProject/' + project._id;
                });
            }
            if(project.status == 'in_queue') {
                $.get('/ajax/cloneGenRecPrereqs/'+project._id, function (response){
                    response = _.sortBy(response, function(el) { return el.display_name;});
                    if (response.length > 5)
                        response = response.slice(0,5);
                    var html = 'You haven\'t completed all the prerequisites for this project. We recommend you '+
                     'gain proficiency in the following exercises to work towards being ready to start it. <ul>';
                    response.forEach(function(prerec) {
                        html = html + '<li><a href="'+prerec.link+'" target="_blank">'+prerec.display_name+'</a></li>';
                    });
                    $('.modal-confirm .modal-header h3').text('Start project');
                    $('.modal-confirm .modal-body p').html(html+'</ul> If you think you are ready to complete it, click Start.');
                    $('.modal-confirm .cancel').html('Cancel');
	                $('.modal-confirm .submit').html('Start');
	                $('.modal-confirm .submit').addClass('btn-danger');
                    $('.modal-confirm').modal('show');
                    $('.modal-confirm .submit').click(function() {inProgHelper()});
                });	
            }else {
                inProgHelper();
            }           
        };
        
        self.getMoreInformation = function(project) {
            var html = project.description+'<br> Prerequisites: <ul>';
            project.prerequisites.forEach(function(prerec) {
                html = html + '<li>'+self.allPrerequisites()[prerec].display_name+'</li>';
            });
            $('.modal-confirm .modal-header h3').text(project.title);
            $('.modal-confirm .modal-body p').html(html+'</ul>');
            $('.modal-confirm .cancel').html('Back');
	        $('.modal-confirm .submit').html('Start');
            $('.modal-confirm').modal('show');
            $('.modal-confirm .submit').removeClass('btn-danger');
            $('.modal-confirm .submit').click(function() {self.makeInProgress(project)});        
        }
        
		self.getRecommendations = function(queuedProject){
            $.get('/ajax/cloneGenRecPrereqs/'+queuedProject._id,function (response){
                response = _.sortBy(response, function(el) { return el.display_name;});
                if (response.length <= 5)
                    self.recommendations(response);
                else
                    self.recommendations(response.slice(0,5));
            });		
            self.current_selection(queuedProject);
		}

		self.getRecommendationsAll = function(){
            $.get('/ajax/userGenRecPrereqs',function (response){
                response = _.sortBy(response, function(el) { return el.display_name;});
                if (response.length <= 5)
                    self.recommendations(response);
                else
                    self.recommendations(response.slice(0,5));
            });
            self.current_selection({title: 'All Projects'});
		}
		
		self.updateUserInfo = function(){
			self.updating_text("Updating...");
			$.post('/ajax/updateUserInfo', function(response) {
			    console.log(response);
			    if(response == 'success'){
			        $.get('/ajax/clonedProjects', function (response) {
			            self.queued(response[1].concat(response[0]));
			            self.queued2(response[0]);
			            if(self.current_selection()._id) {
			                self.getRecommendations(self.current_selection());
			                self.updating_text("Update");
			            } else {
			                self.getRecommendationsAll();
			                self.updating_text("Update");
			            }
			        });
			    }
			    else{
                    $('.modal-confirm .modal-header h3').text();
			        $('.modal-confirm .modal-body p').html('We couldn\'t update your skill proficiencies. If you want to update, you\'ll need to reauthenticate with Khan.');
                    $('.modal-confirm .cancel').html('No thanks');
	                $('.modal-confirm .submit').html('Authenticate');
                    $('.modal-confirm').modal('show');
                    $('.modal-confirm .submit').removeClass('btn-danger');
                    $('.modal-confirm .submit').click(function() {window.location = '/authenticate'});
			    }
			});
		}

		self.init = function(){
		    //TODO(annie): set view to update when user updates proficiencies
			$.get('/ajax/allProjects',function (response){
				self.authored(response[1]);
				$.get('/ajax/clonedProjects', function (response) {
				    self.updating_text("Update");
				    self.queued(response[1].concat(response[0]));
				    self.queued2(response[0]);
				    self.in_progress(response[2]);
				    self.completed(response[3]);
				    self.current_selection({title: 'All Projects'});

                    $.get('/ajax/userGenRecPrereqs',function (response){
                        if (response.length <= 5)
                            self.recommendations(response);
                        else 
                            self.recommendations(response.slice(0,5));
                        ko.applyBindings(self);  
                        $.get('/ajax/allPrerequisites', function (response){
                            var obj = {};
                            _.each(response, function(el) {
                                obj[el.name] = el;
                            });
                            self.allPrerequisites(obj);
                        })           
                    });
				
				});
			});
		}


		return self;
	})();

	controller.init();
}