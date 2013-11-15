from jinja2 import nodes, Markup
from jinja2.ext import Extension

from content import Text, ContentObjects
import string, random

ENV = {}
for line in file('.env').read().split('\n'):
    key, val = line.split('=')
    ENV[key] = val

content_objects = ContentObjects(
        ENV['CONTENT_API_TOKEN'],
        api_root = ENV['CONTENT_API_ROOT'],
    )

class ContentObjectTagExtension(Extension):
    """
    Usage:

        {% content_objects 'name',[start[,end]] %}

    """
    tags = set(['content_object'])

    def parse(self, parser):
        lineno = parser.stream.next().lineno
        args = [parser.parse_tuple()]
        return nodes.Output([
            self.call_method('_render', args),
        ]).set_lineno(lineno)

    def _render(self, tag_args):
        section_name    = tag_args[0]
        start           = None
        end             = None
        if len(tag_args) > 1:
            start = tag_args[1]
            if len(tag_args) > 2:
                end = tag_args[2]
        print section_name, start, end
        obj = content_objects.filter(type=Text, section_name=section_name)
        if obj:
            obj_content = obj[0].content.split(' ')[start:end]
            obj_content = u' '.join(obj_content)
        else:
            if ENV.get('DEBUG'):
                if not start:
                    start = 0
                if not end:
                    end = 300
                obj_content = u''.join([random.choice(string.letters + ' ' * 10) for i in range(end - start)])
            else:
                obj_content = u''
        return Markup(obj_content)

print content_objects