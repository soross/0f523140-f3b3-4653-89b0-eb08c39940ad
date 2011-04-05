#!/usr/bin/env python
from threading import Thread
from Queue import Queue
from time import sleep
import sqlite3
import sys, re, StringIO
import urllib2 as urllib
q = Queue()
NUM = 17

def craw(key):
    a = unicode(urllib.urlopen(key).read(), "utf-8")
    while True:
        print re.findall("<a href=\"home.php?uid=(\d+)&amp;[^\"]+\">([^<]+)</a>", a)
        raw_input()
        try:
            nextpage = re.findall("<a href=\"([^\"]+)\">下页</a>", b[-3])[0].replace("&amp;", "&")
        except:
            return
        sleep(0.1)
        a = urllib.urlopen("http://t.sina.cn/dpool/ttt/" + nextpage)

def working():
    global q
    while True:
        arguments = q.get()
        craw(arguments)
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
    url = 'http://t.sina.cn/' + url.replace('&amp;', '&')
    a = unicode(urllib.urlopen(url).read(), "utf-8")
    b2 = re.findall("<a href=\"(/dpool/ttt/v2star.php\?cat=1&amp;su[^\"]+)\">([^<]+)</a>", a)
    for (url, tag) in b2:
        print url, tag
