import sys, uuid
from datetime import datetime
def now():
    return str(datetime.now()) + " "
    
dic = open("tag_list.dict", "r")
result = []
dic2 = []
dic3 = []
for item in dic:
    m = unicode(item, "utf-8").split()
    if len(m) > 1:
        tag, group = m
    else:
        tag, group = m[0], "0"
    tag_id = uuid.uuid4().hex
    result += [(tag_id, tag, group, 0)]
    dic2 += [tag]
    dic3 += [(tag_id, tag)]
dic.close()
#dic = open("tag_list_nogroup.dict", "w")
#dic.write("\n".join(dic2).encode("utf-8").lower())
#dic.close()
#dic = open("tag_list_withid.dict", "w")
#dic.write("\n".join([" ".join(x) for x in dic3]).encode("utf-8").lower())
#dic.close()
print now() + "Wrote Dict."

import MySQLdb
db = MySQLdb.connect("127.0.0.1","apis","G2WvPRsxGEr77wEd","apis",charset="utf8")
c = db.cursor()
c.executemany("""INSERT INTO tags (tag_id, name, tag_group, count) VALUES (%s, %s, %s, %s)""",
              result)
db.commit()
c.close()
print now() + "Wrote Database."
