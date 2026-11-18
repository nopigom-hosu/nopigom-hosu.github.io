import json
import urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime

RSS_URL = "https://rss.blog.naver.com/2jsilver2.xml"

request = urllib.request.Request(RSS_URL, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(request, timeout=30) as response:
    root = ET.fromstring(response.read())

posts = []
for item in root.findall(".//item")[:3]:
    title = (item.findtext("title") or "").strip()
    link = (item.findtext("link") or "").strip()
    published = (item.findtext("pubDate") or "").strip()
    if not title or not link:
        continue
    try:
        date = parsedate_to_datetime(published).strftime("%Y.%m.%d")
    except (TypeError, ValueError):
        date = "네이버 블로그"
    posts.append({"title": title, "link": link, "date": date})

with open("blog-posts.json", "w", encoding="utf-8") as file:
    json.dump(posts, file, ensure_ascii=False, indent=2)
