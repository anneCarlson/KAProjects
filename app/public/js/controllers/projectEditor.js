(function() {

    requirejs.config({
        waitSeconds: 120
    });

    var clickableList = function(displayTitle, id, name) {
        var self = {
            searchText: ko.observable(''),
            selectedObj: ko.observable({}),
            allObj: ko.observable({}),
            id: id,
            name: name,
            displayTitle: displayTitle
        }

        self.loaded = ko.observable(false);

        self.selectedList = ko.computed(function() {
            return _.sortBy(_.keys(self.selectedObj()), self.getName);
        });


        self.getObj = function(id) {
            var ret = self.allObj()[id];
            if (!ret) {
                ret = {};
                ret[self.id] = id;
                ret[self.name] = "invalid";
            }
            return ret;
        };

        self.getName = function(id) {
            return self.getObj(id)[self.name];
        };

        self.allList = ko.computed(function() {
            var list = _.keys(self.allObj());
            var filter = self.searchText();
            return _.take(_.sortBy(_.filter(
                list,
                function(id) {
                    var filtered = self.getName(id)
                        .toUpperCase()
                        .indexOf(filter.toUpperCase()) !== -1;
                    var alreadySelected = self.selectedObj()[id];
                    return filtered && !alreadySelected;
                }
            ), self.getName), 10);
        });

        self.select = function (id) {
            self.selectedObj()[id] = true;
            self.selectedObj.notifySubscribers();
        };

        self.deselect = function (id) {
            self.selectedObj(_.omit(self.selectedObj(), id));
        };

        self.loadSelected = function(selected) {
            var selectedObj = self.selectedObj();
            _.each(selected, function (name) {
                selectedObj[name] = true;
            });
            self.selectedObj(selectedObj);
        };

        self.loadSelectedObjs = function(selected) {
            var allObj = self.allObj();
            var selectedObj = self.selectedObj();
            _.each(selected, function (obj) {
                selectedObj[obj[self.id]] = true;
                allObj[obj[self.id]] = obj;
            });
            console.log(_.clone(allObj));
            console.log(_.clone(selectedObj));
            self.allObj.notifySubscribers();
            self.selectedObj.notifySubscribers();
        };

        self.loadAll = function(all) {
            var allObj = self.allObj();
            _.each(all, function (obj) {
                allObj[obj[self.id]] = obj;
            });
            self.loaded(true);
            self.allObj(allObj);
        }

        return self;
    };

    var controller = (function() {

        var self = {
            id: projectID,
            currentPage: ko.observable(0),
            editor: ko.observable(),
            tabs: ["Content", "Requirements", "Videos", "General Info", "Rubric"],
            pages: ko.observableArray(),
            newPageTitle: ko.observable(""),
            newPageType: ko.observable(""),
            projectTitle: ko.observable(""),
            projectDescription: ko.observable(""),
            pageRenameTitle: ko.observable(""),
            renaming: ko.observable(false),
            noAnimation: ko.observable(false),
            prereqs: clickableList('Prerequisites', 'name', 'display_name'),
            videos: clickableList('Videos', '_id', 'display_name'),
            rubric: ko.observable(''),
            thumbnail: ko.observable(''),
            thumbnailProgress: ko.observable(false)
        };

        self.currentTab = ko.observable(self.tabs[0]);

        self.pageText = function(index) {
            return ko.computed(function() {
                var page = self.pages()[index];
                var text;
                if (page && page.pageTitle !== '')
                    text = page.pageTitle;
                else
                    text = 'untitled';
                return text;
            });
        };

        self.createPage = function() {
            if (self.newPageTitle() === '')
                showModal('Error', 'Please enter a page title');
            else {
                var newPage = {
                    pageTitle: self.newPageTitle(),
                    type: self.newPageType(),
                    pageJson: {},
                    text: "",
                    textInput: false
                }

                self.pages.push(newPage);
                self.newPageTitle("");
                self.currentPage(self.pages().length-1);
            }
        };

        self.deletePage = function() {
            var i = self.currentPage();
            if (i == self.pages().length-1 && i !== 0) {
                self.currentPage(self.pages().length-2);
            }
            self.pages.splice(i,1);
        };

        self.movePage = function(dir) {
            return function () {
                self.noAnimation(true);
                var i = self.currentPage();
                var newI = i+dir;
                var pages = self.pages();
                if (newI >= 0 && newI < pages.length) {
                    var temp = pages[i];
                    pages[i] = pages[newI];
                    pages[newI] = temp;
                    self.pages.notifySubscribers();
                    self.currentPage(newI);
                }
                _.defer(function() {
                    self.noAnimation(false);
                });
            }
        };

        self.startRename = function() {
            self.pageRenameTitle(self.pages()[self.currentPage()].pageTitle);
            self.renaming(true);
        }

        self.renamePage = function() {
            if (self.pageRenameTitle() === '') {
                showModal('Error', 'Please enter a page title');
            } else {
                var i = self.currentPage();
                self.pages()[i].pageTitle = self.pageRenameTitle();
                self.pages.notifySubscribers();
                self.renaming(false);
            }
        };

        self.savePageJson = function(currentPage) {
            if (currentPage < self.pages().length) {
                self.pages()[currentPage].fullPageJson =
                    self.editor().toJSON(true);
            }
        };

        self.currentPage.subscribe(self.savePageJson, null, 'beforeChange');

        var makePageObservable = function (prop) {
            return ko.computed({
                read: function() {
                    if (self.currentPage() < self.pages().length)
                        return self.pages()[self.currentPage()][prop];
                },
                write: function(val) {
                    if (self.currentPage() < self.pages().length) {
                        self.pages()[self.currentPage()][prop] = val;
                        self.pages.notifySubscribers();
                    }
                },
                deferEvaluation: true
            });
        };

        self.textInput = makePageObservable('textInput');
        self.fileInput = makePageObservable('fileInput');
        self.json = makePageObservable('pageJson');
        self.text = makePageObservable('text');

        self.video = makePageObservable('video');
        self.displayVideo = ko.observable('');
        self.setVideo = function() {
            var val = self.displayVideo();
            var matcher = /youtu.be\/(.*)/;
            var match = val.match(matcher);
            if (match) {
                self.displayVideo('');
                self.video(match[1]);
            }
            else
                self.video(null);
        };
        self.currentPage.subscribe(function() {
            self.displayVideo('');
        });

        self.file = makePageObservable('file');
        self.fileProgress = ko.observable(false);
        self.fileName = makePageObservable('fileName');

        self.savePages = function() {
            self.savePageJson(self.currentPage());
            return _.map(self.pages(), function(page) {
                var json = page.fullPageJson;
                if (!json)
                    json = _.pick(page.pageJson, "question", "answerArea", "hints");
                return _.extend(_.omit(page, "fullPageJson"), {pageJson: json});
            });
        };

        self.canPublish = function() {
            var pages = self.savePages();
            var ret = [];
            _.each(pages, function(p) {
                if (p.type == 'freeform' && p.text == '')
                    ret.push(p.pageTitle);
                if (p.type == 'exercise' && p.pageJson.question.content == '')
                    ret.push(p.pageTitle);
                if (p.type == 'video' && !p.video)
                    ret.push(p.pageTitle);
            });
            if (self.projectTitle() == '')
                ret.push('Title');
            if (self.projectDescription() == '')
                ret.push('Description');
            if (self.prereqs.selectedList().length == 0)
                ret.push('Prerequisites');
            return ret;
        }

        self.getSaveData = function() {
            var out = {};
            out.contents = JSON.stringify(self.savePages());
            out.prerequisites = self.prereqs.selectedList();
            out.title = self.projectTitle();
            out.description = self.projectDescription();
            out.videos = _.map(self.videos.selectedList(), function(v) {
                return JSON.stringify(self.videos.getObj(v));
            });
            out.thumbnail = self.thumbnail();
            if (out.thumbnail.substring(0,6) === 'error:')
                out.thumbnail = '';
            out.rubric = self.rubric();

            return out;
        };

        self.saveData = function() {
            var out = self.getSaveData();
            $.post('/ajax/saveProject/'+self.id, out,  function() {
                console.log("done");
            });
        };

        self.loadData = function(data) {
            self.pages(JSON.parse(data.contents));
            self.projectTitle(data.title);
            self.projectDescription(data.description);
            self.rubric(data.rubric || '');
            self.thumbnail(data.thumbnail || '');
            self.prereqs.loadSelected(data.prerequisites);
            var projVideos = _.map(data.videos, function(v) {
                return JSON.parse(v);
            });
            self.videos.loadSelectedObjs(projVideos);
        };

        self.publish = function() {
            var out = self.getSaveData();
            var todo = self.canPublish();
            if (todo.length == 0) {
                console.log('publish');
                $.post('/ajax/publishProject/'+self.id, out, function() {
                    showModal("Congratulations!", "Your project has been published.");
                });
            }
            else
                showModal("Error", "You haven't completed your project.  Please complete "+
                          todo.join(', ')+'.');
        }

        self.init = function() {
            var mainLoaded = $.get('/ajax/loadProjects/'+self.id, function (data) {
                self.loadData(data);
                console.log(data.prerequisites);
                console.log('main')
            });

            $.get('/ajax/allVideos', function (videos) {
                mainLoaded.done(function(data) {
                    self.videos.loadAll(videos);
                    console.log('videos');
                });
            });

            $.get('/ajax/allPrerequisites' ,function (prereqs) {
                mainLoaded.done(function(data) {
                    self.prereqs.loadAll(prereqs);
                    console.log('prereqs');
                });
            });


            // require(["/perseus/build/perseus.js"], initPerseus);

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
                mainLoaded.done(function() {
                    ko.applyBindings(self);
                });
            };
        };

        return self;
    })();

    controller.init();

})();
