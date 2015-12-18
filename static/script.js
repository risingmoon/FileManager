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
app.ContentsList = Backbone.Collection.extend({
  model: app.Content,
});

app.Contents = new app.ContentsList();
app.ContentView = Backbone.View.extend({
  tagName: 'li',
  template: _.template( $('#fileTemplate').html() ),
  render: function(){
    var path = this.model.get('path');
    var parts = path.split('/');
    var name = path.endsWith('/') ? parts[parts.length-2] + '/': parts.pop() 
    this.$el.html(this.template({
      id: path,
      href: 'http://' + window.location.host + '/#/' + path,
      content: name
    }));
    return this;
  }
});

app.FolderView = app.ContentView.extend({
  className: 'folder-close',
  events: {
    'click': 'openFolder'
  },
  openFolder: function(){
    this.$el.append('<ul></ul>');
    this.$filelist = this.$('ul');
    this.collection = new app.ContentsList();
    this.collection.url = '/folder/' + this.model.get('path')
    this.collection.fetch();
    //this.render();

    this.listenTo( this.collection, 'add', this.renderContent );
    this.listenTo( this.collection, 'reset', this.renderFolder );
    console.log(this.collection.url);
  },
  renderFolder: function() {
    this.$filelist.show();
    this.collection.each(function( item ) {
      this.renderContent( item );
      }, this );
  },

  renderContent: function( item ) {
    var contentView = item.get('path').endsWith('/') ? app.FolderView : app.FileView;
    this.$filelist.append( new contentView({model:item}).render().el);
  },

  render: function(){
    var path = this.model.get('path');
    var parts = path.split('/');
    var name = parts[parts.length-2] + '/' 
    this.$el.html(this.template({
      id: path,
      href: 'http://' + window.location.host + '#folder/' + path,
      content: name
    }));
    return this;
  }
});

app.FileView = app.ContentView.extend({
  className: "file",
  render: function(){
    var path = this.model.get('path');
    var parts = path.split('/');
    var name = parts[parts.length-1] 
    this.$el.html(this.template({
      id: path,
      href: 'http://' + window.location.host + '#file/' +  path, 
      content: name
    }));
    return this;
  }
});

app.AppView = Backbone.View.extend({
  el: 'div#browser',

  initialize: function() {
    this.$el.append('<ul></ul>');
    this.$filelist = this.$('ul');
    this.collection = new app.ContentsList();
    this.collection.url = '/folder/';
    //this.collection.url = '/folder' + window.location.pathname;
    this.collection.fetch();
    this.render();

    this.listenTo( this.collection, 'add', this.renderContent );
    this.listenTo( this.collection, 'reset', this.render );
  },

  render: function() {
    this.$filelist.show();
    this.collection.each(function( item ) {
      this.renderContent( item );
      }, this );
  },

  renderContent: function( item ) {
    var contentView = item.get('path').endsWith('/') ? app.FolderView : app.FileView;
    this.$filelist.append( new contentView({model:item}).render().el);
  }

});

