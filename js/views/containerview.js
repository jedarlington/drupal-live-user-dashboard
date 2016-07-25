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
        var userNodesView = new UserNodesView({collection: collection, model: response});
        $('#userdashboard-wrapper').append(userNodesView.render(collection, response).el);

    },
    cleartheview: function () {
        jQuery('.user-list').empty();
    },
    getusers: function () {
        jQuery('.user-list').empty();
        users.fetch({
            success: function (collection, response) {
                var userList = new UserList();
                userList.render(collection, response).el;
            }
        });
    },
    filterByRole: function () {
        jQuery('.user-list').empty();
        users.fetch({
            success: function (collection, response) {
                var userList = new UserList();
                var selectedrole = jQuery('#roles-select').val();
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
        jQuery('.user-list').empty();
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