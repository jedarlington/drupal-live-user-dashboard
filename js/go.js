/**
 * Created by jmdrawneek on 22/07/2016.
 */
require.config({
    baseUrl: "/modules/user_dashboard/js/",
    waitSeconds: 6000,
    paths: {
        Charts: 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.6/Chart.bundle',
        jQuery : 'https://code.jquery.com/jquery-3.1.0.min',
        underscore: 'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.2.1/underscore-min'
    }
});


requirejs(
    ['jQuery',
        'underscore',
        'Charts',
        'models/user',
        'views/containerview',
        'views/listusers',
        'views/userview',
        'views/userdisplay',
        'views/userrolesview'
    ], function ($, _, Charts) {

    $ = require('jQuery');
    _ = require('underscore');
    ///////// AUTH STUFF

    // Get the CSRF Token and add it to the window object.

    function getuserinfo() {
        jQuery
            .get(Drupal.url('user'))
            .done(function (data) {
                //console.log(data);
            });
    }

    getuserinfo();


    function getCsrfToken() {
        jQuery
            .get(Drupal.url('rest/session/token'))
            .done(function (data) {
                window.csrfToken = data;
            });
    }

    // USERS
    // Model




    // Collection


    // Create a new instance of a user and fetch from the server.
    require(['collections/users'], function () {
        var users = new Users();
        users.fetch({
            success: function (collection, response) {
                var newdash = new DashContainer({collection: collection});
                newdash.render(collection, response);
            }
        });
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
            // console.log(collection);
        }
    });

    var UserRolesView = Backbone.View.extend({
        className: 'user-roles',
        initialize: function () {
            _.bindAll(this, 'render');
        },
        render: function (collection, response) {
            element.collection = collection;

        }
    });
});
