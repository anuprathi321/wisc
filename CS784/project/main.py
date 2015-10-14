import requests
import csv
import urllib
from bs4 import BeautifulSoup

def parsePage(zipcode, page, count):

	url ="http://www.yellowpages.com/search?search_terms=restaurants&geo_location_terms=" + str(zipcode) + "&page=" + str(page)

	output_file = "./source/" + str(page) + "_" + str(zipcode).strip() + ".html"
	urllib.urlretrieve(url,output_file)

	try:
		r = requests.get(url)
		soup = BeautifulSoup(r.content, "lxml")

		g_data = soup.find_all("div", {"class":"info"})
		
		

		#resturants names on a page
		for item in g_data:

			d_name = ""
			d_street_address = ""
			d_city = ""
			d_state = ""
			d_zipcode = ""
			d_phone = ""
			d_website_link = ""

			
			try:
				d_name = item.contents[0].find_all("a", {"class": "business-name"})[0].text
			except:
				pass
			try:
				d_street_address = item.contents[1].find_all("span", {"class": "street-address"})[0].text
			except:	
				pass
			try:
				d_city = item.contents[1].find_all("span", {"class": "locality"})[0].text.replace(',', "")
			except:	
				pass
			try:
				d_state = item.contents[1].find_all("span", {"itemprop": "addressRegion"})[0].text
			except:	
				pass
			try:
				d_zipcode =  item.contents[1].find_all("span", {"itemprop": "postalCode"})[0].text
			except:	
				pass
			
			try:
				d_phone =  item.contents[1].find_all("div", {"class": "primary"})[0].text
			except:
				pass
			#for link in item.find_all("a", {"class": "business-name"}):
			#	print link.get("href")
			try:
				for link in item.find_all("a", {"class": "track-visit-website"}):
					d_website_link =  link.get("href")
			except:
				pass

			count = count + 1;
		
			with open('test.csv', 'a') as fp:
				a = csv.writer(fp)
				if d_name != "":
					data = [str(count), d_name, d_street_address, d_city, d_state, d_zipcode, d_phone, d_website_link]
					a.writerows([data])
	except:
		with open('errors.csv', 'a') as fp:
			a = csv.writer(fp)
			data = [str(count), str(page), str(zipcode)]
			a.writerows([data])

	return count;


if __name__ == "__main__":
	
	count = 1;

	with open("z1.txt", "r") as lines:
	    for line in lines: 
			zipcode = line
			i = 1
			for i in range(5):
				count = parsePage(zipcode, i, count)

