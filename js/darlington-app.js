(function ($) {

  /**
   * User
   */
  var users = [{name: 'Alisha'}, {name: 'Jim'}];

  // Model
  var User = Backbone.Model.extend({
    defaults: {
      name: 'Unknown'
    }
  });


  // Collection
  var Users = Backbone.Collection.extend({
    model: User
  });

  // API Collection
  //var UsersCollection = Backbone.Collection.extend({
  //  model: UserModel,
  //  url: 'http://drupal8.drupalvm.dev/userdash/data'
  //});
  //
  //var users = new UsersCollection;
  //
  //users.fetch({
  //  success : function(collection, response) {
  //    console.log(collection);
  //  },
  //
  //  error : function(collection, response) {
  //    console.log('Error Fetching Collection!');
  //  }
  //});


  // Views
  var UserView = Backbone.View.extend({
    tagName: 'div',
    className: 'userContainer',
    template: $('#userTemplate').html(),

    render: function () {
      var tmpl = _.template(this.template);

      this.$el.html(tmpl(this.model.toJSON()));

      return this;
    },

    events: {
      'click .deleteUser': 'deleteUser'
    },

    deleteUser: function () {
      this.model.destroy();
      this.remove();
    }
  });

  // Master view
  var UsersView = Backbone.View.extend({
    el: $('#users'),

    initialize: function () {
      this.collection = new Users(users);
      this.render();
      this.collection.on('add', this.renderUser, this);
      this.collection.on('remove', this.removeUser, this);
    },

    events: {
      'click #addUserButton': 'addUser'
    },

    render: function () {
      var that = this;

      _.each(this.collection.models, function (item) {
        that.renderUser(item)
      }, this);
    },

    addUser: function(e) {
      e. preventDefault();

      var formData = {};

      $('#addUser div').children('input').each(function(i, el) {
        if ($(el).val() !== "") {
          formData[el.id] = $(el).val();
        }
      });

      users.push(formData);

      this.collection.add(new User(formData));
    },

    removeUser: function (removedUser) {
      var removedUserData = removedUser.attributes;

      _.each(removedUserData, function(val, key) {
        if(removedUserData[key] === removedUser.defaults['key']) {
          delete removedUserData[key];
        }
      });

      _.each(users, function(user) {
        if(_.isEqual(user, removedUserData)) {
          users.splice(_.indexOf(users, user), 1);
        }
      });
    },

    renderUser: function (item) {
      var userView = new UserView({
        model: item
      });

      this.$el.append(userView.render().el);
    }
  });


  // Instantiation
  //var user = new User({
  //  name: 'Craig Perks'
  //});
  //
  //var userView = new UserView({
  //  model: user
  //});
  //
  //$('#users').html(userView.render().el);

  var usersView = new UsersView();

})(jQuery);