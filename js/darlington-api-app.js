(function ($) {
  /**
   * Drupal user dashboard app using REST api
   */

  /**
   * Model
   */
  var User = Backbone.Model.extend({
    defaults: {
      name: 'Unknown'
    }
  });


  /**
   * Collection
   */
  var Users = Backbone.Collection.extend({
    model: User,
    url: 'http://drupal8.drupalvm.dev/userdash/data'
  });


  /**
   * Views
   */
  // Single user view
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
      //this.collection = new Users(users);
      this.collection = new Users();
      this.collection.fetch();
      console.log(this.collection.fetch());
      this.render();

      this.collection.on('add', this.renderUser, this);
      this.collection.on('remove', this.removeUser, this);
      this.collection.on('reset', this.render, this);
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

  var usersView = new UsersView();

})(jQuery);