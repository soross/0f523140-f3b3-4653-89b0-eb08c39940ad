from bottle import route, run, debug, template, request, validate, error, response, redirect

@route('/apply/sent')
@route('/apply/sent/show')
def apply_sent_show():
    return template('home')
    
@route('/apply/sent/add/:tweet_id')
def apply_sent_add(tweet_id):
    return template('home')

@route('/apply/sent/exist/:tweet_id')
def apply_sent_exist(tweet_id):
    return template('home')

@route('/apply/sent/count')
def apply_sent_count():
    return template('home')

@route('/apply/sent/delete/:tweet_id')
def apply_sent_delete(tweet_id):
    return template('home')
