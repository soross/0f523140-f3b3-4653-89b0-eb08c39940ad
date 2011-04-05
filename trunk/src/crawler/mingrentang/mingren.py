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
    a = unicode(urllib.urlopen(key), "utf-8")
    while True:
        b = a.read().split('<div class="c"')
        for item in b[1:-2]:
            try:
                if "转发了" in item:
                    continue
                id = re.findall('id="([^"]+)"', item)[0]
                text = re.findall('<span class="ctt">(.+?)</span>[\[\&]', item)[0]
                text = re.sub("<.+?>","",text)
                if text[0] == ':':
                    text = text[1:]
                if id in ids:
                    continue
                #print id, text
                results.append((id, unicode(text,'utf-8')))
                ids.append(id)
                count += 1
                print count
                if count > TARGET:
                    return
            except:
                pass
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
