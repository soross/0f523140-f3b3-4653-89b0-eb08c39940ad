from weibopy.auth import OAuthHandler
from weibopy.api import API
from threading import Thread
from Queue import Queue
from time import sleep
from datetime import datetime, timedelta, date, time
import sys
from tag_detect import detect
import os
from crawler_id import idlist as A
from weibopy.error import WeibopError

B = []

def now():
	return str(datetime.now()) + " "
print now() + "Initializing..."

class SinaFollow():
    consumer_key= "961495784"
    consumer_secret ="47d9d806a1dc04cc758be6f7213465bc"
    
    def __init__(self):
            """ constructor """
            
    def getAtt(self, key):
        try:
            return self.obj.__getattribute__(key)
        except Exception, e:
			print e
			return ''
        
    def getAttValue(self, obj, key):
        try:
            return obj.__getattribute__(key)
        except Exception, e:
            print e
            return ''
            
    def setToken(self, token, tokenSecret):
        self.auth = OAuthHandler(self.consumer_key, self.consumer_secret)
        self.auth.setToken(token, tokenSecret)
        self.api = API(self.auth)
        
    def auth(self):
        self.auth = OAuthHandler(self.consumer_key, self.consumer_secret)
        auth_url = self.auth.get_authorization_url()
        print 'Please authorize: ' + auth_url
        verifier = raw_input('PIN: ').strip()
        self.auth.get_access_token(verifier)
        self.api = API(self.auth)
        
    def friendship_create(self, screen_name):
        timeline = self.api.create_friendship(screen_name = screen_name)

f = unicode(open("follow_id.list", "r").read(), "utf-8").replace("\r","").split("\n")
for line in f:
    b = line.split('\t')
    user = b[0]
    cats = [int(x) for x in b[1:]]
    B += [(user, cats)]

q = Queue()

def working():
    global B
    count = 0
    crawler = q.get()
    test = SinaFollow()
    test.setToken(crawler[1][2], crawler[1][3])
    for user, cats in B:
        if crawler[0] in cats:
            count += 1
            sleep(0.5)
            try:
                test.friendship_create(user)
                print now(), "Crawler", crawler[0], "Followed", count, ":", user
            except WeibopError as (error_msg):
                print now(), "Crawler", crawler[0], "Error following", count, ":", user, "Reason:",error_msg
    q.task_done()

for crawler in enumerate(A):
	q.put(crawler)
	t = Thread(target=working)
	t.setDaemon(True)
	t.start()
	sleep(2)

q.join()
print now() + "Follow Complete."

