import re, base64, json

def htmlEncode(str):
    """ Returns the HTML encoded version of the given string. This is useful to
        display a plain ASCII text string on a web page."""
    htmlCodes = [
        ['&', '&amp;'],
        ['<', '&lt;'],
        ['>', '&gt;'],
        ['"', '&quot;'],
    ]
    for orig, repl in htmlCodes:
        str = str.replace(orig, repl)
    return str

def jsonencode(x):
    data = dict(x)
    return json.dumps(data)
