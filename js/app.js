App = Ember.Application.create();

App.ApplicationAdapter = DS.FixtureAdapter.extend({
});

App.BookDetailsComponent = Ember.Component.extend({
  classNameBindings: ['ratingClass'],
  ratingClass: function() {
    return "rating-" + this.get('book.rating');
  }.property("book.rating")
});

//ROUTER

App.Router.map(function() {
  this.resource('book', { path: '/books/:book_id' });
  this.resource('genre', { path: '/generes/:genre_id' });
  this.resource('reviews', function() {
    this.route('new');
  });
});

//ROUTES

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return Ember.RSVP.hash({
      books: this.store.find('book'),
      genres: this.store.find('genre')
    });
  },
  setupController: function(controller, model) {
    controller.set('books', model.books);
    controller.set('genres', model.genres);
  }
});

App.BookRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('book', params.book_id);
  }
});

App.ReviewsNewRoute = Ember.Route.extend({
  model: function() {
    return this.store.createRecord('book');
  }
});


//MODELS

App.Book = DS.Model.extend({
  title: DS.attr('string'),
  author: DS.attr('string'),
  review: DS.attr('string'),
  rating: DS.attr('number'),
  amazon_id: DS.attr(),
  genre: DS.belongsTo('genre', { async: true }),
  url: function() {
    return "http://www.amazon.com/dp/products/"+this.get('amazon_id');
  }.property('amazon_id'),
  image: function() {
    return "http://ec2.images-amazon.com/images/P/"+this.get('amazon_id')+".01.ZTZZZZZZ.jpg";
  }.property('amazon_id')
});

App.Genre = DS.Model.extend({
  name: DS.attr('string'),
  books: DS.hasMany('book', { async: true })
});

//FIXTURES

App.Book.FIXTURES = [
  {
    id: 1,
    title: 'Mindstorms',
    author: 'Seymour A. Papert',
    review: 'Although this book focuses on the cognitive advantages to having children use technology from an early age, it is also an in depth look at how people can learn for themseves. As someone who was often distracted and bored at times during school, Mindstorms highlights some of the reasoning behind that feeling and what we can do as teachers to help minimize it.',
    rating: 5,
    amazon_id: '0465046746',
    genre: 3
  },
  {
    id: 2,
    title: 'Hyperion',
    author: 'Dan Simmons',
    review: "Probably my favorite science fiction book (and series) I've ever read. Hyperion is written in a style similar to The Canterbury Tales, in which a series of stories are told by the main characters. Each story is a gem in itself, but alude to the larger storyline. The scope of the story is ambitious - spanning time, planets religion and love.",
    rating: 5,
    amazon_id: '0553283685',
    genre: 1
  },
  {
    id: 3,
    title: 'Economics in One Lesson',
    author: 'Henry Hazlitt',
    review: "I should have studied economics. Hazlitt's book is remarkably readable, coherent, and logical. It just confirms that truth is usually understandable, whereas complicated obfuscation is usually the major alarm bell that tips you off when people are trying to shaft you. This guy really knows his stuff. The one lesson is so simple that it takes about five minutes to read the chapter about it. The rest of the book lists various scenarios in which that lesson applies. The general principle of the lesson applies so naturally to various specific cases that it simplifies economics immensely.",
    rating: 5,
    amazon_id: '0517548232',
    genre: 3
  },
  {
    id: 4,
    title: "Jony Ive: The Genius Behind Apple's Greatest Products",
    author: 'Leander Kahney',
    review: "Even though I respect Ive, I felt this biography only hit skin deep. It went over all the major events in his life, his passion for design, awards he achieved -- but that's really it. I dont't feel I know him anymore than before reading this.",
    rating: 2,
    amazon_id: '159184617X',
    genre: 3
  }
];

App.Genre.FIXTURES = [
  {
    id: 1,
    name: 'Science Fiction',
    books: [2]
  },
  {
    id: 2,
    name: 'Fiction'
  },
  {
    id: 3,
    name: 'Non-Fiction',
    books: [1,3,4]
  },
  {
    id: 4,
    name: 'True Crime'
  },
  {
    id: 5,
    name: 'Young Adult'
  }
];

//CONTROLLERS

App.IndexController = Ember.Controller.extend({});

App.BooksController = Ember.ArrayController.extend({
  sortProperties: ['title'],
  actions: {
    createBook: function() {
      var bookName = this.get('newBook');
      if (!name.trim()) { return; }
      var book = this.store.createRecord('book', {
        bookName: bookName
      });
      this.set('newBook', '');
      book.save();
    }
  }
});

App.ReviewsNewController = Ember.Controller.extend({
  actions: {
    createReview: function() {
      var controller = this;
      this.get('model').save().then(function() {
        controller.transitionToRoute('index');
      });
    }
  }
});

App.GenresController = Ember.ArrayController.extend({
  sortProperties: ['name']
});


