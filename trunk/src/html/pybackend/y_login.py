from bottle import route, run, debug, template, request, validate, error, response, redirect

@route('/login')
def login():
    redirect('/sina/login')
    
@route('/sina/login')
def sina_login():
    redirect('/sina/login')
