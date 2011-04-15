from bottle import route, run, debug, template, request, validate, error, response, redirect

@route('/admin/')
def admin():
    return template("home")

@route('/admin/tag')
def admin_tag():
    return template("home")

@route('/admin/tag/edit')
def admin_tag():
    return template("home")
