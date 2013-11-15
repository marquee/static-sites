from folio import Folio
proj = Folio(__name__, source_path='viewer', jinja_extensions=['content_object_tag.ContentObjectTagExtension'])
proj.build()