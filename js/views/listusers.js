// Parent view which generates individual user views.

var UserList = Backbone.View.extend({
    tagName: 'ul',
    className: 'user-list',
    initialize: function () {
        _.bindAll(this, 'render');
        console.log(this);
        //this.model.on('change', this.render, this);
    },
    render: function (collection, response) {
        var element = $(this.el);
        // Clear potential old entries first
        element.empty();
        element.append('<h2>Users by role</h2>');
        element.append('<div class="user-list-labels"><span class="username">Username</span><span class="roles">Roles </span> </div>');

        // Loop through all the models and create a userView for each item.
        _.each(response, function (value, key) {
            var userView = new UserView({model: value});
            element.append(userView.render(value).el);
        });
        $('#userlist').append(element);
        return this; // returning this for chaining..
    }
});
