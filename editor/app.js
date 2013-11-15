// Generated by CoffeeScript 1.6.2
(function() {
  var $app, Button, CONTENT_API_ROOT, CONTENT_API_TOKEN, Collection, Form, Model, Section, SectionCollection, StringField, Tags, newCreateSectionButton, newSectionForm, oldSync, section_list, sections, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  console.log('app.coffee');

  CONTENT_API_TOKEN = localStorage['editorial:CONTENT_API_TOKEN'];

  CONTENT_API_ROOT = 'http://marquee.by/content/';

  Tags = Doodad.Tags, Button = Doodad.Button, StringField = Doodad.StringField, Form = Doodad.Form;

  Collection = Backbone.Collection, Model = Backbone.Model;

  oldSync = Backbone.sync;

  Backbone.sync = function(method, model, options) {
    var _ref;

    if (options == null) {
      options = {};
    }
    if ((_ref = options.headers) == null) {
      options.headers = {};
    }
    options.headers = _.extend({}, {
      'Authorization': "Token " + CONTENT_API_TOKEN
    }, options.headers);
    return oldSync(method, model, options);
  };

  Section = (function(_super) {
    __extends(Section, _super);

    function Section() {
      _ref = Section.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Section.prototype.url = function() {
      if (this.get('url')) {
        return this.get('url');
      } else {
        return this.collection.url();
      }
    };

    return Section;

  })(Model);

  SectionCollection = (function(_super) {
    __extends(SectionCollection, _super);

    function SectionCollection() {
      _ref1 = SectionCollection.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    SectionCollection.prototype.model = Section;

    SectionCollection.prototype.url = function() {
      return CONTENT_API_ROOT + '?_sort=created_date';
    };

    return SectionCollection;

  })(Collection);

  newSectionForm = function(model) {
    var form;

    form = new Form({
      name: 'section',
      model: model,
      layout: [[['section_name'], ['remove_section']], [['content']]],
      content: [
        new Button({
          type: 'text-bare',
          label: 'Remove Section',
          name: 'remove_section',
          spinner: 'replace',
          on: {
            click: function(self) {
              model.destroy();
              return form.$el.remove();
            }
          }
        }), new StringField({
          label: 'Section Name',
          name: 'section_name',
          value: model.get('section_name'),
          on: {
            blur: function(self) {
              return model.save(self.name, self.getValue());
            }
          }
        }), new StringField({
          label: 'Content',
          name: 'content',
          value: model.get('content'),
          type: 'multiline',
          on: {
            blur: function(self) {
              return model.save(self.name, self.getValue());
            }
          }
        })
      ]
    });
    return form;
  };

  newCreateSectionButton = function() {
    var button;

    button = new Button({
      label: 'Add Section',
      on: {
        click: function() {
          return sections.create({
            type: 'text'
          });
        }
      }
    });
    return button;
  };

  $app = $('#app');

  section_list = new Tags.DIV({
    id: 'section_list'
  });

  $app.append(section_list.render());

  $app.append(newCreateSectionButton().render());

  sections = new SectionCollection();

  sections.on('add', function(section) {
    return section_list.addContent(newSectionForm(section));
  });

  sections.on('reset', function() {
    sections.each(function(section) {
      return section_list.addContent(newSectionForm(section));
    });
    return section_list.render();
  });

  sections.fetch({
    reset: true
  });

  window.SECTIONS = sections;

}).call(this);
