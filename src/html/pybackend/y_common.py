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

consumer_key= "961495784"
consumer_secret ="47d9d806a1dc04cc758be6f7213465bc"
