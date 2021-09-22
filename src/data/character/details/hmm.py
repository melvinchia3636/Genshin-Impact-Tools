import requests
from bs4 import BeautifulSoup as bs
import os
import json

def add_name():
	for i in [i.split('.')[0] for i in os.listdir(".") if i.endswith(".json")]:
		soup = bs(requests.get("https://genshin-impact.fandom.com/wiki/"+i).content, 'lxml')
		data = json.load(open(i+'.json', 'r', encoding="utf-8"))
		data['name'] = soup.select_one(".pi-title").text
		data['nickname'] = soup.select_one(".pi-header").text
		json.dump(data, open(i+'.json', 'w', encoding="utf-8"))

def add_intro_content():
	for i in [i.split('.')[0] for i in os.listdir(".") if i.endswith(".json")]:
		soup = bs(requests.get("https://genshin-impact.fandom.com/wiki/"+i).content, 'html.parser')
		start = soup.select_one('aside[role="region"]')
		res = []
		while True:
			if start:
				if start.next_sibling: start = start.next_sibling
				else: start = start.next_element
				if "attrs" in dir(start) and "id" in start.attrs and start["id"] == "toc":
					break
				res.append(start.text.strip() if "text" in dir(start) else start.strip().replace("\\n", ""))
			else: break

		print(i)
		data = json.load(open(i+'.json', 'r', encoding="utf-8"))
		data['profile']['introduction']['content'] = " ".join(res).strip().replace(" , ", ", ").replace(" . ", ". ")
		json.dump(data, open(i+'.json', 'w', encoding="utf-8"))
 
def add_combat_info():
	for i in [i.split('.')[0] for i in os.listdir(".") if i.endswith(".json")][25:]:
		print(i)
		soup = bs(requests.get("https://genshin-impact.fandom.com/wiki/"+i).content, 'lxml')
		table = soup.select_one("#Base_Stats").parent.next_sibling.next_sibling.next_sibling.next_sibling
		table2 = soup.select_one("#Talents").parent.next_sibling.next_sibling
		table3 = table2.next_sibling.next_sibling
		table4 = soup.select_one("#Constellation").parent.next_sibling.next_sibling
		table5 = soup.select_one("#Ascensions").parent.next_sibling.next_sibling

		rdata = json.load(open(i+'.json', 'r', encoding="utf-8"))
		rdata['combat_info'] = {
			"base_stats": {"special": table.select('th:not([rowspan="2"])')[-1].text.strip().split("(")[1][:-1],"data": (d := [i.select('td, th') for i in table.select('tr')[1:]]) and (data := [d[i:i+2] for i in range(0, len(d), 2)]) and [i[0].pop(0) for i in data] and dict(enumerate([dict([[i[0], i[1:]] for i in i]) for i in [[[i.text.strip() for i in i] for i in i] for i in data]]))},
			"talents": (d := [i.select("td") for i in table2.select("tr")[1:]]) and (data := [d[i:i+2] for i in range(0, len(d), 2)]) and [(lambda i, j: {"icon": (image := i[0].select_one("img").attrs.get('data-src') or i[0].select_one("img").attrs.get('src')) and image.split("/revision")[0],"name": i[1].text.strip(),"type": i[2].text.strip(),"desc": j[0].text.strip()})(*i) for i in data],
			"lvup_mat": [[{"rarity": int(i.select_one("img")['alt'].split()[1]),"image": i.select_one(".card_image img")['data-src'].split("/revision")[0],"amount": int(i.select_one(".card_text").text)} for i in i.select('td .card_container')] for i in table3.select("tr")[1:]],
			"constellation": [(col := i.select("td")) and {"level": int(col[0].text.strip()),"icon": col[1].select_one("img")['data-src'].split("/revision")[0],"name": col[2].text.strip(),"effect": col[3].text.strip()} for i in table4.select("tr")[1:]],
			
			"ascensions": [[{"rarity": int(i.select_one("img")['alt'].split()[1]),"image": i.select_one(".card_image img")['data-src'].split("/revision")[0],"amount": int(i.select_one(".card_text").text)} for i in i.select("td")[1:]] for i in table5.select("tr")[1:]]
		}
		json.dump(rdata, open(i+'.json', 'w', encoding="utf-8"), indent=4)

add_combat_info()

'''for i in [i.split('.')[0] for i in os.listdir(".") if i.endswith(".json")]:
	print(i)
	rdata = json.load(open(i+'.json', 'r', encoding="utf-8"))
	rdata['combat_info']["base_stats"]['data'] = {k: (d := list(v.items())) and {d[0][0]: d[0][1], d[1][0]: d[1][1]+[d[0][1][3]]} for k, v in rdata['combat_info']["base_stats"]['data'].items()}
	json.dump(rdata, open(i+'.json', 'w', encoding="utf-8"), indent=4)'''