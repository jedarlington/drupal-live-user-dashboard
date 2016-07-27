// View that displays graph with number of users per role.

var UserNodesView = Backbone.View.extend({
    className: 'user-node',
    initialize: function () {
        _.bindAll(this, 'render');
    },
    render: function (collection, response) {

        var element = jQuery(this.el);
        // Clear potential old entries first
        element.empty();

        // Node vs users stats view.
        var collectUsers = [];


        // Collect all the roles into an array.
        _.each(collection.models, function (obj) {
            if (obj.attributes.uid && obj.attributes.uid[0].target_id) {
                collectUsers.push(obj.attributes.uid[0].target_id);
            }
            return collectUsers;
        });

        var contentCreators = _.uniq(collectUsers);
        var groupedcontent = [];

        var users = new Users();
        $.when(users.fetch()).done(function () {

            var usernames = [];

            var nodescreated = [];

            _.each(contentCreators, function (userid) {
                var nodebyuser = [];
                nodebyuser = _.filter(collection.models, function (obj) {
                    return obj.attributes.uid[0].target_id === userid;
                });


                // Count how many nodes the current users created.
                var numNodes = nodebyuser.length;

                // Get the user name by comparing the value of user to the user collection.
                var userentity = [];

                userentity = _.filter(users.models, function (userent) {
                    return userent.attributes.uid[0].value == userid;
                });

                _.each(users.models, function (obj) {
                    if (obj.attributes.uid[0].value == userid) {
                        if (userid === 0) {
                            usernames.push('anonymous');
                        }
                        else {
                            usernames.push(userentity[0].attributes.name[0].value);
                        }
                    }
                    return usernames;
                });


                var n = numNodes.toString();
                nodescreated.push(n);
                return nodescreated;

            });

            console.log(nodescreated);
            console.log(usernames);





        function getRandomColor() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        var colours = [];

        for (var property in contentCreators) {
            var newcolour = getRandomColor();
            colours.push(newcolour);
        }

        console.log(colours);


            var ctx = $('#user-node-chart');

            var userNodeChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: usernames,
                    datasets: [{
                        label: 'Nodes created by user',
                        data: nodescreated,
                        backgroundColor: colours,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                            }
                        }]
                    }
                }
            });


        });

            return this;

        }

});
