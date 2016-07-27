// View for viewing individual user nodes.

var userDisplay = Backbone.View.extend({
    className: 'addUser',
    events: {
        'click .getbyname': 'getbyname',
        'click .savechanges': 'savechanges'
    },
    initialize: function (collection, response) {
        _.bindAll(this, 'render');

        var element = $(this.el);
        // Clear potential old entries first
        element.empty();

        element.collection = collection;

        element.append('<label for="user-name">User name:</label><input type="text" id="user-name" name="user-name" value="">');
        element.append('<label for="user-access">Last access time:</label><time id="user-access" datetime="" class=" "></time>');
        element.append('<label for="user-email">Email Address:</label><input type="email" id="user-email" name="user-email" value="">');
        element.append('<ul id="user-roles"></ul>');
        element.append('<input type="hidden" id="user-uuid" name="user-uuid" value="">');
        element.append('<br /><button class="getbyname">Get User by name</button>\n');
        element.append('<br /><button class="savechanges">Save</button>\n');
    },
    render: function (collection, response) {
        var element = $(this.el);
        // Clear potential old entries first
        //element.empty();

        element.collection = collection;


        return this;
    },
    getbyname: function () {
        // Clear all other input values.
        this.$el.find('input:not(#user-name)').val('');
        var self = this;
        var users = new Users();
        users.fetch({
            success: function (collection, response) {
                console.log(collection);

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

                    // Get user roles to add to populate the field.
                    var setroles = _.flatten(_.map(theuser[0].roles, _.values));

                    _.each(setroles, function (role, key) {
                                $('#user-roles').append('<li>' + role + '</li>');
                    });

                    // Get all user roles for use with autocomplete.

                    var allroles =[];

                    _.each(response, function (model, key) {
                        if (model.roles) {
                            var therole = model.roles[0].target_id;
                            allroles.push(therole);
                        }
                    });

                    // Remove any duplicates.
                    allroles = (_.uniq(allroles));

                    // Add them to the tagit autocomplete field.
                    $('#user-roles').tagit({
                        autocomplete: {delay: 0, minLength: 2},
                        availableTags: allroles,
                        singleField: true,
                        placeholderText: 'Add role'
                    });

                    $('#user-roles').prepend('<label for="user-roles">Roles: </label>');

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
        var newroles = $('input[name="tags"]').val().split(',');;

        var formattedroles = [];
        
        _.each(newroles, function (role, key) {
            formattedroles[key] = {target_id: role};
        });

        console.log(formattedroles);

        var saveusers = new Users();
        saveusers.fetch({
            success: function (collection, response) {
                var useruuid = $('#user-uuid').val();
                var theuser = _.filter(collection.models, function (item) {
                    return item.attributes.uuid[0].value === useruuid;
                });

                var roles = formattedroles;
                // Create object to save back to entity.
                var updates = {
                    _links: theuser[0].get('_links'),
                    mail: {
                        value: newEmail
                    },
                    name: {
                        value: newUsername
                    },
                    roles
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