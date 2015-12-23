var app = app || {};

app.Router = Backbone.Router.extend({
  routes: {
    "*path": "open",
  },
  open: function(path) {
    console.log("FOLDER:" + path);
    console.log(path.split('/')); 
  },
  file: function(path) {console.log("FILE:" + path);}
});

var Router = new app.Router();
Backbone.history.start();

//File Model
app.File = Backbone.Model.extend({
  url: function () {
    return '/file' + this.id;
  }
});

//Folder Model
app.Folder = Backbone.Model.extend({
  url: function (){
    return '/folder' + this.id;
  },
  parse: function(response){
    this.folders = new app.Folders(response.folders ? response.folders : {});
    this.files = new app.Files(response.files ? response.files : {});
  }
});

//Files Collection
app.Files = Backbone.Collection.extend({
  model: app.File,
  url: "/file"
});

//Folders Collection
app.Folders = Backbone.Collection.extend({
  model: app.Folder,
  url: "/folders"
});

//File View
app.FileView = Backbone.View.extend({
  model: app.File,
  id: this.model,
  tagName: 'li',
  template: _.template( $('#fileTemplate').html() ),
  className: 'file',
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },
  render: function() {
    this.$el.html(this.template({
      id: this.model.get('id'),
      href: '#' + this.model.get('id'),
      name: this.model.get('name'),
    }));
    return this;
  }
});

app.FolderView = app.FileView.extend({
  template: _.template( $('#folderTemplate').html() ),
  model: app.Folder,
  className: 'folder',
  events: {
    'click span': 'toggle',
  },
  toggle: function (e) {
    e.stopPropagation();
    if( !this.model.folders) {
      var view = new app.FoldersView({model: this.model});
      this.$el.append(view.el);
    } else {
      this.$el.children('ul').toggle();
    }
    this.$('span')
	.toggleClass("glyphicon glyphicon-folder-open glyphicon glyphicon-folder-close");
  }
});

//Folder View
app.FoldersView = Backbone.View.extend({
  tagName: 'ul',
  model: app.Folder,
  initialize: function() {
    this.listenTo(this.model.folders, 'add', this.renderFolder);
    this.listenTo(this.model.files, 'add', this.renderFile);
    this.listenTo(this.model, 'sync', this.render);

    this.model.fetch();
  },
  renderFile: function(file) {
    this.$el.append( new app.FileView({model: file}).render().el );  
  },
  renderFolder: function(folder) {
    this.$el.append( new app.FolderView({model: folder}).render().el );  
  },
  render: function() {
    this.model.folders.each(function(folder) {
      this.renderFolder(folder);
    },this);
    this.model.files.each(function(file) {
      this.renderFile(file);
    },this);
   return this;
  }
});

//File View
//app.FileView = Backbone.View.extend({
//  id: function() {
//    return this.model.get('id');
//  },
//  tagName: 'li',
//  model: app.File,
//  template: _.template( $('#fileTemplate').html() ),
//  className : function() {
//    return this.model.get('id').endsWith('/') ? 'folder': 'file'
//  },
//  events: {
//    'click span': 'toggle',
//  },
//  toggle: function (e) {
//    e.stopPropagation();
//    if( !this.model.collection) {
//      console.log("Add collection");
//      this.$el.append(new app.FolderView({model: this.model}).render().el);
//    } else {
//      this.$el.children('ul').toggle();
//    }
//    this.$('a span')
//	.toggleClass("glyphicon glyphicon-folder-open glyphicon glyphicon-folder-close");
//  },
//  initialize: function() {
//    this.listenTo(this.model, 'change', this.render);
//  },
//  render: function() {
//    this.$el.html(this.template({
//      id: "/" + this.model.get('id'),
//      href: '#' + this.model.get('id'),
//      file: this.model.get('name'),
//      folder: this.className() === 'folder'
//    }));
//    return this;
//  }
//});
//
////Folder View
//app.FoldersView = Backbone.View.extend({
//  tagName: 'ul',
//  initialize: function() {
//    this.model.collection = new app.Folder();
//    this.model.collection.url = "/folder" + this.model.get('id');
//    this.model.collection.fetch();
//    this.listenTo(this.model.collection, 'add', this.renderFile);
//    this.listenTo(this.model.collection, 'reset', this.render);
//  },
//  renderFile: function(file) {
//    this.$el.append( new app.FileView({model: file}).render().el );  
//  },
//  render:function() {
//    this.model.collection.each(function(file) {
//      this.renderFile(file);
//    },this);
//   return this;
//  }
//});
