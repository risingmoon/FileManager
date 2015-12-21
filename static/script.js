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

//File Model
app.File = Backbone.Model.extend({
});

//Folder Collection
app.Folder = Backbone.Collection.extend({
  model: app.File
});

//File View
app.FileView = Backbone.View.extend({
  id: function() {
    return this.model.get('id');
  },
  tagName: 'li',
  model: app.File,
  template: _.template( $('#fileTemplate').html() ),
  className : function() {
    return this.model.get('id').endsWith('/') ? 'folder': 'file'
  },
  events: {
    'click span': 'toggle',
  },
  toggle: function (e) {
    e.stopPropagation();
    if( !this.folder) {
      console.log("Add collection");
      this.folder = new app.FolderView({model: this.model});
      this.$el.append(this.folder.render().el);
    } else {
      this.$el.children('ul').toggle();
    }
    this.$('a span')
	.toggleClass("glyphicon glyphicon-folder-open glyphicon glyphicon-folder-close");
  },
  intialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },
  render: function() {
    this.$el.html(this.template({
      id: this.model.get('id'),
      href: '#' + this.model.get('id'),
      file: this.model.get('name'),
      folder: this.className() === 'folder'
    }));
    return this;
  }
});

//Folder View
app.FolderView = Backbone.View.extend({
  tagName: 'ul',
  initialize: function() {
    this.collection = new app.Folder();
    this.collection.url = "/folder/" + this.model.get('id');
    this.collection.fetch();
    this.listenTo(this.collection, 'add', this.renderFile);
    this.listenTo(this.collection, 'reset', this.render);
  },
  renderFile: function(file) {
    this.$el.append( new app.FileView({model: file}).render().el );  
  },
  render:function() {
    this.collection.each(function(file) {
      this.renderFile(file);
    },this);
   return this;
  }
});
