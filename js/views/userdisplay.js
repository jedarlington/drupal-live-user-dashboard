// View for viewing individual user nodes.

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