(function () {

  // Model
  var User = Backbone.Model.extend({});

  // Collection
  var Users = Backbone.Collection.extend({
    model: User,
    url: 'userdash/data'

  });

  var users = new Users();


 var test = jQuery.getJSON('userdash/data?_format=hal_json');

  // var TestUser = new User({uid: 1});
  // TestUser.fetch({
  //   success: function (user) {
  //     // Check information retrived, could be used directly in a template
  //     console.log(user.attributes);
  //     console.log(user.attributes.mail[0].value);
  //   }
  // });


  console.log(users.fetch());

  //users.add([
  //  {id: 1, name: 'James'},
  //  {id: 2, name: 'Craig'}
  //]);
  //
  //console.log(users.get(1));
  //
  //var names = users.pluck('name');
  //
  //console.log(JSON.stringify(names));







  //// Define the model
  //User = Backbone.Model.extend();
  //
  //// Define the collection
  //Users = Backbone.Collection.extend({
  //  model: User,
  //
  //  // Url to request when fetch() is called
  //  url: 'http://drupal8.drupalvm.dev/user/1',
  //
  //  parse: function (response) {
  //    return response.results;
  //  },
  //
  //  // Overwrite the sync method to pass over the Same Origin Policy
  //  sync: function (method, model, options) {
  //    var that = this;
  //
  //    var params = _.extend({
  //      type: 'GET',
  //      dataType: 'json',
  //      url: that.url,
  //      processData: false
  //    }, options);
  //
  //    return $.ajax(params);
  //  }
  //});
  //
  //var users = new Users();
  //console.log(users);
  //
  //// Define the View
  //UsersView = Backbone.View.extend({
  //  initialize: function () {
  //    _.bindAll(this, 'render');
  //
  //    // Create a collection
  //    this.collection = new Users;
  //
  //    // Fetch the collection the call render() method
  //    var that = this;
  //
  //    this.collection.fetch({
  //      success: function () {
  //        that.render();
  //      }
  //    });
  //  },
  //
  //  // Use an external template
  //  template: _.template($('#usersTemplate').html()),
  //
  //  render: function () {
  //    // Fill the html with the template and the collection
  //    $(this.el).html(this.template({ users: this.collection.toJSON() }));
  //  }
  //});
  //
  //var app = new UsersView({
  //  // Define the el where the view will render
  //  el: $('body')
  //});

})();