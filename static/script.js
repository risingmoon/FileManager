var app = app || {};

app.Content = Backbone.Model.extend({
  defaults: {
    path: ''
  }
});
app.ContentsList = Backbone.Collection.extend({
  model: app.Content,
  url: '/api' + window.location.pathname  
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
      href: 'http://' + window.location.host + '/' + path,
      content: name
    }));
    return this;
  }
});

app.FolderView = app.ContentView.extend({
  render: function(){
    var path = this.model.get('path');
    var parts = path.split('/');
    var name = parts[parts.length-2] + '/' 
    this.$el.html(this.template({
      id: path,
      href: 'http://' + window.location.host + '/' + path,
      content: name
    }));
    return this;
  }
});

app.FileView = app.ContentView.extend({
  render: function(){
    var path = this.model.get('path');
    var parts = path.split('/');
    var name = parts[parts.length-1] 
    this.$el.html(this.template({
      id: path,
      href: 'http://' + window.location.host + '/' +  path + "?type=file",
      content: name
    }));
    return this;
  }
});

app.AppView = Backbone.View.extend({
  el: '#filelist',

  initialize: function() {
    this.$filelist = this.$('#filelist');
    this.collection = new app.ContentsList();
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
    this.$el.append( new contentView({model:item}).render().el);
  }

});

