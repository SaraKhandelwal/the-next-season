import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
a=json.loads((ROOT/'data/attention.json').read_text())
s=json.loads((ROOT/'data/signals.json').read_text())
assert all(x in a['series'] for x in ('fever','wnba','pacers'))
for k,v in a['series'].items():
    pts=v['points'];m=[p['month'] for p in pts]
    assert len(pts)>=35 and m==sorted(m) and len(m)==len(set(m))
    assert all(isinstance(p['views'],int) and p['views']>=0 for p in pts)
fever={p['month']:p['views'] for p in a['series']['fever']['points']}
assert fever['2024-03']==18664 and fever['2024-04']==146680
assert 7.8 < fever['2024-04']/fever['2024-03'] < 8
assert len(s)==3 and len({x['id'] for x in s})==3
for x in s:
    assert x['source'].startswith('https://') and all(x[f] for f in ('title','fact','question','need','risk'))
html=(ROOT/'index.html').read_text();js=(ROOT/'app.js').read_text();css=(ROOT/'styles.css').read_text()
for forbidden in ('Sara Khandelwal','Business Analytics, Purdue','—'):
    assert forbidden not in html+js+css
for cutoff in ('2024-01','2024-02','2024-03'):
    assert f'value="{cutoff}"' in html
assert 'value="2024-04"' not in html
print('Research data and static integrity checks passed')

# Second historical replay should have complete observations for April, May and June 2025.
assert {p["month"]:p["views"] for p in a["series"]["pacers"]["points"] if p["month"] in ("2025-04","2025-05","2025-06")} == {"2025-04":48390,"2025-05":303980,"2025-06":458587}
print("Pacers replay dataset check passed")
