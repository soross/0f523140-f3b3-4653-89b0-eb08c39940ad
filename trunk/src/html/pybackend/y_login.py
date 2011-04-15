from bottle import route, run, debug, template, request, validate, error, response, redirect
from y_common import *
from weibopy import OAuthHandler

@route('/login')
def login():
    redirect('/sina/login')
    
@route('/sina/login')
def sina_login():
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth_url = self.auth.get_authorization_url()
    redirect(auth_url)
