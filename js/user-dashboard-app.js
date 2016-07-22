(function ($) {

    ///////// AUTH STUFF

    // Get the CSRF Token and add it to the window object.

    function getuserinfo () {
        jQuery
            .get(Drupal.url('user'))
            .done(function (data) {
                console.log(data);
            });

    };

    getuserinfo();


    function getCsrfToken() {
        jQuery
            .get(Drupal.url('rest/session/token'))
            .done(function (data) {
                window.csrfToken = data;
            });
    }

    getCsrfToken();
    console.log(window);


    // Model
    var User = Backbone.Model.extend({
        urlRoot: 'user',
        initialize: function () {
            this.set('id', this.attributes.uuid[0].value);
        },
        sync: function (method, model, options) {
            // Set authentication.
            options = options || (options = {});
            options.beforeSend = function (xhr) {
                var user = 'restuser';
                var pass = 'restuser';


                xhr.setRequestHeader('Content-Type', 'application/hal+json');
                xhr.setRequestHeader('Authorization', ('Basic ' + btoa(user + ':' + pass)));
                // Only send the token to relative URLs i.e. locally.
                if (!(/^http:./.test(Drupal.url.isLocal(window.location.href)) || /^https:./.test(Drupal.url.isLocal(window.location.href)))) {
                    xhr.setRequestHeader('X-CSRF-Token', window.csrfToken);
                }
            };

            // Remove duplicate id attributes (Not too sure why this is duplicated).
            delete this.attributes.id;

            switch (method) {
                case 'patch':
                    options.url = '../user/' + this.attributes.uid[0].value + '?_format=hal_json&DEBUG_SESSION_START=foobar';
                    break;
                case 'create':
                    options.url = '../user/' + this.attributes.uid[0].value + '?_format=hal_json&DEBUG_SESSION_START=foobar';
                    break;
            }
            return Backbone.sync.apply(this, arguments);
        },
        save: function(attrs, options) {
                options.patch = true;
            // Proxy the call to the original save function
            Backbone.Model.prototype.save.call(this, attrs, options);
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
           // console.log(collection);
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
            this.listenTo(this.model, 'change', this.render);
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
            element.append('<label for="user-access">Last access time:</label><time id="user-access" datetime="" class=" "></time>');
            element.append('<label for="user-email">Email Address:</label><input type="email" id="user-email" name="user-email" value="">');
            element.append('<input type="hidden" id="user-uuid" name="user-uuid" value="">');
            element.append('<br /><button class="getbyname">Get User by name</button>\n');
            element.append('<br /><button class="savechanges">Save</button>\n');
            return this;
        },
        getbyname: function () {
            // Clear all other input values.
            this.$el.find('input:not(#user-name)').val('');
            var self = this;
            users.fetch({
                success: function (collection, response) {
                    var username = $('#user-name').val();
                    // Filter out all models without the correct name (Needs logic for users with same name).
                    var theuser = _.filter(response, function (item) {
                        return item.name[0].value === username;
                    });

                    // Double check a user has been returned.
                    if(theuser.length > 0) {
                        var lastaccess = self.timeago(theuser[0].access[0].value);
                        $('#user-email').val(theuser[0].mail[0].value);
                        $('#user-access').text(lastaccess).attr('datetime', lastaccess);
                        if ($('#user-access').attr('datetime') != 'Never') {
                            $('#user-access').addClass('timeago');
                        }
                        $('#user-uuid').val(theuser[0].uuid[0].value);
                    }
                    else {
                        alert('User not found!');
                    }
                }
            });
        },
        savechanges: function (collection, response) {

            var newEmail = $('#user-email').val();
            var uuid = $('#user-uuid').val();
            var newUsername = $('#user-name').val();

            var saveusers = new Users();
            saveusers.fetch({
                success: function (collection, response) {
                    var useruuid = $('#user-uuid').val();
                    var theuser = _.filter(collection.models, function (item) {
                        return item.attributes.uuid[0].value === useruuid;
                    });

                    // Create object to save back to entity.
                    var updates = {
                    _links: theuser[0].get('_links'),
                    mail: {
                        value: newEmail
                    }, name: {
                        value: newUsername
                    }
                    };

                    theuser[0].save(updates, {
                        patch: true,
                        success: function () {
                            console.log('Save successful');
                    },
                        error: function (data, error) {
                            console.log(data);
                            console.log(error);
                        }
                    });

                }
            });
        },
        timeago: function (date) {
            if (date > 0) {
                return date;
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

            // Create user by role view but don't render until value selected.
            var userNodesView = new UserNodesView({collection: collection, model: response});
            this.$el.append(userNodesView.render(collection, response).el);

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

    var UserRolesView = Backbone.View.extend({
        className: 'user-roles',
        initialize: function () {
            _.bindAll(this, 'render');
        },
        render: function (collection, response) {
            element.collection = collection;
            console.log(collection);


        }
    });

    var UserNodesView = Backbone.View.extend({
        className: 'user-node',
        initialize: function () {
            _.bindAll(this, 'render');
        },
        render: function (collection, response) {

            var element = $(this.el);
            // Clear potential old entries first
            element.empty();

            // Node vs user stats view.
            console.log(collection.models);

            var adminroles = [];

            _.filter(response, function (obj) {
                console.log(obj);

                if (obj.roles && obj.roles[0].target_id) {
                    adminroles.push(obj.roles[0].target_id);
                }
                return adminroles;
            });

            var roles = {};
            adminroles.forEach(function(x) {
                roles[x] = (roles[x] || 0) + 1;
            });

            console.log(element);

            var rolename = [],
                numbers = [];

            for (var property in roles) {

                if (!roles.hasOwnProperty(property)) {
                    continue;
                }

                rolename.push(property);
                numbers.push(roles[property]);
            }

            console.log(rolename);
            console.log(numbers);

            function getRandomColor() {
                var letters = '0123456789ABCDEF'.split('');
                var color = '#';
                for (var i = 0; i < 6; i++ ) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            }

            var colours = [];

            for (var property in rolename) {
                var newcolour = getRandomColor();
                colours.push(newcolour);
            }

            console.log(colours);


            var ctx = $('#user-roles-chart');

                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: rolename,
                        datasets: [{
                            label: '# of Users',
                            data: numbers,
                            backgroundColor: colours,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    fixedStepSize: 1
                                }
                            }]
                        }
                    }
                });



            //var userNodesView = new UserNodesView();
            //this.$el.prepend(userNodesView.render(collection, response).el);
            return this;
        }
    });
})(jQuery);
