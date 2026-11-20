"""Fetch public Wikimedia monthly per-article views into the application's JSON cache.
Requires internet access. Do not interpret this traffic as merchandise demand.
"""
import json
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "data" / "attention.json"
START = '2023010100'
END = '2026080100'
SERIES = {
    "fever": ("Indiana Fever", "Indiana_Fever"),
    "pacers": ("Indiana Pacers", "Indiana_Pacers"),
    "wnba": ("WNBA league", "Women's_National_Basketball_Association"),
}

def fetch(name, article):
    article_encoded = urllib.parse.quote(article, safe='')
    url = f'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/{article_encoded}/monthly/{START}/{END}'
    req = urllib.request.Request(url, headers={"User-Agent":"FeverResearchPrototype/1.0 (independent public Wikimedia research)","Accept":"application/json"})
    with urllib.request.urlopen(req, timeout=30) as response:
        payload = json.load(response)
    points = [{"month":row["timestamp"][:4]+'-'+row["timestamp"][4:6],"views":int(row["views"])} for row in payload['items']]
    months = [p['month'] for p in points]
    if len(points) < 36 or len(set(months)) != len(months) or any(p['views'] < 0 for p in points):
        raise ValueError(f'Unexpected/missing data for {article}')
    return {"name": name, "article": article, "source": url, "points": points}

def main():
    data={"asOf":datetime.now(timezone.utc).date().isoformat(),"through":"2026-08", "description":"Monthly English Wikipedia article pageviews, all-access, user agents. Not sales, revenue or demand.", "series":{}}
    for key,(name,article) in SERIES.items():
        data['series'][key]=fetch(name,article)
    fever={p['month']:p['views'] for p in data['series']['fever']['points']}
    if fever.get('2024-03')!=18664 or fever.get('2024-04')!=146680:
        raise ValueError('March/April 2024 validation mismatch; cache was not overwritten')
    OUT.write_text(json.dumps(data,indent=2)+'\n',encoding='utf-8')
    print('Updated:',OUT)
if __name__=='__main__':main()
