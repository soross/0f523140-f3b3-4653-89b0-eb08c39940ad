from bottle import route, run, debug, template, request, validate, error, response, redirect

@route('/')
@route('/home')
def home():
    return 'Ybole - Python backend ... Coming soon!'
