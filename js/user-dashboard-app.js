$(function() {

  // Define the model
  User = Backbone.Model.extend();

  // Define the collection
  Users = Backbone.Collection.extend ({
    model: User,

    // Url to request when fetch() is called
    url: 'http://drupal8.drupalvm.dev/user',

    parse: function(response) {
      return response.results;
    },

    // Overwrite the sync method to pass over the Same Origin Policy
  });


  var app = new UsersView({
    // Define the el where the view will render
    el: $('body')
  });
});