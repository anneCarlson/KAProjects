(function() {

    requirejs.config({
        waitSeconds: 120
    });

    var controller = (function() {
        
        var self = {
            id: projectID,
            currentPage: ko.observable(0),
            viewer: ko.observable(),
            pages: ko.observableArray(),
            status: ko.observable('in_progress'),
            userFileProgress: ko.observable(false),
            rubric: ko.observable('')
        };

        self.videos = ko.observableArray([
            {
                _id: "1234",
                display_name: "Video 1",
                url: "http://www.google.com"
            },
            {
                _id: "1235",
                display_name: "Video 2",
                url: "http://www.google.com"
            }
        ]);

        self.currentPageData = ko.computed(function() {
            if (self.pages().length > self.currentPage() && self.currentPage() > -1)
                return self.pages()[self.currentPage()];
            return {};
        });

        var makePageObservable = function (prop) {
            return ko.computed({
                read: function() {
                    if (self.currentPage() < self.pages().length && self.currentPage() > -1)
                        return self.pages()[self.currentPage()][prop];
                },
                write: function(val) {
                    if (self.currentPage() < self.pages().length && self.currentPage() > -1) {
                        self.pages()[self.currentPage()][prop] = val;
                        self.pages.notifySubscribers();
                    }
                },
                deferEvaluation: true
            });
        };

        self.userFile = makePageObservable('userFile');
        self.userFileName = makePageObservable('userFileName');

        self.scorePage = function () {
            var score = self.viewer().scoreInput();
            if (score.correct) {
                self.currentPageData().completed = true;
                self.pages.notifySubscribers();
                showModal(
                    'Correct!',
                    'Congratulations!  Your answer was correct.  You should move on to the next page.');
            } else {
                showModal(
                    "Failure.",
                    "Sorry, your answer was wrong.  Please try again.");
            }
        };

        self.pageIncomplete = function(i) {
            var page = self.pages()[i];
            if (page) {
                var textIncomplete = page.textInput && (!page.userText || page.userText == '');
                var fileIncomplete =
                    page.fileInput &&
                    (!page.userFile ||
                     page.userFile == '' ||
                     page.userFile.substring(0,6) == 'error:');
                var out =
                    (page.type == 'freeform' && (textIncomplete || fileIncomplete)) ||
                    (page.type == 'exercise' && !page.completed);
                return out;
            }
        };

        self.unfinishedPages = ko.computed(function() {
            return _.filter(_.range(self.pages().length), self.pageIncomplete);
        });

        self.json = ko.computed({
            read: function() {
                return self.currentPageData().pageJson;
            },
            deferEvaluation: true
        });

        self.currentInput = ko.computed({
            read: function() {
                return self.currentPageData().userText;
            },
            write: function(newVal) {
                self.currentPageData().userText = newVal;
                self.pages.notifySubscribers();
            },
            deferEvaluation: true
        });

        self.loadData = function(data) {
            console.log(data);
            console.log(JSON.parse(data.contents));
            if (!data.contents)
                data.contents = data.project_contents;
            if (data.contents.length == 0) {
                self.pages([{pageTitle: "page", pageJson: {}}]);
            } else {
                self.pages(JSON.parse(data.contents));
            };
            self.rubric(data.rubric || '');
            self.videos(_.filter(_.map(data.videos, function (v) {
                return JSON.parse(v);
            }), function (v) {
                return v.display_name && v.url;
            }));
            self.status(data.status || 'in_progress');
        };

        self.saveData = function() {
            var data = {
                id: self.id,
                contents: JSON.stringify(self.pages()),
                status: self.status()
            };
            console.log(data);
            $.post('/ajax/saveClonedProject/'+self.id, data, function() {
                console.log("done");
            });
        };

        self.submit = function() {
            showModal('Submitting', 'Submitting your work');
            self.status('complete');
            self.saveData();
            console.log(self.rubric());
            console.log(self.status());
            console.log(self.status() == 'complete' && self.rubric() != '');
        };

        self.init = function() {
            var mainLoaded = $.get('/ajax/loadClonedProject/'+self.id, function (response) {
                self.loadData(response);
            });
            
            // Load khan-exercises modules, then perseus, then koperseus

            //don't know why we need to load things like this, but changing it
            //broke perseus.  If someone wants to change the load process,
            //please do.
            require(["/perseus/ke-deps.js"], function() {
                // pre built
                // require(["build/perseus.js"], initPerseus);

                // pre built with source maps
                require(["/perseus/build/perseus.debug.js"], initPerseus);

                // built on demand
                // require(["src/editor-page-shim.js"], initPerseus);
            });

            function initPerseus() {
                mainLoaded.done(function () {
                    ko.applyBindings(self);
                });
            }
            
            var keyStop = {
                8: ":not(input:text, textarea, input:file, input:password)", // stop backspace = back
                13: "input:text, input:password", // stop enter = submit 

                end: null
            };
            $(document).bind("keydown", function(event){
                if (event.which == 8) {
                    if ($(event.target).is(":not(input:text, textarea, input:file, input:password)"))
                        event.preventDefault();
                };
                if (event.which == 13) {
                    if ($(event.target).is("input:text, input:password")) {
                        event.preventDefault();
                        if (self.pages()[self.currentPage()].type == 'exercise') {
                            self.scorePage();
                        };
                    };
                };
            });
        };

        return self;
    })();

    controller.init();

})();
