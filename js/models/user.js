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
    save: function (attrs, options) {
        options.patch = true;
        // Proxy the call to the original save function
        Backbone.Model.prototype.save.call(this, attrs, options);
    }
});

var Users = Backbone.Collection.extend({
    model: User,
    url: 'userdash/user/data?_format=hal_json'
});
