from bottle import route, run, debug, template, request, validate, error, response, redirect
from y_common import *
from weibopy import OAuthHandler
from urllib import quote_plus

@route('/login')
def login():
    redirect('/sina/login')
    
@route('/sina/login')
def sina_login():
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth_url = auth.get_authorization_url() + "&oauth_callback=" + quote_plus(baseurl + "/sina/callback")
    redirect(auth_url)
