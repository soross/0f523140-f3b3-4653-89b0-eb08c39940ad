#coding:utf-8
from threading import Thread
from Queue import Queue
import sqlite3
import sys, re, StringIO
from time import sleep
import urllib2 as urllib

TARGET = 1000
NUM = 10
KEYS = ['招聘 产品设计师', '招聘 销售经理', '招聘 网站编辑', '招聘 营销经理', '招聘 开发工程师', '招聘 php工程师', '招聘 网络编辑', '招聘 java工程师', '招聘 平面设计师', '招聘 市场专员']

ids = []
results = []
count = 0
q = Queue()

class UserAgentProcessor(urllib.BaseHandler):
    """A handler to add a custom UA string to urllib2 requests
    """
    def __init__(self):
        self.handler_order = 100
        self.ua = "User-Agent:Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/534.25 (KHTML, like Gecko) Ubuntu/11.04 Chromium/12.0.707.0 Chrome/12.0.707.0 Safari/534.25"

    def http_request(self, request):
        request.add_header("User-Agent", self.ua)
        return request
    https_request = http_request

opener = urllib.build_opener(UserAgentProcessor())
urllib.install_opener(opener)

def craw(key):
    global count, results, q, ids
    key = key.replace(" ", "%20")
    print key
    a = urllib.urlopen("http://t.sina.cn/dpool/ttt/search.php?PHPSESSID=f54ade2b393f1a28b59db06939c8f420", data="keyword="+key+"&smblog=搜微博")
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

for key in KEYS:
    q.put(key)

q.join()
print "Craw completed."
conn = sqlite3.connect("train.dat")
cur = conn.cursor()

try:
    cur.execute("create table tweets (id text, content text)")
except sqlite3.OperationalError:
    pass
cur.executemany("insert into tweets values (?,?)", results)
conn.commit()
cur.close()
conn.close()
print "Wrote Database."
