import requests
from bs4 import BeautifulSoup as bs
import os
import json
import re

def genshin(name):
	soup = bs(requests.get("https://genshin-impact.fandom.com/wiki/"+name).content, 'lxml')
	table2 = soup.select_one("#Talents").parent.next_sibling.next_sibling
	
	rdata = json.load(open(name+'.json', 'r', encoding="utf-8"))

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

	rdata['name'] = soup.select_one(".pi-title").text
	rdata['nickname'] = soup.select_one(".pi-header").text
	rdata['profile']['introduction']['content'] = " ".join(res).strip().replace(" , ", ", ").replace(" . ", ". ")

	#base stats and ascensions cost
	basestats_ascentions_table = (soup.select_one("#Ascensions_and_Stats") or soup.select_one("#Ascensions")).parent.next_sibling.next_sibling
	base_stats = basestats_ascentions_table.select("tr")[1:]
	base_stats = [base_stats[i:i+3] for i in range(0, len(base_stats), 3)]
	base_stats, ascensions_cost = list(zip(*[[i[:2], i[2]] for i in base_stats])) if (base_stats[-1].append([]) or "a") else ""
	base_stats = [[[i.text.strip() for i in i.select("td")] for i in i] for i in base_stats]
	[i[0].pop(0) for i in base_stats]
	base_stats = {str(i): dict([[i[0].split("/")[0], i[1:4]] for i in v]) for i, v in enumerate(base_stats)}
	ascensions_cost = [[{"rarity": int(i.select_one("img")['alt'].split()[1]),"image": (i.select_one(".card_image img").attrs.get('data-src') or i.select_one(".card_image img").attrs.get('src')).split("/revision")[0],"amount": int(i.select_one(".card_text").text)} for i in i.select("td")[0].select(".card_container")[:-1]] for i in ascensions_cost if i]

	talent_leveling_mat_table = soup.select_one("#Single_Talent_Leveling").parent.next_sibling.next_sibling
	talent_leveling_mat = talent_leveling_mat_table.select("tr")[1:]
	talent_leveling_mat = [i.select('td')[1:] for i in talent_leveling_mat]
	talent_leveling_mat = [{"ascensions_req": v[0].text.strip()[:-1] if "✦" in v[0].text else talent_leveling_mat[i-1][0].text.strip()[:-1], "cost": v[1].text.split()[0] if "✦" in v[0].text else v[0].text.split()[0], "materials": [{"rarity": int(i.select_one("img")['alt'].split()[1]),"image": (i.select_one(".card_image img").attrs.get('data-src') or i.select_one(".card_image img").attrs.get('src')).split("/revision")[0],"amount": int(i.select_one(".card_text").text)} for i in sum([i.select(".card_container") for i in (v[2:] if "✦" in v[0].text else v[1:])], [])]} for i, v in enumerate(talent_leveling_mat)]

	table4 = bs(requests.get("https://genshin-impact.fandom.com/api.php?action=parse&text='{}'&format=json".format("{{Constellations Table|"+rdata['name']+"}}")).json()['parse']['text']["*"], 'lxml').find("table")

	rdata['combat_info'] = {
		"constellation": [(col := i.select("td")) and {"level": int(col[0].text.strip()),"icon": (col[1].select_one("img").attrs.get('data-src') or col[1].select_one("img").attrs.get('src')).split("/revision")[0],"name": col[2].text.strip(),"effect": col[3].text.strip()} for i in table4.select("tr")[1:]],
		"base_stats": {
			"data": base_stats
		},
		"ascensions": ascensions_cost,
		"talents": (d := [i.select("td") for i in table2.select("tr")[1:]]) and (data := [d[i:i+2] for i in range(0, len(d), 2)]) and [(lambda i, j: {"icon": (image := i[0].select_one("img").attrs.get('data-src') or i[0].select_one("img").attrs.get('src')) and image.split("/revision")[0],"name": i[1].text.strip(),"type": i[2].text.strip(),"desc": j[0].text.strip()})(*i) for i in data],
		"talent_levening_mat": talent_leveling_mat
	}

	json.dump(rdata, open(name+'.json', 'w', encoding="utf-8"), indent=4)

#for i in [i.split('.')[0] for i in os.listdir(".") if i.endswith(".json")]:
	#genshin(i)


def modify_combat_info():
	for i in [i.split('.')[0] for i in os.listdir(".") if i.endswith(".json")]:
		print(i)
		rdata = json.load(open(i+'.json', 'r', encoding="utf-8"))
		rdata['combat_info']["base_stats"]['data'] = {k: (d := list(v.items())) and {d[0][0]: d[0][1], d[1][0]: d[1][1]+[d[0][1][3]]} for k, v in rdata['combat_info']["base_stats"]['data'].items()}
		json.dump(rdata, open(i+'.json', 'w', encoding="utf-8"), indent=4)

def availability():
	for i in [i.split('.')[0] for i in os.listdir(".") if i.endswith(".json")]:
		print(i)
		soup = bs(requests.get("https://genshin-impact.fandom.com/wiki/"+i+"?action=edit").content, 'lxml')
		source = soup.find("textarea").text
		availaibility = re.findall(r"==Availability==\n((?:\s|.)*?)\n\n", source)[0]
		if availaibility == "===Event Wishes===\n{{Featured}}":
			availaibility = ""
		else: 
			availaibility = re.sub(r"\[\[(.*?)\]\]", r"**\1**", availaibility.replace("**", "\t- ").replace("*", '- '))
		soup = bs(requests.get("https://genshin-impact.fandom.com/wiki/"+i).content, 'lxml')
		if (bargain := soup.find("span", {"id": "Paimon.27s_Bargains"})):
			if "not available" in (bargain := bargain.parent.next_sibling.next_sibling).text:
				paimon = None	
			else:
				table = bargain.next_sibling.next_sibling
				paimon = [(d := i.select("td")) and {
					"date": d[0].text.strip(),
					"item": (t := d[1].select("div.card_container")) and [{
						"rarity": int(i.select_one("img")['alt'].split()[1]),
						"image": i.select_one(".card_image img")['data-src'].split("/revision")[0],
						"text": i.select_one(".card_text").text,
						"icon": (img := i.select_one('.card_icon img')) and (img['alt'] if img else None)
					} for i in t]
				} for i in table.select("tbody tr")[1:]]
		else: paimon = None

		if (wishes := soup.find("span", {"id": "Event_Wishes"})):
			if "not" in (wishes := wishes.parent.next_sibling.next_sibling).text:
				wishes = None	
			else:
				table = wishes.next_sibling.next_sibling
				wishes = [(d := i.select("td")) and {
					"image": d[0].select_one("img")['data-src'].split("/revision")[0],
					"name": d[1].text.strip(),
					"item": (t := d[2].select("div.card_container")) and [{
						"rarity": int(i.select_one("img")['alt'].split()[1]),
						"image": i.select_one(".card_image img")['data-src'].split("/revision")[0],
						"text": i.select_one(".card_text").text,
						"icon": (img := i.select_one('.card_icon img')) and (img['alt'] if img else None)
					} for i in t]
				} for i in table.select("tbody tr")[1:]]
		else: wishes = None

		rdata = json.load(open(i+'.json', 'r', encoding="utf-8"))
		rdata['availability'] = {
			"availability": availaibility,
			"paimon_bargain": paimon,
			"event_wishes": wishes
		}
		json.dump(rdata, open(i+'.json', 'w', encoding="utf-8"), indent=4)

def banner_image():
	for i in [i.split('.')[0] for i in os.listdir(".") if i.endswith(".json")]:
		print(i)
		images = set()
		rdata = json.load(open(i+'.json', 'r', encoding="utf-8"))
		if rdata['availability']['event_wishes']:
			for j in rdata['availability']['event_wishes']:
				images.add(j['image'])
				j['image'] = j['image'].split("/")[-1]
		for j in list(images):
			open("../../../assets/wishes/"+j.split("/")[-1], 'wb').write(requests.get(j).content)
		json.dump(rdata, open(i+'.json', 'w', encoding="utf-8"), indent=4)

def character_stories():
	for i in [i.split('.')[0] for i in os.listdir(".") if i.endswith(".json")]:
		print(i)

		#raw data
		soup = bs(requests.get("https://genshin-impact.fandom.com/wiki/"+i+"/Story?action=edit").content, 'lxml')
		source = soup.find("textarea").text
		
		#character stories
		details = re.findall(r"==Character Stories==((?:.|\s)*?)(?:==Namecard|==Quests and Events==)", source)[0]
		if "===" in details:
			details = (d := [i.strip() for i in details.split("===") if i.strip()]) and dict([d[i: i+2] for i in range(0, len(d), 2)])
			for d in details:
				details[d] = re.split(r"<br />|\n\n", re.sub(r"\[\[(.*?)\]\]", r"**\1**", details[d]))
		else: 
			details = dict([[v[0], re.split(r"<br />|\n\n", re.sub(r"\[\[(.*?)\]\]", r"**\1**", bs(v[1], "lxml").text.strip()))] for v in re.findall(r"\|title\d\s+=\s*(?P<title>.*?)\s*\|text\d\s*=\s*(?P<content>.*?)\n", details)])

		rdata = json.load(open(i+'.json', 'r', encoding="utf-8"))
		
		#namecard
		if (namecard_name := re.findall(r"{{Namecard\|(.*?)}}", source)):
			soup = bs(requests.get("https://genshin-impact.fandom.com/api.php?action=parse&text='{{{{Namecard|{}}}}}'&format=json".format(namecard_name[0])).json()['parse']['text']["*"], 'lxml').find("table")
			namecard = {
				"name": namecard_name[0],
				"image": soup.find("img")['src'].split("/revision")[0], 
				**dict([(c := i.contents) and [c[0].text[:-1].lower(), "".join(i if isinstance(i, str) else i.text for i in c[2:]).strip()] for i in soup.select('td')[-2:]])
			}
		else: namecard = None

		#constellation
		soup = bs(requests.get("https://genshin-impact.fandom.com/api.php?action=parse&text='{}'&format=json".format(re.findall(r"{{Constellation Lore(?:\s|.)*?}}", source)[0])).json()['parse']['text']["*"], 'lxml').find("table")

		constellation = {
			"image": (image := soup.select("img")[2]['src'].split("/revision")[0]).split("/")[-1],
			"meaning": soup.select("td")[-1].contents[-1]
		}
		if not os.path.exists("../../../assets/characters/constellation/"+image.split("/")[-1]):
			open("../../../assets/characters/constellation/"+image.split("/")[-1], 'wb').write(requests.get(image).content)
		
		#quests and events
		quests_events = [s and s for i in re.split(r"===(.*?)===", re.sub(r"<!--(?:.|\s)*?-->", "", re.sub(r"\[\[(.*?)\]\]", r"**\1**", re.sub(r"\*+\s*", lambda i: (len(i.group().strip())-1)*"  "+"- ", re.findall(r"==Quests and Events==((?:.|\s)*?)==[0-9A-Za-z\s]*?==\s", source)[0].strip())))) if (s := i.strip()) and "A list of quests" not in s and "not appeared" not in s]
		if len(quests_events) % 2: quests_events.pop()
		quests_events = dict([quests_events[i:i+2] for i in range(0, len(quests_events), 2)])

		#character interactions
		if (interactions := re.findall(r"==Character Interactions==((?:.|\s)*?)==[0-9A-Za-z\s]*?==\s", source)):
			interactions = dict([[re.findall("\[\[(.*?)\]\]", i)[0].strip(), dict(zip(["stories", "voices"], [re.findall("\{\{(.*?)\}\}", i.split("<br />")[0])[0].split("|")[1] for i in [j, k]]))] for (i, j, k) in [i[1:].strip().split("||") for i in interactions[0].strip().split("\n") if i.startswith("|") and i != "|-" and "||" in i]])
		else: interactions = None

		rdata['stories'] = {
			'stories': details, 
			'namecard': namecard,
			'constellation': constellation,
			'quests_events': quests_events,
			'interactions': interactions
		}

		json.dump(rdata, open(i+'.json', 'w', encoding="utf-8"), indent=4)

character_stories()