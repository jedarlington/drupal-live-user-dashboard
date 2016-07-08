$(function () {

  //// Define the model
  //var Node = Backbone.Model.extend();
  //
  //// Define the collection
  //var Nodes = Backbone.Collection.extend({
  //  model: Node,
  //  // Url to request when fetch() is called
  //  url: 'http://drupalvm.dev/rest/view/article',
  //  parse: function (response) {
  //    return response.results;
  //  },
  //  // Overwrite the sync method to pass over the Same Origin Policy
  //  sync: function (method, model, options) {
  //    var that = this;
  //
  //    var params = _.extend({
  //      type: 'GET',
  //      dateType: 'jsonp',
  //      url: that.url,
  //      processData: false
  //    }, options);
  //
  //    return $.ajax(params);
  //  }
  //});
  //
  //// Define the view
  //var NodesView = Backbone.View.extend({
  //  initialize: function() {
  //    _.bindAll(this, 'render');
  //    // Create a collection
  //    this.collection = new Nodes;
  //    // Fetch the collection and call the render() method
  //    var that = this;
  //    this.collection.fetch({
  //      success: function() {
  //        that.render();
  //      }
  //    });
  //  },
  //
  //  // Use an external template
  //  template: _.template($('#nodeTemplate').html()),
  //
  //  render: function() {
  //    // Fill the html with the template and the collection
  //    $(this.el).html(this.template({
  //      nodes: this.collection.toJSON()
  //    }));
  //  }
  //});
  //
  //var app = new NodesView({
  //  // Define the el where the view will render
  //  el: $('body')
  //});

  //var NodeView = Backbone.View.extend({
  //  el: '#nodes',
  //  template: _.template($('#nodeTemplate').html()),
  //
  //  render: function (eventName) {
  //    _.each(this.model.models, function (node) {
  //      var nodeTemplate = this.template(node.toJSON());
  //      console.log(nodeTemplate);
  //
  //      $(this.el).append(nodeTemplate);
  //    }, this);
  //
  //    return this;
  //  }
  //});
  //
  //var nodes = new NodeList();
  //
  //var nodesView = new NodeView({
  //  model: nodes
  //});
  //
  //nodes.fetch({
  //  success: function () {
  //    nodesView.render();
  //    console.log(nodes);
  //  },
  //  error: function () {
  //    console.log('Nodes could not be retrieved!');
  //  }
  //});

});

