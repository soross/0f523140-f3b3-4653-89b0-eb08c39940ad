#coding:utf-8
#!/usr/bin/env python
from threading import Thread
from Queue import Queue
from time import sleep
import sqlite3
import sys, re, StringIO, os
import urllib2 as urllib
from datetime import datetime
q = Queue()
NUM = 20
TIMEOUT = 0.1
C = (u"名人堂", u"媒体汇", u"品牌馆")

def now():
	return str(datetime.now()) + " "
print now() + "Initializing..."

def craw(url, tag1, tag2, tag3):
    print now() + "Crawler",tag1,tag2,tag3,"Initializing..."
    while True:
        try:
            a = unicode(urllib.urlopen(url).read(), "utf-8")
            break
        except:
            print now() + "Crawler",tag1,tag2,tag3,"initialize failed, Retrying..."
            sleep(TIMEOUT)
    f = open(tag1 + os.sep + tag2 + os.sep + tag3 + ".txt", "w")
    i = 0
    while True:
        i += 1
        print now() + "Crawler",tag1,tag2,tag3,"Page",i,"Crawing..."
        b = re.findall("<a href=\"(home.php\?uid=(\d+)&amp;[^\"]+)\">([^<]+)</a>", a)
        for urltmp, userid, nickname in b:
            url = 'http://t.sina.cn/dpool/ttt/' + urltmp.replace("home.php", "user.php")
            while True:
                try:
                    c = unicode(urllib.urlopen(url).read(), "utf-8")
                    break
                except:
                    try:
                        print now() + "Crawler",tag1,tag2,tag3,"Page",i,"User",nickname,"fetch failed, Retrying..."
                    except:
                        print now() + "Crawler",tag1,tag2,tag3,"Page",i,"User XXX","fetch failed, Retrying..."
                    sleep(TIMEOUT)
            try:
                d = re.findall(u"认证说明:([^<]+)", c)[0]
            except:
                d = ""
            try:
                print now() + "Crawler",tag1,tag2,tag3,"Page",i,"User",nickname,"("+d+")","Fetched."
            except:
                print now() + "Crawler",tag1,tag2,tag3,"Page",i,"User XXX","(XXX)","Fetched."
            f.write((userid + '\t' + nickname + '\t' + d + '\n').encode('utf-8'))
            sleep(TIMEOUT)
        try:
            nextpage = re.findall(u"<a href=\"([^\"]+)\">下页</a>", a)[0].replace("&amp;", "&")
        except:
            f.close()
            return
        sleep(TIMEOUT)
        url = "http://t.sina.cn" + nextpage
        while True:
            try:
                a = unicode(urllib.urlopen(url).read(), "utf-8")
                break
            except:
                print now() + "Crawler",tag1,tag2,tag3,"Page",i+1,"fetch failed, Retrying..."
                sleep(TIMEOUT)

def working():
    global q
    while True:
        arguments = q.get()
        craw(*arguments)
        q.task_done()

for i in range(NUM):
    t = Thread(target=working)
    t.setDaemon(True)
    t.start()
    
for ntag1, tag1 in enumerate(C):
    print now() + "Seeking",tag1,"..."
    try:
        os.mkdir(tag1)
    except:
        pass
    url = "http://t.sina.cn/dpool/ttt/v2star.php?cat=%d&sorttype=industry&gsid=3_5bc659f93ba7c3eac863570828ad7bccb5" % (ntag1 + 1,)
    while True:
        try:
            a = unicode(urllib.urlopen(url).read(), "utf-8")
            break
        except:
            print now() + "Seeking",tag1,"failed, Retrying..."
            sleep(TIMEOUT)
    b = re.findall("<a href=\"(/dpool/ttt/v2star.php\?cat=1&amp;ta[^\"]+)\">([^<]+)</a>", a)
    for (url, tag2) in b:
        print now() + "Seeking",tag1,tag2,"..."
        try:
            os.mkdir(tag1 + os.sep + tag2)
        except:
            pass
        url = 'http://t.sina.cn' + url.replace('&amp;', '&')
        while True:
            try:
                a = unicode(urllib.urlopen(url).read(), "utf-8")
                break
            except:
                print now() + "Seeking",tag1,tag2,"failed, Retrying..."
                sleep(TIMEOUT)
        b2 = re.findall("<a href=\"(/dpool/ttt/v2star.php\?cat=1&amp;su[^\"]+)\">([^<]+)</a>", a)
        for (url, tag3) in b2:
            q.put(('http://t.sina.cn' + url.replace('&amp;', '&'), tag1, tag2, tag3))
q.join()
