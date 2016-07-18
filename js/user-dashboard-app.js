(function ($) {

    // Model
    var User = Backbone.Model.extend({ });

    // Collection
    var Users = Backbone.Collection.extend({
        model: User,
        url: 'userdash/user/data'
    });

    var users = new Users();
    users.fetch({
        success: function (collection, response) {
            var newdash = new DashContainer({collection: collection});
            newdash.render(collection, response);
        }
    });


    // Model
    var Node = Backbone.Model.extend({ });

    // Collection
    var Nodes = Backbone.Collection.extend({
        model: Node,
        url: '/userdash/data/node'
    });

    var nodes = new Nodes();
    nodes.fetch({
        success: function (collection, response) {
            //console.log(response);
        }
    });



    // Lust of Users view.
    var UserList = Backbone.View.extend({
        tagName: 'ul',
        className: 'user-list',
        events: {
            'click .reset'      : 'resettheview',
            'click #show-admin' : 'showadmin'
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
            function getname (model) {
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

            element.append('<button id="roles-filter">Filter users by role</button><select id="roles-select" name="roles"></select>\n' +
                '<button class="clear">Clear</button>\n' +
                '<button class="fetch">All</button>' +
                '<button class="sort-az">All Sorted a-z</button>\n');

            // Loop through all the models and create a userView for each item.
            _.each(response, function (model, key) {

                if (model.roles[0]) {
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
            users.fetch({
                success: function (collection, response) {
                    var username = $('#user-name').val();
                    var theuser = _.filter(response, function (item) {
                        return item.name[0].value === username;
                    });
                    //console.log(theuser);
                    //console.log(this);

                    $('#user-email').val(theuser[0].mail[0].value);
                    $('#user-access').val(theuser[0].access[0].value);
                }
            });
        },
        savechanges: function (collection, response) {

            var newEmail = $('#user-email').val();

            users.fetch({
                success: function (collection, response) {
                    console.log(collection);
                    var username = $('#user-name').val();
                    var theuser = _.filter(response, function (item) {
                        return item.name[0].value === username;
                    });
                    console.log(this);
                    //console.log(newEmail);
                    //theuser[0].mail[0].value = newEmail;
                    theuser[0].mail[0].value = newEmail;
                    //theuser.save();

                }
            });
            console.log(theuser);

            //users;
        }
    });

    // Main View that combines all elements.
    var DashContainer = Backbone.View.extend({
        tagName: 'div',
        el: '#userdashboard',
        events: {
            'click .clear'        : 'cleartheview',
            'click #roles-filter' : 'filterByRole',
            'click .sort-az'      : 'sortByAtoZ',
            'click .fetch'        : 'getusers'
        },
        initialize: function () {
            _.bindAll(this, 'render');
        },
        render: function (collection, response) {


            var userList = new UserList();
            this.$el.append(userList.render(collection, response).el);

            var dashcontrol = new DashBoardControls();
            this.$el.prepend(dashcontrol.render(response).el);

            var totalusers = _.size(response);
            $(this.el).prepend('<p>Total number of users: ' + totalusers + ' </p>');

            this.$el.prepend('<h2>Users by role</h2>');

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
                        if (obj.roles[0] && obj.roles[0].target_id === selectedrole) {
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


})(jQuery);