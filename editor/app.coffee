console.log 'app.coffee'

CONTENT_API_TOKEN   = localStorage['editorial:CONTENT_API_TOKEN']
CONTENT_API_ROOT    = 'http://marquee.by/content/'

{ Tags, Button, StringField, Form } = Doodad
{ Collection, Model }               = Backbone

# Set up Backbone.sync to include the authorization credentials.
oldSync = Backbone.sync
Backbone.sync = (method, model, options={}) ->
    options.headers ?= {}
    options.headers = _.extend {},
        'Authorization': "Token #{ CONTENT_API_TOKEN }"
    , options.headers
    return oldSync(method, model, options)


class Section extends Model
    url: -> if @get('url') then @get('url') else @collection.url()

class SectionCollection extends Collection
    model: Section
    url: -> CONTENT_API_ROOT + '?_sort=created_date'

newSectionForm = (model) ->
    form = new Form
        name    : 'section'
        model   : model
        layout  : [
            [ ['section_name'], ['remove_section'] ]
            [ ['content'] ]
        ]
        content: [
            new Button
                type    : 'text-bare'
                label   : 'Remove Section'
                name    : 'remove_section'
                spinner : 'replace'
                on: click: (self) ->
                    model.destroy()
                    form.$el.remove()
            new StringField
                label   : 'Section Name'
                name    : 'section_name'
                value   : model.get('section_name')
                on: blur: (self) ->
                    model.save(self.name, self.getValue())
            new StringField
                label   : 'Content'
                name    : 'content'
                value   : model.get('content')
                type    : 'multiline'
                on: blur: (self) ->
                    model.save(self.name, self.getValue())
        ]
    return form


newCreateSectionButton = ->
    button = new Button
        label: 'Add Section'
        on: click: ->
            sections.create(type: 'text')
    return button

$app = $('#app')

section_list = new Tags.DIV
    id: 'section_list'

$app.append(section_list.render())
$app.append(newCreateSectionButton().render())

sections = new SectionCollection()
sections.on 'add', (section) ->
    section_list.addContent(newSectionForm(section))
sections.on 'reset', ->
    sections.each (section) ->
        section_list.addContent(newSectionForm(section))
    section_list.render()

sections.fetch(reset: true)
window.SECTIONS = sections
