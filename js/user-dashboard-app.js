(function ($) {

    ///////// AUTH STUFF

    // Get the CSRF Token and add it to the window object.

    function getCsrfToken() {
        jQuery
            .get(Drupal.url('rest/session/token'))
            .done(function (data) {
                window.csrfToken = data;
                console.log(window.csrfToken);
            });
    }

    getCsrfToken();

    $.ajaxSetup({
        beforeSend: function (xhr, settings) {

            if (!(/^http:./.test(settings.url) || /^https:./.test(settings.url))) {
            // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader('X-CSRFToken', window.csrfToken);
            }
        }
    });



    // Model
    var User = Backbone.Model.extend({
        urlRoot: 'user',

        sync: function (method, model, options) {

            // Set authentication.
            options = options || (options = {});
            options.beforeSend = function (xhr) {
                var user = 'restuser';
                var pass = 'restuser';

                xhr.setRequestHeader('Content-Type', 'application/hal+json');
                xhr.setRequestHeader('Authorization', ('Basic ' + btoa(user + ':' + pass)));
                xhr.setRequestHeader('X-CSRF-Token', window.csrfToken);
            };

            switch (method) {
                case 'patch':
                    options.url = '../user/' + this.attributes.uid[0].value + '?DEBUG_SESSION_START=foobar';
                    break;
            }
            // console.log(method);
            // console.log(model);
            // console.log(options);

            return Backbone.sync.apply(this, arguments);
        }

    });

    // Collection
    var Users = Backbone.Collection.extend({
        model: User,
        url: 'userdash/user/data?_format=hal_json'
    });

    var users = new Users();
    users.fetch({
        success: function (collection, response) {
            var newdash = new DashContainer({collection: collection});
            newdash.render(collection, response);
        }
    });


    // Model
    var Node = Backbone.Model.extend({});

    // Collection
    var Nodes = Backbone.Collection.extend({
        model: Node,
        url: '/userdash/data/node'
    });

    var nodes = new Nodes();
    nodes.fetch({
        success: function (collection, response) {
        }
    });


    // Lust of Users view.
    var UserList = Backbone.View.extend({
        tagName: 'ul',
        className: 'user-list',
        events: {
            'click .reset': 'resettheview',
            'click #show-admin': 'showadmin'
        },
        initialize: function () {
        },
        render: function (collection, response) {
            var element = $(this.el);
            // Clear potential old entries first
            element.empty();

            // Loop through all the models and create a userView for each item.
            _.each(response, function (value, key) {
                var userView = new UserView({model: value});
                element.append(userView.render(value).el);
            });

            // Add dashboard controls.
            var dashcontroller = new DashBoardControls();
            $(this.el).after(dashcontroller.render().el);

            $('#userdashboard').append(element);
            return this; // returning this for chaining..
        }

    });

    var UserView = Backbone.View.extend({
        tagName: 'li',
        className: 'user',

        initialize: function () {
            _.bindAll(this, 'render');
        },
        render: function () {
            var element = $(this.el);
            // Clear potential old entries first

            element.empty();
            function getname(model) {
                var thename = _.flatten(_.map(model.name, _.values));
                if (_.flatten(_.map(model.uid, _.values)) == '0') {
                    thename = 'anonymous';
                }
                return thename;
            }

            element.append(getname(this.model));
            return this;
        }
    });

    var DashBoardControls = Backbone.View.extend({
        className: 'controls',
        initialize: function () {
        },
        render: function (response) {

            var element = $(this.el);
            // Clear potential old entries first
            element.empty();

            element.append('<button id="roles-filter">Filter users by role</button>' +
                '<select id="roles-select" name="roles">' +
                '<option value=" " text="all"></option>' +
                '</select>\n' +
                '<button class="clear">Clear</button>\n' +
                '<button class="fetch">All</button>' +
                '<button class="sort-az">All Sorted a-z</button>\n');

            // Loop through all the models and create a userView for each item.
            _.each(response, function (model, key) {

                if (model.roles) {
                    var therole = model.roles[0].target_id;
                    var dupCheck = $(element).find('#roles-select option[value=' + therole + ']').length;
                    if (dupCheck === 0) {
                        $(element).find('#roles-select').append($('<option>', {
                            value: therole,
                            text: therole
                        }));
                    }
                }
            });
            return this;
        }
    });

    var userDisplay = Backbone.View.extend({
        className: 'addUser',
        events: {
            'click .getbyname': 'getbyname',
            'click .savechanges': 'savechanges'
        },
        initialize: function () {
        },
        render: function (collection, response) {
            var element = $(this.el);
            // Clear potential old entries first
            element.empty();

            element.collection = collection;

            element.append('<label for="user-name">User name:</label><input type="text" id="user-name" name="user-name" value="">');
            element.append('<label for="user-access">Last access time:</label><input type="text" id="user-access" name="user-access" value="">');
            element.append('<label for="user-email">Email Address:</label><input type="email" id="user-email" name="user-email" value="">');
            element.append('<br /><button class="getbyname">Get User by name</button>\n');
            element.append('<br /><button class="savechanges">Save</button>\n');
            return this;
        },
        getbyname: function () {
            this.$el.find('input:not(#user-name)').val('');
            var self = this;
            users.fetch({
                success: function (collection, response) {
                    var username = $('#user-name').val();
                    var theuser = _.filter(response, function (item) {

                        return item.name[0].value === username;
                    });

                    if(0 < theuser.length) {
                        var lastaccess = self.timeago(theuser[0].access[0].value);

                        $('#user-email').val(theuser[0].mail[0].value);
                        $('#user-access').val(lastaccess);
                    }
                    else {
                        alert('User not found!');
                    }
                }
            });
        },
        savechanges: function (collection, response) {

            var newEmail = $('#user-email').val();

            var users = new Users();
            users.fetch({
                success: function (collection, response) {
                    console.log(collection);


                    var username = $('#user-name').val();
                    var theuser = _.filter(collection.models, function (item) {
                        console.log(item);

                        return item.attributes.name[0].value === username;
                    });

                    console.log(theuser);


                    var uuid = theuser[0].get('uuid');
                    var uid = theuser[0].get('uid');
                    theuser[0].set({mail: {value: newEmail}});
                    theuser[0].set({id: uuid[0].value});

                    console.log(theuser[0]);

                    //var attrs = {id: uuid[0].value, mail: {value: newEmail}};
                    theuser[0].save(theuser[0].attributes, {patch: true});

                }
            });
        },
        convertdate: function (passeddate) {
            var timestamp = passeddate;
            if (timestamp != 0) {
                date = new Date(timestamp * 1000);

                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var hours = date.getHours();
                var mins = date.getMinutes();
                var datevalues = day + '/' + month + '/' + year;

                return datevalues;
            }
            else {
                return 'Never';
            }
        },
        timeago: function (date) {
            if (date != 0) {
                var seconds = Math.floor((new Date() - date) / 1000);

                var interval = Math.floor(seconds / 31536000);

                if (interval > 1) {
                    return interval + ' years';
                }
                interval = Math.floor(seconds / 2592000);
                if (interval > 1) {
                    return interval + ' months';
                }
                interval = Math.floor(seconds / 86400);
                if (interval > 1) {
                    return interval + ' days';
                }
                interval = Math.floor(seconds / 3600);
                if (interval > 1) {
                    return interval + ' hours';
                }
                interval = Math.floor(seconds / 60);
                if (interval > 1) {
                    return interval + ' minutes';
                }
                return Math.floor(seconds) + ' seconds';
            }
            else {
                return 'Never';
            }
        }
    });

    // Main View that combines all elements.
    var DashContainer = Backbone.View.extend({
        tagName: 'div',
        el: '#userdashboard',
        events: {
            'click .clear': 'cleartheview',
            'click #roles-filter': 'filterByRole',
            'click .sort-az': 'sortByAtoZ',
            'click .fetch': 'getusers'
        },
        initialize: function () {
            _.bindAll(this, 'render');
        },
        render: function (collection, response) {

            // Render User list view.
            var userList = new UserList();
            this.$el.append(userList.render(collection, response).el);

            // Render Buttons for controlling the user list view.
            var dashcontrol = new DashBoardControls();
            this.$el.prepend(dashcontrol.render(response).el);

            // Display total users in collection.
            var totalusers = _.size(response);
            $(this.el).prepend('<p>Total number of users: ' + totalusers + ' </p>');

            this.$el.prepend('<h2>Users by role</h2>');

            // Create user by role view but don't render until value selected.
            var userdisplay = new userDisplay({collection: collection, model: response});
            this.$el.prepend(userdisplay.render(collection, response).el);

        },
        cleartheview: function () {
            $('.user-list').empty();
        },
        getusers: function () {
            $('.user-list').empty();
            users.fetch({
                success: function (collection, response) {
                    var userList = new UserList();
                    userList.render(collection, response).el;
                }
            });
        },
        filterByRole: function () {
            $('.user-list').empty();
            users.fetch({
                success: function (collection, response) {
                    var userList = new UserList();
                    var selectedrole = $('#roles-select').val();
                    var groupadmin = [];

                    _.filter(response, function (obj) {
                        console.log(obj);
                            if (obj.roles && obj.roles[0].target_id === selectedrole) {
                                groupadmin.push(obj);
                            }
                            return groupadmin;
                    });
                    return userList.render(collection, groupadmin).el;
                }
            });
        },
        sortByAtoZ: function () {
            $('.user-list').empty();
            users.fetch({
                success: function (collection, response) {

                    var userList = new UserList();

                    var sorted = _.sortBy(response, function (item) {
                        return item.name[0].value;
                    });
                    return userList.render(collection, sorted).el;
                }
            });
        }
    });

    var UserNodesView = Backbone.View.extend({
        className: 'user-node',
        initialize: function () {
            _.bindAll(this, 'render');
        },
        render: function (collection, response) {

            // Node vs user stats view.
            var nodes = new Nodes();
            //var userNodesView = new UserNodesView();
            //this.$el.prepend(userNodesView.render(collection, response).el);


            console.log(response);
        }
    });
})(jQuery);
