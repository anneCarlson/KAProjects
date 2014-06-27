(function() {
    var perseusInit = null;
    var getPerseus = function() {
        if (!perseusInit)
            perseusInit = Perseus.init({});
        return perseusInit;
    };

    var defaultQuestion = {
        question: {
            content: "",
            widgets: {}
        },
        answerArea: {
            options: {},
            type: "input-number"
        },
        hints: []
    };

    ko.bindingHandlers.editorPage = {
        init: function(element, valueAccessor, allBindings) {

            var editorObservable = valueAccessor();
            var props = allBindings.get("props");
            var update = allBindings.get("updateProps");
            if (!update) {
                update = props;
            }

            getPerseus().then(function() {

                var updateJson = function(data, cb) {
                    var old = props();
                    update(_.extend({}, old, data));
                };

                var newProps = _.extend({}, defaultQuestion,
                                        ko.unwrap(props),
                                        { onChange: updateJson });

                var editor = React.renderComponent(
                    Perseus.EditorPage(newProps, null),
                    element
                );

                var updateProps = function(newVal) {
                    if (!newVal || !newVal.onChange) {
                        newVal = _.extend({}, defaultQuestion, newVal, { onChange: updateJson });
                    }
                    editor.replaceProps(newVal);
                };

                props.subscribe(updateProps);

                editorObservable(editor);

            }).then(function() {
            }, function(err) {
                console.error(err);
            });
        }
    }

    ko.bindingHandlers.viewerPage = {
        init: function(element, valueAccessor, allBindings) {
            var viewerObservable = valueAccessor();
            var props = allBindings.get("props");

            var makeProp = function(item) {
                return {
                    item: _.extend({}, defaultQuestion, item),
                    initialHintsVisible: 0,
                    enabledFeatures: {
                        highlight: true,
                        toolTipFormats: true
                    }
                };
            };

            getPerseus().then(function() {
                //stupid as shit dummy node because item renderer is coded weird
                var itemMountNode = document.createElement("div");
                var viewer = React.renderComponent(
                    Perseus.ItemRenderer(makeProp(ko.unwrap(props)), null),
                    itemMountNode
                );

                props.subscribe(function (newVal) {
                    viewer.replaceProps(makeProp(newVal));
                });

                viewerObservable(viewer);
            });
        }
    }

    ko.bindingHandlers.formattedText = {
        init: function (element, valueAccessor) {
            getPerseus().then(function() {
                var viewer = React.renderComponent(
                    Perseus.Renderer({ content: ko.unwrap(valueAccessor()),
                                       widgets: [] }, null),
                    element
                );
                ko.utils.domData.set(element, 'viewer', viewer);
            });
        },

        update: function (element, valueAccessor) {
            var value = ko.unwrap(valueAccessor());
            getPerseus().then(function() {
                var viewer = ko.utils.domData.get(element, 'viewer');
                viewer.setProps({ content: value });
            });
        }
    }

    ko.bindingHandlers.slideVisible = {
        init: function(element, valueAccessor) {
            var value = valueAccessor();
            var valueUnwrapped = ko.unwrap(value);

            $(element).toggle(valueUnwrapped);
        },

        update: function(element, valueAccessor, allBindings) {
            var value = valueAccessor();
            var valueUnwrapped = ko.unwrap(value);
            var duration = allBindings.get('slideDuration') || 200;
            var noAnimation = allBindings.get('noAnimation');

            if (!noAnimation) {
                if (valueUnwrapped == true)
                    $(element).slideDown(duration);
                else
                    $(element).slideUp(duration);
            } else {
                $(element).toggle(valueUnwrapped);
            }
        }
    };

    ko.bindingHandlers.upload = {
        init: function(element, valueAccessor, allBindings) {
            var value = valueAccessor();
            var progress = allBindings.get('uploadProgress');
            var fileName = allBindings.get('uploadFilename');
            $(element).on("change", function() {
                console.log('here!');
                console.log(element);
                progress(true);
                var upload = new S3Upload({
                    dom_element: element,
                    s3_sign_put_url: '/sign_s3',
                    onFinishS3Put: function(public_url, file) {
                        value(public_url);
                        progress(false);
                        element.value = null;
                        if (fileName)
                            fileName(file.name);
                    },
                    onError: function(status) {
                        console.log(status);
                        value('error: '+status);
                        progress(false);
                        element.value = null;
                        if (fileName)
                            fileName('Error');
                    }
                });
            });
        }
    };

    ko.bindingHandlers.forwardClick = {
        init: function(element, valueAccessor) {
            var value = ko.unwrap(valueAccessor());
            $(element).click(function() {
                $(value).click();
            });
        }
    }

    ko.bindingHandlers.onEnter = {
        init: function(element, valueAccessor) {
            var value = ko.unwrap(valueAccessor());
            $(element).keydown(function(event) {
                if (event.which == 13) {
                    value();
                    event.preventDefault();
                };
            });
        }
    }
})();
