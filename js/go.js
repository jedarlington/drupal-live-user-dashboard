/**
 * Created by jmdrawneek on 22/07/2016.
 */
require.config({
    baseUrl: '/modules/user_dashboard/js/',
    waitSeconds: 6000,
    paths: {
        Charts: 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.6/Chart.bundle',
        jQuery: 'https://code.jquery.com/jquery-3.1.0.min',
        underscore: 'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.2.1/underscore-min',
        jqueryUI: 'https://code.jquery.com/ui/1.12.0/jquery-ui.min',
        jDrupal: '../../jdrupal/js/jdrupal.min'
    },
    shim: {
        jqueryUI: {
            exports: "$",
            deps: ['jQuery']
        }
    }
});


requirejs(
    ['jDrupal',
        'jQuery',
        'jqueryUI',
        'underscore',
        'Charts',
        'vendor/tag-it/js/tag-it',
        'models/user',
        'collections/users',
        'views/containerview',
        'views/listusers',
        'views/userview',
        'views/userdisplay',
        'views/userrolesview',
        'views/usernodesview'
    ], function (jD, $, _, Charts) {

        $ = require('jQuery');
        _ = require('underscore');
        jD = require('jDrupal');
        ///////// AUTH STUFF

        // Get the CSRF Token and add it to the window object.

        function getCsrfToken() {
            jQuery
                .get(Drupal.url('rest/session/token'))
                .done(function (data) {
                    window.csrfToken = data;
                });
        }
        getCsrfToken();

        function getuserinfo() {
            jQuery
                .get(Drupal.url('user'))
                .done(function (data) {
                });
        }


        jDrupal.config('sitePath', 'http://drupal8.drupalvm.dev/');

        jDrupal.connect().then(function() {
            // jDrupal.currentUser() is now ready...
            var account = jDrupal.currentUser();
            console.log('User id: ' + account.id());
        });


        // Create a new instance of a user and fetch from the server.
        var users = new Users();
        users.fetch({
            success: function (collection, response) {
                var newdash = new DashContainer({collection: collection});
                newdash.render(collection, response);
            }
        });


        // Model
        var Node = Backbone.Model.extend({});

        // Collection
        var Nodes = Backbone.Collection.extend({
            model: Node,
            url: '/userdash/data/node'
        });

        var nodes = new Nodes();
        nodes.fetch({
            success: function (collection, response) {
                // Create user by role view but don't render until value selected.
                var userNodesView = new UserNodesView({collection: collection, model: response});
                jQuery('#userdashboard-wrapper').append(userNodesView.render(collection, response));
            }
        });


    });
