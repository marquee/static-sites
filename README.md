Content API + Static Generator prototype

1. Install compiler requirements: `pip install -r requirements.txt`
2. Create a `.env` file with `CONTENT_API_TOKEN` and `CONTENT_API_ROOT` settings
    * Optionally, add `DEBUG=True` to `.env` to generate placeholder text.
3. Serve the editor: `cd editor && python -m SimpleHTTPServer`
4. Set the token: `localStorage['editorial:CONTENT_API_TOKEN'] = '<token>'`
5. Add content
6. Modify the layout in `viewer/index.html`
7. Compile: `python compile.py`