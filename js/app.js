$(function() {

  var Node = Backbone.Model.extend();

  var NodeList = Backbone.Collection.extend({
    model: Node,
    url: 'http://drupalvm.dev/rest/view/article'
  });

  var NodeView = Backbone.View.extend({
    el: '#nodes',
    template: _.template($('#nodeTemplate').html()),

    render: function(eventName) {
      _.each(this.model.models, function(node) {
        var nodeTemplate = this.template(node.toJSON());
        console.log(nodeTemplate);
        $(this.el).append(nodeTemplate);
      }, this);

      return this;
    }
  });

  var nodes = new NodeList();

  var nodesView = new NodeView({
    model: nodes
  });

  nodes.fetch({
    success: function() {
      nodesView.render();
      console.log(nodes);
    },
    error: function() {
      console.log('Nodes could not be retrieved!');
    }
  });

});

