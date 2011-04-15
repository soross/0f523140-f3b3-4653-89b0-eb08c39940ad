#coding:utf8
import os, sys, re, base64, json
from bottle import route, run, debug, template, request, validate, error, response, redirect
# only needed when you run Bottle on mod_wsgi
from bottle import default_app

htmlCodes = [
    ['&', '&amp;'],
    ['<', '&lt;'],
    ['>', '&gt;'],
    ['"', '&quot;'],
]
def htmlEncode(s, codes=htmlCodes):
    """ Returns the HTML encoded version of the given string. This is useful to
        display a plain ASCII text string on a web page."""
    for code in codes:
        s = s.replace(code[0], code[1])
    return s

def jsonencode(x):
    data = dict(x)
    return json.dumps(data)

reload(sys)
sys.setdefaultencoding('utf-8')

@route('/')
def root():
    return 'Ybole - Python backend ... Coming soon!'

debug(True)

def main():
    run(reloader=True);

if __name__ == "__main__":
    # Interactive mode
    main()
else:
    # Mod WSGI launch
    os.chdir(os.path.dirname(__file__))
    application = default_app()
