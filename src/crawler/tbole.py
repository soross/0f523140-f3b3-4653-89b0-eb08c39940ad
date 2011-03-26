#coding:utf-8
from threading import Thread
from Queue import Queue
from time import sleep
import sqlite3
import sys, re, StringIO
import urllib2 as urllib
q = Queue()
NUM = 7
JOBS = 100
results = []

def craw(arguments):
    global results
    try:
        a = unicode(urllib.urlopen("http://tbole.com/result.php?cate_id=%d" % (arguments,)).read(), "gbk")
        b = re.findall(u"<span class=\"result_search\">cate\:(.+?),共", a)[0]
        results += [b]
        print arguments, b, "Done."
    except:
        print arguments, "Error."
        pass
    sleep(0.7)
    
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

f = open("tbole_cat.txt", "w")
f.write("\r\n".join(results).encode('utf-8'))
f.close()
print "Wrote results."
