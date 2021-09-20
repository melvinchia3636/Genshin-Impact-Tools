import requests
from bs4 import BeautifulSoup as bs

items = ['/wiki/Albedo', '/wiki/Aloy', '/wiki/Amber', '/wiki/Barbara', '/wiki/Beidou', '/wiki/Bennett', '/wiki/Chongyun', '/wiki/Diluc', '/wiki/Diona', '/wiki/Eula', '/wiki/Fischl', '/wiki/Ganyu', '/wiki/Hu_Tao', '/wiki/Jean', '/wiki/Kaedehara_Kazuha', '/wiki/Kaeya', '/wiki/Kamisato_Ayaka', '/wiki/Keqing', '/wiki/Klee', '/wiki/Kujou_Sara', '/wiki/Lisa', '/wiki/Mona', '/wiki/Ningguang', '/wiki/Noelle', '/wiki/Qiqi', '/wiki/Raiden_Shogun', '/wiki/Razor', '/wiki/Rosaria', '/wiki/Sayu', '/wiki/Sucrose', '/wiki/Tartaglia', '/wiki/Traveler', '/wiki/Venti', '/wiki/Xiangling', '/wiki/Xiao', '/wiki/Xingqiu', '/wiki/Xinyan', '/wiki/Yanfei', '/wiki/Yoimiya', '/wiki/Zhongli']

for i in items:
	try:
		open(i.replace('/wiki/', '')+'.png', 'wb').write(requests.get(bs(requests.get(f"https://genshin-impact.fandom.com{i}").content, 'lxml').select_one("[title='In Game'] img")['src'].split("/revision")[0]).content)
	except: print(i)