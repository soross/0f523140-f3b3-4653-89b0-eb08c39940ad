#coding:utf8
import os, sys
from bottle import route, run, debug, template, request, validate, error, response, redirect
# only needed when you run Bottle on mod_wsgi
from bottle import default_app
from y_home import *

#reload(sys)
#sys.setdefaultencoding('utf-8')

debug(True)

def main():
    run(reloader=True);

if __name__ == "__main__":
    # Interactive mode
    main()
else:
    # Mod WSGI launch
    os.chdir(os.path.dirname(__file__))
    application = default_app()
