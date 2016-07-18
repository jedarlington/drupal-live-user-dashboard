(function ($) {

  /**
   * Library
   */
  var books = [
    {title: "JS the good parts", author: "John Doe", releaseDate: "2012", keywords: "JavaScript Programming"},
    {title: "CS the better parts", author: "John Doe", releaseDate: "2012", keywords: "CoffeeScript Programming"},
    {title: "Scala for the impatient", author: "John Doe", releaseDate: "2012", keywords: "Scala Programming"},
    {title: "American Psyco", author: "Bret Easton Ellis", releaseDate: "2012", keywords: "Novel Splatter"},
    {title: "Eloquent JavaScript", author: "John Doe", releaseDate: "2012", keywords: "JavaScript Programming"}
  ];

  // Model
  var Book = Backbone.Model.extend({
    defaults: {
      coverImage: "img/placeholder.png",
      title: "Unknown",
      author: "Unknown",
      releaseDate: "Unknown",
      keywords: "None"
    }
  });


  // Collection
  var Library = Backbone.Collection.extend({
    model: Book
  });


  // Views
  var BookView = Backbone.View.extend({
    tagName: "div",
    className: "bookContainer",
    template: $("#bookTemplate").html(),

    render: function () {
      var tmpl = _.template(this.template); //tmpl is a function that takes a JSON object and returns html

      this.$el.html(tmpl(this.model.toJSON())); //this.el is what we defined in tagName. use $el to get access to jQuery html() function

      return this;
    }
  });

  var LibraryView = Backbone.View.extend({
    el: $("#books"),

    initialize: function () {
      console.log(this);
      this.collection = new Library(books);
      this.render();
      this.collection.on('add', this.renderBook, this);
    },

    events: {
      'click #addBookButton': 'addBook'
    },

    render: function () {
      var that = this;

      _.each(this.collection.models, function (item) {
        that.renderBook(item);
      }, this);
    },

    addBook: function(e) {
      e.preventDefault();

      var formData = {};

      $('#addBook div').children('input').each(function(i, el) {
        if ($(el).val() !== "") {
          formData[el.id] = $(el).val();
        }
      });

      books.push(formData);

      this.collection.add(new Book(formData));
    },

    renderBook: function (item) {
      var bookView = new BookView({
        model: item
      });
      this.$el.append(bookView.render().el);
    }
  });


  // Instantiation
  //var book = new Book({
  //  title: "Some title",
  //  author: "John Doe",
  //  releaseDate: "2012",
  //  keywords: "JavaScript Programming"
  //});
  //
  //var bookView = new BookView({
  //  model: book
  //});
  //
  //$("#books").html(bookView.render().el);

  var libraryView = new LibraryView();

})(jQuery);

