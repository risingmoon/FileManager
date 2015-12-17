var app = app || {};

app.File = Backbone.Model.extend({
  defaults: {
    path: ''
  }
});
app.FilesList = Backbone.Collection.extend({
  model: app.File,
  url: '/api' + window.location.pathname  
});

app.Files = new app.FilesList();
app.FileView = Backbone.View.extend({
  tagName: 'li',
  template: _.template( $('#fileTemplate').html() ),
  render: function(){
    var path = this.model.get('path');
    var parts = path.split('/');
    var name = path.endsWith('/') ? parts[parts.length-2]: parts.pop() 
    this.$el.html(this.template({
      id: path,
      href: 'http://' + window.location.host + '/' + path,
      content: name
    }));
    return this;
  }
});

app.AppView = Backbone.View.extend({
  el: '#filelist',

  initialize: function() {
    this.$filelist = this.$('#filelist');
    this.collection = new app.FilesList();
    this.collection.fetch();
    this.render();

    this.listenTo( this.collection, 'add', this.renderFile );
    this.listenTo( this.collection, 'reset', this.render );
  },

  render: function() {
    this.$filelist.show();
    this.collection.each(function( item ) {
      this.renderFile( item );
      }, this );
  },

  renderFile: function( item ) {
    var fileView = new app.FileView({
      model: item
      });
     this.$el.append( fileView.render().el);
  }

});

