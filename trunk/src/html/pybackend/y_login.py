from bottle import route, run, debug, template, request, validate, error, response, redirect
from y_common import *
from weibopy import OAuthHandler
from urllib import quote_plus

@route('/login')
def login():
    redirect('/sina/login')
    
@route('/sina/login')
def sina_login():
    auth = OAuthHandler(sina_consumer_key, sina_consumer_secret)
    auth_url = auth.get_authorization_url() + "&oauth_callback=" + quote_plus(baseurl + "/sina/callback")
    redirect(auth_url)
    
@route('/sina/callback')
def sina_callback():
    oauth_token = request.GET.get('oauth_token')
    oauth_verifier = request.GET.get('oauth_verifier')
    auth = OAuthHandler(sina_consumer_key, sina_consumer_secret)
    token = auth.get_access_token(oauth_verifier, oauth_token)
    response.set_cookie("ybole_auth", token, secret = gng_secret)
    redirect('/')
