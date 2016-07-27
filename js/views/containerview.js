// Main View that combines all elements.
    var DashContainer = Backbone.View.extend({
        tagName: 'div',
        el: '#userdashboard',
        initialize: function () {
            _.bindAll(this, 'render');
        },
        render: function (collection, response) {

            // Render User list view.
            var userList = new UserList({model: response});
            $('#userlist').append(userList.render(collection, response).el);

            // Render Buttons for controlling the user list view.
            var dashcontrol = new DashBoardControls();
            $('#userlist').prepend(dashcontrol.render(response).el);

            // Display total users in collection.
            var totalusers = _.size(response);
            $('#userlist').prepend('<p>Total number of users: ' + totalusers + ' </p>');

            // Create user by role view but don't render until value selected.
            var userdisplay = new userDisplay({collection: collection, model: response});
            this.$el.prepend(userdisplay.render(collection, response).el);

            // Create user by role view but don't render until value selected.
            var userRolesView = new UserRolesView({collection: collection, model: response});
            $('#userdashboard-wrapper').append(userRolesView.render(collection, response).el);

        }
    });
