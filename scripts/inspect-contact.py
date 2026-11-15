from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin
import re,json
p=Path('.openai/local/current-site.html')
text=p.read_text(encoding='utf-8',errors='replace')
class Page(HTMLParser):
    def __init__(self):super().__init__();self.links=[];self.scripts=[];self.texts=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='a' and a.get('href'):self.links.append(a['href'])
        if tag=='script' and a.get('src'):self.scripts.append(urljoin('https://untold.com.br/',a['src']))
    def handle_data(self,data):
        if 'contato' in data.lower() or 'whatsapp' in data.lower():self.texts.append(data[:1000])
page=Page();page.feed(text)
print(json.dumps({'bytes':len(text),'title':re.findall(r'<title>(.*?)</title>',text),'contacts':[u for u in page.links if any(s in u.lower() for s in ['mailto:','wa.me','whatsapp','tel:'])],'emails':sorted(set(re.findall(r'[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}',text))),'scripts':page.scripts,'contactText':page.texts[:8]},ensure_ascii=False,indent=2))
