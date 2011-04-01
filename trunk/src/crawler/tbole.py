#coding:utf-8
from threading import Thread
from Queue import Queue
from time import sleep
import sqlite3
import sys, re, StringIO
import urllib2 as urllib
q = Queue()
NUM = 17
JOBS = 3000
results = []

def craw(arguments):
    global results
    try:
        a = unicode(urllib.urlopen("http://tbole.com/result.php?searchid=%d" % (arguments,)).read(), "gbk")
        a = a.replace("\n", " ").replace("\r", "")
        b = re.findall(u"<span class=\"about_text\">[^<]+?</span>(.+?)</div>", a)
        for c in b:
            d = re.findall(u"<span><a[^>]*>(.+?)</a></span>", c)
            for e in d:
                results += [e]
        print arguments, "Done."
    except:
        print arguments, "Error."
        pass
    sleep(0.2)
    
def working():
    while True:
        arguments = q.get()
        craw(arguments)
        q.task_done()

for i in range(NUM):
    t = Thread(target=working)
    t.setDaemon(True)
    t.start()

for i in range(JOBS):
    q.put(i)

q.join()
print "Craw completed."

b = {}
for a in results:
    b[a] = 1;

f = open("tbole_key.txt", "w")
f.write("\n".join(b.keys()).encode('utf-8'))
f.close()
print "Wrote results."
