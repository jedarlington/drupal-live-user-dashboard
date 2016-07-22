var $ = jQuery;

var UserNodesView = Backbone.View.extend({
    className: 'user-node',
    initialize: function () {
        _.bindAll(this, 'render');
    },
    render: function (collection, response) {

        var element = jQuery(this.el);
        // Clear potential old entries first
        element.empty();

        // Node vs user stats view.

        var adminroles = [];

        _.filter(response, function (obj) {
            if (obj.roles && obj.roles[0].target_id) {
                adminroles.push(obj.roles[0].target_id);
            }
            return adminroles;
        });

        var roles = {};
        adminroles.forEach(function(x) {
            roles[x] = (roles[x] || 0) + 1;
        });

        var rolename = [],
            numbers = [];

        for (var property in roles) {

            if (!roles.hasOwnProperty(property)) {
                continue;
            }

            rolename.push(property);
            numbers.push(roles[property]);
        }

        function getRandomColor() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        var colours = [];

        for (var property in rolename) {
            var newcolour = getRandomColor();
            colours.push(newcolour);
        }


        var ctx = $('#user-roles-chart');

        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: rolename,
                datasets: [{
                    label: '# of Users',
                    data: numbers,
                    backgroundColor: colours,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fixedStepSize: 1
                        }
                    }]
                }
            }
        });
        return this;
    }
});