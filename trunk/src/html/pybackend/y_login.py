#coding:utf8
from bottle import route, run, debug, template, request, validate, error, response, redirect
from y_common import *
from weibopy.auth import WebOAuthHandler

@route('/login')
def login():
    redirect('/sina/login')
    
@route('/sina/login')
def sina_login():
    auth = WebOAuthHandler(sina_consumer_key, sina_consumer_secret)
    auth_url = auth.get_authorization_url_with_callback(baseurl + "/sina/callback/" + auth.request_token)
    redirect(auth_url)
    
@route('/sina/callback/:request_token')
def sina_callback(request_token):
    oauth_verifier = request.GET.get('oauth_verifier', None)
    auth = WebOAuthHandler(sina_consumer_key, sina_consumer_secret, request_token)
    token = auth.get_access_token(oauth_verifier)
    response.set_cookie("ybole_auth", token, secret = gng_secret)
    redirect('/')
