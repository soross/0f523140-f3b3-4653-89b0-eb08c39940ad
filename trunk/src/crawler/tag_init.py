import sys, uuid
from datetime import datetime
def now():
	return str(datetime.now()) + " "
    
dic = open("tag_list.dict", "r")
result = []
for item in dic:
    m = unicode(item, "utf-8").split()
    if len(m) > 1:
        tag, group = m
    else:
        tag, group = m[0], "0"
    tag_id = uuid.uuid4().hex
    result += [(tag_id, tag, group, 0)]

import MySQLdb
db = MySQLdb.connect("115.156.219.195","apis","apis","apis",charset="utf8")
c = db.cursor()
c.executemany("""INSERT INTO tags (tag_id, name, tag_group, count) VALUES (%s, %s, %s, %s)""",
              result)
db.commit()
c.close()
print now() + "Wrote Database."
