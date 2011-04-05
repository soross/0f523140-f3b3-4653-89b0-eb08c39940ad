#coding:utf-8
#!/usr/bin/env python
from threading import Thread
from Queue import Queue
from time import sleep
import sqlite3
import sys, re, StringIO, os
import urllib2 as urllib
q = Queue()
NUM = 17

def craw(key, tag, tag2):
    a = unicode(urllib.urlopen(key).read(), "utf-8")
    f = open(tag + os.sep + tag2 + ".txt", "w")
    i = 0
    while True:
        i += 1
        print "Crawler",tag,tag2,"Page",i,"Crawing..."
        b = re.findall("<a href=\"home.php\?uid=(\d+)&amp;[^\"]+\">([^<]+)</a>", a)
        for userid, nickname in b:
            f.write((userid + '\t' + nickname + '\n').encode('utf-8'))
        try:
            nextpage = re.findall(u"<a href=\"([^\"]+)\">下页</a>", a)[0].replace("&amp;", "&")
        except:
            f.close()
            return
        sleep(0.1)
        a = unicode(urllib.urlopen("http://t.sina.cn" + nextpage).read(), "utf-8")

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

url = "http://t.sina.cn/dpool/ttt/v2star.php?cat=1&sorttype=industry&gsid=3_5bc659f93ba7c3eac863570828ad7bccb5"
a = unicode(urllib.urlopen(url).read(), "utf-8")
b = re.findall("<a href=\"(/dpool/ttt/v2star.php\?cat=1&amp;ta[^\"]+)\">([^<]+)</a>", a)
for (url, tag) in b:
    print tag
    try:
        os.mkdir(tag)
    except:
        pass
    url = 'http://t.sina.cn' + url.replace('&amp;', '&')
    a = unicode(urllib.urlopen(url).read(), "utf-8")
    b2 = re.findall("<a href=\"(/dpool/ttt/v2star.php\?cat=1&amp;su[^\"]+)\">([^<]+)</a>", a)
    for (url, tag2) in b2:
        q.put(('http://t.sina.cn' + url.replace('&amp;', '&'), tag, tag2))
q.join()
