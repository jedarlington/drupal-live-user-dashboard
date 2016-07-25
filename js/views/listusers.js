// Parent view which generates individual user views.

var UserList = Backbone.View.extend({
    tagName: 'ul',
    className: 'user-list',
    events: {
        'click .reset': 'resettheview',
        'click #show-admin': 'showadmin'
    },
    initialize: function () {
        _.bindAll(this, 'render');
        console.log(this);
        //this.model.on('change', this.render, this);
    },
    render: function (collection, response) {
        var element = jQuery(this.el);
        // Clear potential old entries first
        element.empty();

        element.append('<h2>Users by role</h2>');


        // Loop through all the models and create a userView for each item.
        _.each(response, function (value, key) {
            var userView = new UserView({model: value});
            element.append(userView.render(value).el);
        });

        // Add dashboard controls.
        var dashcontroller = new DashBoardControls();
        element.append(dashcontroller.render().el);



        return this; // returning this for chaining..
    }
});
