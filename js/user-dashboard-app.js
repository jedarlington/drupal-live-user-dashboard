(function ($) {

    // Model
    var User = Backbone.Model.extend({ });

    // Collection
    var Users = Backbone.Collection.extend({
        model: User,
        url: 'userdash/data'
    });

    var users = new Users();
    users.fetch({
        success: function (collection, response) {
            var newdash = new DashContainer({collection: collection});
            newdash.render(collection, response);
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
            _.bindAll(this, 'render');
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
        render: function (model) {

            var element = $(this.el);
            // Clear potential old entries first
            element.empty();
            element.append(_.flatten(_.map(model.name, _.values)));

            return this;
        }
    });

    var DashBoardControls = Backbone.View.extend({
        className: 'controls',
        initialize: function () {
        },
        render: function () {
            $(this.el).append('<button id="show-admin">Show Admin</button>\n' +
                '<button class="clear">Clear</button>\n' +
                '<button class="fetch">Fetch</button>');
            return this;
        }
    });


    // Main View that combines all elements.
    var DashContainer = Backbone.View.extend({
        tagName: 'div',
        el: '#userdashboard',
        events: {
            'click .clear'      : 'cleartheview',
            'click #show-admin' : 'showadmin',
            'click .fetch'      : 'getusers'
        },
        initialize: function () {
            _.bindAll(this, 'render');
        },
        render: function (collection, response) {

            var userList = new UserList();
            this.$el.append(userList.render(collection, response).el);

            var dashcontrol = new DashBoardControls();
            this.$el.prepend(dashcontrol.render().el);

            var totalusers = _.size(response);
            $(this.el).prepend('<p>Total number of users: ' + totalusers + ' </p>');

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
        showadmin: function () {
            $('.user-list').empty();
            users.fetch({
                success: function (collection, response) {
                    var userList = new UserList();

                    var groupadmin = [];
                    _.filter(response, function (obj) {
                        if (obj.roles[0] && obj.roles[0].target_id === 'administrator') {
                            groupadmin.push(obj);
                        }
                        return groupadmin;
                    });
                    return userList.render(collection, groupadmin).el;

                }
            });
        }
    });


})(jQuery);