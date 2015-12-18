from flask import Flask, jsonify, Response, render_template, send_file, request
import json
import posixpath
import os

app = Flask(__name__)
ROOT = "/home/justin/"

from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper


@app.route('/folder/', defaults={'path': ''})
@app.route('/folder/<path:path>')
def folder(path):
    return Response(
        response=json.dumps(list_directory(path),indent=2),
        mimetype="application/json")


@app.route('/')
def index():
    return render_template('index.html')


def list_directory(filepath):
    """Helper to produce a directory listing (absent index.html).
    Return value is either a file object, or None (indicating an
    error).  In either case, the headers are sent, making the
    interface the same as for send_head().
    """
    fullfilepath = ROOT + filepath
    directory = []
    try:
        contents  = os.listdir(fullfilepath)
    except os.error:
        return None
    contents.sort(key=lambda a: a.lower())
    for name in contents:
        filename = os.path.join(filepath, name)
        # Append / for directories or @ for symbolic links
        filepathname = ROOT + filepath + name
        fullname= filename
        if os.path.isdir(filepathname):
            fullname += "/"
        if os.path.islink(filepathname):
            fullname += "@"
        directory.append({
            "path": fullname 
        })
    return directory 

if __name__ == "__main__":
    app.run(debug=True)
