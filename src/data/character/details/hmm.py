import requests
from bs4 import BeautifulSoup as bs
import os
import json

for i in [i.split('.')[0] for i in os.listdir(".") if i.endswith(".json")]:
	soup = bs(requests.get("https://genshin-impact.fandom.com/wiki/"+i).content, 'lxml')
	data = json.load(open(i+'.json', 'r', encoding="utf-8"))
	data['name'] = soup.select_one(".pi-title").text
	data['nickname'] = soup.select_one(".pi-header").text
	json.dump(data, open(i+'.json', 'w', encoding="utf-8"))
