// Individual user view.

var UserView = Backbone.View.extend({
    tagName: 'li',
    className: 'user',
    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
    },
    render: function () {
        var element = $(this.el);
        // Clear potential old entries first

        element.empty();
        function getname(model) {
            var thename = _.flatten(_.map(model.name, _.values));
            var theroles = _.flatten(_.map(model.roles, _.values)).join(', ');
            console.log(theroles);
            if (_.flatten(_.map(model.uid, _.values)) == '0') {
                thename = 'anonymous';
            }
            if (!theroles) {
                theroles = 'No roles';
            }
            var output = '<span class="name">' + thename + '</span>' + '<span class="roles">Roles: ' + theroles + '</span>';
            return output;
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