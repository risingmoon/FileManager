from flask import Flask, jsonify, Response
import json
import posixpath
import os

app = Flask(__name__)
ROOT = "/home/justin/"

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    path = ROOT + path 
    return Response(
        response=json.dumps(list_directory(path),indent=2),
        mimetype="application/json")

def list_directory(path):
    """Helper to produce a directory listing (absent index.html).
    Return value is either a file object, or None (indicating an
    error).  In either case, the headers are sent, making the
    interface the same as for send_head().
    """
    directory = []
    try:
        contents  = os.listdir(path)
    except os.error:
        return None
    contents.sort(key=lambda a: a.lower())
    for name in contents:
        fullname = os.path.join(path, name)
        content = href = name
        # Append / for directories or @ for symbolic links
        if os.path.isdir(fullname):
            content = name + "/"
            href = "/" + name + "/"
        if os.path.islink(fullname):
            content = name + "@"
        directory.append({
            "content": content,
            "href": href
        })
    return directory 

if __name__ == "__main__":
    app.run(debug=True)
