//APP
window.App = Ember.Application.create();

App.ApplicationSerializer = DS.LSSerializer.extend();
App.ApplicationAdapter = DS.LSAdapter.extend({
  namespace: 'app-emberjs'
});

//ROUTER
App.Router.map(function() {
  this.resource('book', { path: '/books/:book_id' });
});

//ROUTES
App.IndexRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('book');
  }
});

App.BookRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('book', params.book_id)
  }
})



//MODELS
App.Book = DS.Model.extend({
  title: DS.attr(),
  author: DS.attr(),
  review: DS.attr(),
  rating: DS.attr('number'),
  amazon_id: DS.attr(),
  url: function() {
    return "http://www.amazon.com/gp/products/"+this.get('amazon_id');
  }.property('amazon_id'),
  image: function() {
    return "http://www.amazon.com/gp/images/P/"+this.get('amazon_id')+".01.ZTZZZZZZ.jpg";
  }.property('amazon_id')
});


//CONTROLLERS

App.BooksController = Ember.ArrayController.extend({
  sortProperties: ['bookName'],
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
