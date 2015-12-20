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
app.File = Backbone.Model.extend({});

//File Collection
app.Files = Backbone.Collection.extend({});

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
  intialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },
  render: function() {
    this.$el.html(this.template({
      id: this.model.get('id'),
      href: '#',
      file: this.model.get('id'),
      type: this.className()
    }));
    return this;
  }
});

//Folder View
app.FolderView = Backbone.View.extend({
  tagName: 'ul',
  intialize: function() {
    this.collection.fetch();
  },
  events: {
    'click li.folder': 'toggle'
  },
  toggle: function () {
    this.$('span').toggleClass("glyphicon glyphicon-folder-open glyphicon glyphicon-folder-close");
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
