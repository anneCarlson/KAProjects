
function allProjectController()
{

// bind event listeners to button clicks //
	var that = this;

	var controller = (function(){
	    var original;
		var self = {
			authored: ko.observableArray(),
			nonAuthored: ko.observableArray(),
			allPrerequisites: ko.observable(),
			query: ko.observable('')
		};

        self.cloneProject = function(project) {
			$.get('/ajax/cloneProject/'+project._id,function (response){
                self.nonAuthored.remove(project);
                var index = original.indexOf(project);
                original.splice(index, 1);
                $('.modal-confirm').modal('hide');
			})            
        };
        
        self.search = function(value) {
            var tempArray = [];
            
            original.forEach(function(el) {
                if (includeInSearch(el, value)) {
                    tempArray.push(el);
                }
            });
            self.nonAuthored(tempArray);
        };
        
        includeInSearch = function(project, value, callback) {
            return project.prerequisites.reduce(function(previous, current){
                return previous || (self.allPrerequisites()[current].display_name.toLowerCase().indexOf(value.toLowerCase()) >= 0)
            },project.title.toLowerCase().indexOf(value.toLowerCase()) >= 0)
        }
        
        self.getMoreInformation = function(project) {
            var html = project.description+'<br> Prerequisites: <ul>';
            project.prerequisites.forEach(function(prerec) {
                html = html + '<li>'+self.allPrerequisites()[prerec].display_name+'</li>';
            });
            $('.modal-confirm .modal-header h3').text(project.title);
            $('.modal-confirm .modal-body p').html(html+'</ul> If you want to add it to your queue, click Add.');
            $('.modal-confirm').modal('show');
            $('.modal-confirm .submit').click(function() {self.cloneProject(project)});        
        }
        
        self.query.subscribe(self.search);
        
		self.init = function(){
		    $.get('/ajax/allProjects',function (response){
                    self.authored(response[1]);
                    self.nonAuthored(response[0]);
                    original = response[0];
                    self.allPrerequisites({});
                    ko.applyBindings(self);
                    $.get('/ajax/allPrerequisites', function (response){
                        var obj = {};
                        _.each(response, function(el) {
                            obj[el.name] = el;
                        });
                        self.allPrerequisites(obj);
                    })
                })

		}

		return self;
	})();

	controller.init();
}