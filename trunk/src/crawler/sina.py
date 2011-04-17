#!/usr/bin/env python
#coding=utf-8
from weibopy.auth import OAuthHandler
from weibopy.api import API
import sqlite3
from threading import Thread
from Queue import Queue
from time import sleep
from datetime import datetime, timedelta, date, time
import sys
from tag_detect import detect
import os
from signal import SIGTERM
from crawler_id import idlist as A

reload(sys)
sys.setdefaultencoding('utf-8')

PAGE = 1
    
B = []

try:
    PAGE = int(sys.argv[1])
except IndexError:
    pass

LOCK = '/var/lock/sinacrawler.lock'

if os.path.isfile(LOCK):
    f = open(LOCK, "r").read()
    try:
        os.kill(int(f), SIGTERM)
    except:
        pass
pid = os.getpid()
f = open(LOCK, "w")
f.write("%d"%(pid))
f.close()

def now():
    return str(datetime.now()) + " "
print now() + "Initializing..."

def iszhaopin(s):
    keywords = [(u"招聘", ),
                (u"诚聘", ),
                (u"急聘", ),
                (u"需要", u"人员"),
                (u"招人", ),
                (u"招", u"人员"),
                (u"挖角", ),
                (u"急招", ),
                (u"伯乐奖", ),
                (u"招兵买马", ),
                (u"发送简历", ),
                (u"email简历", ),
                (u"岗位", u"空缺"),
                (u"职位", u"名"),
                (u"推荐", u"人才"),
                (u"荐才", u"注明应聘"),
                (u"内推", u"实习生"),
                (u"内部推荐", u"精英"),
                (u"换工作", u"高手"),
                (u"换跑道", u"千里马"),
                (u"欢迎加入我们", ),
                (u"兼职招聘", ),
                (u"创业招聘", ),
            ]
    declinekeywords = [(u"智联招聘", ),
                       (u"寻人启事", ),
                       (r"//@", ),
                      ]
    match = False
    for keywordset in keywords:
        match2 = True
        for key in keywordset:
            if key not in s:
                match2 = False
                break
        if match2:
            match = True
            break
    if not match:
        return False
    for keywordset in declinekeywords:
        match = True
        for key in keywordset:
            if key not in s:
                match = False
                break
        if match:
            return False
    return True

class SinaFetch():
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
        
    def friends_timeline(self, page):
        timeline = self.api.friends_timeline(count=200, page=page)
        results = []
        for line in timeline:
            self.obj = line
            mid = self.getAtt("id")
            text = unicode(self.getAtt("text"))
            posttime = self.getAtt("created_at")
            source = self.getAtt("source")
            user = self.getAtt("user")
            self.obj = user
            userid = self.getAtt("id")
            name = unicode(self.getAtt("screen_name"))
            avatar = self.getAtt("profile_image_url")
            if iszhaopin(text):
                results += [(userid, name, avatar, mid, text, posttime, source)]
        return results

q = Queue()

def working():
    global B
    cateid, crawlerinfo = q.get()
    test = SinaFetch()
    test.setToken(crawlerinfo[1], crawlerinfo[2])
    for page in range(1, PAGE + 1):
        result = test.friends_timeline(page)
        B += [(cateid, result)]
        print now() + "Crawler %s Cate:%d page %d/%d Done." % (crawlerinfo[0], cateid, page, PAGE)
    q.task_done()

for crawler in A:
    q.put(crawler)
    t = Thread(target=working)
    t.setDaemon(True)
    t.start()
    sleep(2)
    
print now() + "Preparing cursors to operate database..."
path = '/var/www/0f523140-f3b3-4653-89b0-eb08c39940ad/src/crawler'
#path = os.path.dirname(sys.argv[0])
os.chdir(path)
import MySQLdb, uuid
db = MySQLdb.connect("127.0.0.1","apis","G2WvPRsxGEr77wEd","apis",charset="utf8")
c = db.cursor()
d = detect()
#_tagid = open("tag_list_withid.dict", "r").read().decode("utf-8").split('\n')
c.execute("SELECT * FROM tags")
tagid = {}
tagnoid = []
for i in c:
    tag_id, tag = i[0], i[1]
    tagnoid += [tag]
    tagid[tag] = tag_id
f = open("tag_list_nogroup.list", "w")
f.write('\n'.join(tagnoid))
f.close()
#for line in _tagid:
#    tag_id, tag = line.split()
#    tagid[tag] = tag_id
print now() + "Dealing with pending tweets..."
c.execute("SELECT * FROM pending_tweets LIMIT 0 , 1")
while True:
    try:
        tweet_site_id, post_screenname, profile_image_url, source, post_datetime, content, type_, user_site_id, tweet_id, site_id = c.fetchone()
        c.execute("DELETE FROM pending_tweets WHERE tweet_id = %s", (tweet_id,))
        c.execute("SELECT * FROM tweets WHERE site_id = %s AND tweet_site_id = %s", (site_id, tweet_site_id))
        if c.fetchone() != None:
            print now() + "Dulplicate pending item:", tweet_site_id
            c.execute("SELECT * FROM pending_tweets LIMIT 0 , 1")
            continue
        c.execute("""INSERT INTO tweets (
                     site_id, tweet_id, user_site_id, content, post_datetime,
                     type, tweet_site_id, favorite_count, application_count,
                     post_screenname, profile_image_url, source)
                     VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                  (site_id, tweet_id, user_site_id, content, post_datetime,
                   type_, tweet_site_id, 0, 0,
                   post_screenname, profile_image_url, source))
        c.execute("""INSERT INTO cat_relationship (
                     tweet_id, cat_id)
                     VALUES (%s, %s)""",
                  (tweet_id, 0,))
        for tag in d.Split(content)[:]:
            try:
                c.execute("""INSERT INTO tag_relationship (
                             tag_id, tweet_id)
                             VALUES (%s, %s)""",
                         (tagid[tag], tweet_id))
                c.execute("SELECT count, tag_group FROM tags WHERE tag_id = %s", (tagid[tag],))
                t = c.fetchone()
                if t == None:
                    print now() + "Error updating count: No tag %s found!" % (tag, )
                else:
                    count = t[0] + 1
                    tag_group = t[1]
                    if tag_group != 0:
                        #print tag_group, "Tag group detected!"
                        c.execute("UPDATE tags SET count = %s WHERE tag_group = %s", (count, tag_group))
                    else:
                        c.execute("UPDATE tags SET count = %s WHERE tag_id = %s", (count, tagid[tag]))
            except KeyError:
                print now() + "Error updating tag: No tag %s found!" % (tag, )
        print now() + "Inserted pending item:", tweet_site_id
        c.execute("SELECT * FROM pending_tweets LIMIT 0 , 1")
    except:
        break
q.join()
print now() + "Craw Complete."
for cat, items in B:
    for userid, name, avatar, mid, text, posttime, source in items:
        tweet_id = uuid.uuid4().hex
        c.execute("SELECT * FROM tweets WHERE tweet_site_id = %s", (mid,))
        if c.fetchone() != None:
            print now() + "Dulplicate item: %d, %d" % (cat, mid)
            continue
        c.execute("""INSERT INTO tweets (
                     site_id, tweet_id, user_site_id, content, post_datetime,
                     type, tweet_site_id, favorite_count, application_count,
                     post_screenname, profile_image_url, source)
                     VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                  (1, tweet_id, userid, text, posttime,
                   2, mid, 0, 0,
                   name, avatar, source))
        c.execute("""INSERT INTO cat_relationship (
                     cat_id, tweet_id)
                     VALUES (%s, %s)""",
                  (cat, tweet_id))
        for tag in d.Split(text)[:]:
            try:
                c.execute("""INSERT INTO tag_relationship (
                             tag_id, tweet_id)
                             VALUES (%s, %s)""",
                         (tagid[tag], tweet_id))
                c.execute("SELECT count, tag_group FROM tags WHERE tag_id = %s", (tagid[tag],))
                t = c.fetchone()
                if t == None:
                    print now() + "Error updating count: No tag %s found!" % (tag, )
                else:
                    count = t[0] + 1
                    tag_group = t[1]
                    if tag_group != 0:
                        #print tag_group, "Tag group detected!"
                        c.execute("UPDATE tags SET count = %s WHERE tag_group = %s", (count, tag_group))
                    else:
                        c.execute("UPDATE tags SET count = %s WHERE tag_id = %s", (count, tagid[tag]))
            except KeyError:
                print now() + "Error updating tag: No tag %s found!" % (tag, )
        c.execute("SELECT count FROM categories WHERE cat_id = %s", (cat,))
        t = c.fetchone()
        if t == None:
            print now() + "Error updating count: No category %d found!" % (cat, )
        else:
            count = t[0] + 1
            c.execute("UPDATE categories SET count = %s WHERE cat_id = %s", (count, cat))
        print now() + "Inserted item: %d, %d" % (cat, mid)
        
#counting
c.execute("SELECT COUNT(*) FROM tweets WHERE post_datetime > %s", (datetime.combine(date.today(), time()),))
t = c.fetchone()
if t == None:
    count = 0
else:
    count = t[0]
c.execute("UPDATE counts SET count = %s WHERE type = %s", (count, "tweets_today"))

c.execute("SELECT COUNT(*) FROM tweets WHERE post_datetime > %s", (datetime.combine(date.today(), time()) - timedelta(days = datetime.now().isoweekday() - 1),))
t = c.fetchone()
if t == None:
    count = 0
else:
    count = t[0]
c.execute("UPDATE counts SET count = %s WHERE type = %s", (count, "tweets_thisweek"))

db.commit()
c.close()
print now() + "Wrote Database."
os.unlink(LOCK)
