#!/usr/bin/python
#coding=utf-8
from weibopy.auth import OAuthHandler
from weibopy.api import API
import sqlite3
from threading import Thread
from Queue import Queue

A = [(u"新媒体", u"小王trueman", "1f8f7db82cdbc346a91840cef2bc1cb9", "a16ead9ee3b6b3f43e601de127275ddc"),
	 (u"风投/投行", u"小毕Simon", "4151efe34301f5fddb9d34fc72e5f4a4", "dc4a07e8b7936d688726604a7442e4bc"),
	 (u"移动互联", u"冬冬Billy", "f6449dd703d66cf2be5274f321416958", "31c47db4cd79e43a9196871a554d0847"),
	 (u"电子商务_B2C/团购", u"田田Lily", "3ef7fc951a66918dd1cd722485fe1686", "74f524fe376ce995703e73e63407684f"),
	 (u"软件、电信", u"小朱Linda", "0c10534f393fe08451edb140e3b1150d", "423fd333a2542dbf6e2a38119a6e7e04"),
	 (u"传统网络 Internet", u"超超Sandy", "d11c25990634d0e486235f1b42a55f9f", "89859ba49065135017b894df5e5a9089"),
	 (u"其他外企", u"小黄Lily", "8ee871ac7d18e0141b54077fefd58af6", "dc5cda5a9a4ab5c5a5cd53f85f1f7915"),
	 (u"网游", u"田田July", "032ec596fa363aa9bd3e5e5917f6aea4", "9e0c243fa3ff3515765510ba4010c411"),
	]

def iszhaopin(s):
	keywords = [(u"招聘", ),
				(u"诚聘", ),
				(u"急聘", ),
				(u"需要", u"人员"),
				(u"寻人", ),
				(u"加盟", ),
				(u"招人", ),
				(u"招", u"人员"),
				(u"找人", ),
				(u"挖角", ),
				(u"跳槽", ),
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
				(u"猎头", u"牛人"),
				(u"换跑道", u"千里马"),
				(u"欢迎加入我们", ),
				(u"兼职招聘", ),
				(u"创业招聘", ),
			]
	declinekeywords = [(u"智联招聘", ),
					   (u"寻人启事", ),
					   (r"//", r"@"),
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
        
    def friends_timeline(self):
        timeline = self.api.friends_timeline(count=200, page=1)
        results = []
        for line in timeline:
			self.obj = line
			mid = self.getAtt("id")
			text = self.getAtt("text")
			try:
				time = self.getAtt("created_at")
			except:
				time = ""
			if iszhaopin(text):
				results += [str(mid) +":"+ text + " " + str(time)]
        return "\n".join(results)

q = Queue()

def working():
	crawler = q.get()
	test = SinaFetch()
	test.setToken(crawler[2], crawler[3])
	result = test.friends_timeline()
	print crawler[0]+"\n"+result
	q.task_done()

for crawler in A:
	q.put(crawler)
	t = Thread(target=working)
	t.setDaemon(True)
	t.start()
	
q.join()
