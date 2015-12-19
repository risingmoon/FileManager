var app = app || {};

app.Router = Backbone.Router.extend({
  routes: {
    //"folder/*path": "folder",
    //"file/*path": "file"
  },
  folder: function(path) {console.log("FOLDER:" + path);},
  file: function(path) {console.log("FILE:" + path);}
});

var Router = new app.Router();
Backbone.history.start();

app.Content = Backbone.Model.extend({
  defaults: {
    path: ''
  }
});
app.ContentCollection = Backbone.Collection.extend({
  model: app.Content,
  url: "/folder/"
});

app.ContentView = Backbone.View.extend({
  tagName: 'li',
  template: _.template( $('#fileTemplate').html() ),
  events: {
    'click': 'toggle'
  },
  toggle: function() {
    this.$('span').toggleClass("glyphicon glyphicon-folder-open glyphicon glyphicon-folder-close");
  },
  render: function() {
    var path = this.model.get('path');
    var name = path;
    this.$el.html('<span class="glyphicon glyphicon-folder-open"></span>');
    this.$el.append(this.template({
      id: path,
      href: 'http://' + window.location.host + '/#/' + path,
      content: name
    }));
    return this;
  }
});

app.ContentsView = Backbone.View.extend({
  initialize: function() {
    this.collection = new app.ContentCollection();
    this.collection.fetch();
    this.listenTo(this.collection, 'add', this.renderContent);
    this.listenTo(this.collection, 'reset', this.render);
  },
  tagName: 'ul',
  render: function() {
    this.collection.each(function(item){
      this.renderContent(item);
    }, this);
  },
  renderContent: function(item) {
    this.$el.append(new app.ContentView({model:item}).render().el);
  }
});

