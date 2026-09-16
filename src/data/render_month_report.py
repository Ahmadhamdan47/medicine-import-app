#!/usr/bin/env python3
"""
Render <label>_report.json as a standalone HTML report.

    python3 render_month_report.py --report september_report.json --out september_report.html
"""
import argparse, html, json, statistics
from collections import Counter

PAL = """
:root{
  --ground:#F6F7F5; --surface:#FFFFFF; --sunk:#EFF2EE;
  --ink:#16211D; --muted:#66736C; --faint:#8C978F;
  --rule:#DCE2DE; --rule-strong:#C3CCC6;
  --accent:#1F6B4F; --accent-soft:#E4EFE8;
  --rise:#A8432C; --fall:#2B6C87; --flag:#8A6A2B; --flag-soft:#F5EEDC;
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --ground:#101511; --surface:#171D19; --sunk:#1C2320;
    --ink:#E8EDE9; --muted:#95A29B; --faint:#78857E;
    --rule:#28322C; --rule-strong:#3A463F;
    --accent:#5FB891; --accent-soft:#172C23;
    --rise:#E08A6A; --fall:#7FB8D4; --flag:#D0AC63; --flag-soft:#2A2417;
  }
}
:root[data-theme="dark"]{
  --ground:#101511; --surface:#171D19; --sunk:#1C2320;
  --ink:#E8EDE9; --muted:#95A29B; --faint:#78857E;
  --rule:#28322C; --rule-strong:#3A463F;
  --accent:#5FB891; --accent-soft:#172C23;
  --rise:#E08A6A; --fall:#7FB8D4; --flag:#D0AC63; --flag-soft:#2A2417;
}
"""

CSS = """
*{box-sizing:border-box}
body{margin:0;background:var(--ground);color:var(--ink);
  font-family:"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  font-size:15px;line-height:1.55;-webkit-font-smoothing:antialiased}
.wrap{max-width:1080px;margin:0 auto;padding-inline:20px;padding-block:0 72px}
h1,h2,h3{font-family:Spectral,Georgia,"Times New Roman",serif;text-wrap:balance;margin:0}
.mono{font-family:"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,monospace}
.num{font-variant-numeric:tabular-nums}

/* masthead */
.mast{border-bottom:2px solid var(--ink);padding-block:44px 18px;margin-bottom:34px}
.eyebrow{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);
  font-family:"IBM Plex Mono",monospace}
.mast h1{font-size:clamp(34px,6vw,54px);font-weight:600;line-height:1.02;margin-block:14px 10px;
  letter-spacing:-.015em}
.mast .sub{color:var(--muted);max-width:60ch;font-size:15px}
.mast-meta{display:flex;flex-wrap:wrap;gap:10px 28px;margin-top:20px;font-size:12.5px;
  color:var(--muted);font-family:"IBM Plex Mono",monospace}
.mast-meta b{color:var(--ink);font-weight:600}

/* end state */
.endstate{background:var(--surface);border:1px solid var(--rule);border-radius:3px;
  padding:26px 28px;margin-bottom:12px}
.endstate h2{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);
  font-family:"IBM Plex Mono",monospace;font-weight:600;margin-bottom:20px}
.figs{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:26px 30px}
.fig .v{font-family:Spectral,Georgia,serif;font-size:40px;font-weight:600;line-height:1;
  font-variant-numeric:tabular-nums;letter-spacing:-.02em}
.fig .k{font-size:12px;color:var(--muted);margin-top:7px;line-height:1.35}
.fig.rise .v{color:var(--rise)} .fig.fall .v{color:var(--fall)} .fig.acc .v{color:var(--accent)}

/* sections */
section{margin-top:52px;scroll-margin-top:20px}
.shead{display:flex;align-items:baseline;gap:14px;border-bottom:1px solid var(--rule-strong);
  padding-bottom:10px;margin-bottom:8px}
.snum{font-family:"IBM Plex Mono",monospace;font-size:12px;color:var(--accent);font-weight:600;
  letter-spacing:.08em}
.shead h2{font-size:24px;font-weight:600;letter-spacing:-.01em}
.shead .count{margin-left:auto;font-family:"IBM Plex Mono",monospace;font-size:13px;
  color:var(--muted);font-variant-numeric:tabular-nums;white-space:nowrap}
.lede{color:var(--muted);max-width:68ch;margin-block:12px 20px;font-size:14.5px}

/* tables */
.tw{overflow-x:auto;border:1px solid var(--rule);border-radius:3px;background:var(--surface)}
table{border-collapse:collapse;width:100%;font-size:13px}
th{text-align:left;font-family:"IBM Plex Mono",monospace;font-size:10.5px;letter-spacing:.1em;
  text-transform:uppercase;color:var(--muted);font-weight:500;padding:11px 12px;
  border-bottom:1px solid var(--rule-strong);white-space:nowrap;background:var(--sunk)}
td{padding:9px 12px;border-bottom:1px solid var(--rule);vertical-align:top}
tr:last-child td{border-bottom:none}
td.c{font-family:"IBM Plex Mono",monospace;font-size:12px;color:var(--muted);white-space:nowrap}
td.atc{font-family:"IBM Plex Mono",monospace;font-size:12px;color:var(--accent);white-space:nowrap}
td.b{font-weight:600}
td.n{font-family:"IBM Plex Mono",monospace;font-variant-numeric:tabular-nums;text-align:right;
  white-space:nowrap;font-size:12.5px}
td.ing{color:var(--muted);font-size:12.5px;min-width:190px}
.up{color:var(--rise)} .down{color:var(--fall)}
.pill{display:inline-block;font-family:"IBM Plex Mono",monospace;font-size:10.5px;
  padding:1px 6px;border:1px solid var(--rule-strong);border-radius:2px;color:var(--muted);
  white-space:nowrap}

/* two-up */
.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:22px;align-items:start}

/* bar list */
.bars{display:flex;flex-direction:column;gap:9px;background:var(--surface);
  border:1px solid var(--rule);border-radius:3px;padding:20px 22px}
.bar{display:grid;grid-template-columns:minmax(96px,auto) 1fr auto;gap:12px;align-items:center;
  font-size:13px}
.bar .lbl{color:var(--muted)}
.bar .track{height:7px;background:var(--sunk);border-radius:1px;overflow:hidden}
.bar .fill{height:100%;background:var(--accent);display:block}
.bar .val{font-family:"IBM Plex Mono",monospace;font-variant-numeric:tabular-nums;font-size:12.5px}

/* note */
.note{border-left:2px solid var(--flag);background:var(--flag-soft);padding:16px 20px;
  border-radius:0 3px 3px 0;margin-block:22px;font-size:14px}
.note b{font-weight:600}
.caption{font-size:12.5px;color:var(--faint);margin-top:9px}
footer{margin-top:64px;padding-top:22px;border-top:1px solid var(--rule);
  font-size:12.5px;color:var(--faint);font-family:"IBM Plex Mono",monospace;
  display:flex;flex-wrap:wrap;gap:8px 24px}
@media (max-width:620px){
  .mast{padding-block:30px 16px}
  .fig .v{font-size:32px}
  .bar{grid-template-columns:minmax(80px,auto) 1fr auto}
}
"""


def esc(s):
    return html.escape(str(s if s is not None else ""))


def money(v):
    return "—" if v is None else "{:,.0f}".format(v)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--report", default="september_report.json")
    ap.add_argument("--out", default="september_report.html")
    a = ap.parse_args()

    d = json.load(open(a.report, encoding="utf-8"))
    t = d["templateReport"]
    s1, s2, s3 = (t["section1_newly_marketed"], t["section2_newly_not_marketed"],
                  t["section3_modifications"])
    h, comp = d["headline"], d["dataCompleteness"]
    by = d["changesByField"]

    ps = [p for p in s3["price_stratum_changes"]
          if p["oldPrice"] is not None and p["newPrice"] is not None]
    pct = lambda p: (p["newPrice"] - p["oldPrice"]) / p["oldPrice"] * 100 if p["oldPrice"] else 0
    corr = [p for p in ps if abs(pct(p)) > 1000]          # stale placeholder prices
    real = [p for p in ps if abs(pct(p)) <= 1000]
    up = [p for p in real if p["newPrice"] > p["oldPrice"]]
    dn = [p for p in real if p["newPrice"] < p["oldPrice"]]
    med = statistics.median([abs(pct(p)) for p in real]) if real else 0

    agents = Counter((x["old"], x["new"]) for x in s3["agent_changes"])
    manus = Counter((x["old"], x["new"]) for x in s3["manufacturer_changes"])
    strat = Counter(r["Stratum"] or "—" for r in s1["rows"])
    P = []
    w = P.append

    w('<title>September Mouacher Report</title>')
    w('<link rel="preconnect" href="https://fonts.googleapis.com">')
    w('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>')
    w('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
      'family=Spectral:wght@500;600&family=IBM+Plex+Sans:wght@400;500;600&'
      'family=IBM+Plex+Mono:wght@400;500;600&display=swap">')
    w("<style>" + PAL + CSS + "</style>")

    w('<div class="wrap">')

    # masthead
    w('<header class="mast">')
    w('<div class="eyebrow">Lebanon · Ministry of Public Health · Drug price bulletin</div>')
    w("<h1>September Mouacher</h1>")
    w('<p class="sub">What changed in the MedLeb registers after the mouacher of '
      f'{esc(d["bulletinDate"])} was applied, and what the two databases hold now.</p>')
    w('<div class="mast-meta">')
    w(f'<span>Bulletin <b>{esc(d["bulletinDate"])}</b></span>')
    w(f'<span>Codes in bulletin <b class="num">{d["endState"]["medlist_rows"]:,}</b></span>')
    w(f'<span>Generated <b>{esc(d["generatedAt"][:10])}</b></span>')
    w("</div></header>")

    # end state
    w('<div class="endstate"><h2>End state</h2><div class="figs">')
    for v, k, cls in [
        (f'{d["endState"]["medlist_rows"]:,}', "rows in medlist<br>(exactly the bulletin)", ""),
        (f'{d["endState"]["medapiv2_marketed"]:,}', "marketed drugs in medapiv2", ""),
        (f'{h["newly_marketed"]}', "newly marketed", "acc"),
        (f'{h["newly_not_marketed"]}', "newly not marketed", ""),
        (f'{h["modified"]:,}', "drugs modified", ""),
        (f'{sum(h["fields_backfilled_from_website"].values()):,}',
         "empty fields filled from<br>the MoPH website", "acc"),
    ]:
        w(f'<div class="fig {cls}"><div class="v num">{v}</div><div class="k">{k}</div></div>')
    w("</div></div>")
    w('<p class="caption">medlist mirrors the bulletin exactly. medapiv2 also keeps '
      'delisted drugs, flagged NotMarketed.</p>')

    # section 1
    w("<section><div class='shead'><span class='snum'>01</span>"
      "<h2>Newly marketed</h2>"
      f"<span class='count'>{s1['total_newly_marketed_drugs']} drugs · "
      f"{s1['total_atc_codes_newly_marketed_drugs']} distinct ATC</span></div>")
    w('<p class="lede">Drugs in this bulletin that the register did not hold. '
      'ATC, ingredients and route are not in the bulletin — they come from the '
      'MoPH website scrape, which is why every row below is complete.</p>')
    w('<div class="tw"><table><thead><tr>'
      "<th>Code</th><th>Brand</th><th>ATC</th><th>Ingredients</th><th>Form</th>"
      "<th>Route</th><th>Agent</th><th>Str.</th><th style='text-align:right'>Price L.L</th>"
      "</tr></thead><tbody>")
    for r in sorted(s1["rows"], key=lambda x: x["BrandName"]):
        w("<tr>"
          f'<td class="c">{esc(r["MoPHCode"])}</td>'
          f'<td class="b">{esc(r["BrandName"])}</td>'
          f'<td class="atc">{esc(r["ATC"])}</td>'
          f'<td class="ing">{esc(r["Ingredients"])}</td>'
          f'<td>{esc(r["Form"])}</td>'
          f'<td class="c">{esc(r["Route"])}</td>'
          f'<td>{esc(r["Agent"])}</td>'
          f'<td><span class="pill">{esc(r["Stratum"] or "—")}</span></td>'
          f'<td class="n">{money(r["PublicPrice"])}</td></tr>')
    w("</tbody></table></div>")
    w('<p class="caption">Stratum spread: '
      + " · ".join(f"{esc(k)} {v}" for k, v in sorted(strat.items())) + "</p>")
    w("</section>")

    # section 2
    w("<section><div class='shead'><span class='snum'>02</span>"
      "<h2>Newly not marketed</h2>"
      f"<span class='count'>{s2['total_newly_unmarketed_drugs']} drugs</span></div>")
    w('<p class="lede">Held in the register but absent from this bulletin. '
      'Removed from medlist; flagged NotMarketed in medapiv2 rather than deleted, '
      'so prescribing history stays resolvable.</p>')
    w('<div class="tw"><table><thead><tr><th>Code</th><th>Brand</th><th>ATC</th>'
      "<th>Ingredients</th><th>Agent</th></tr></thead><tbody>")
    for r in sorted(s2["rows"], key=lambda x: x["BrandName"]):
        w("<tr>"
          f'<td class="c">{esc(r["MoPHCode"])}</td>'
          f'<td class="b">{esc(r["BrandName"])}</td>'
          f'<td class="atc">{esc(r["ATC"])}</td>'
          f'<td class="ing">{esc(r["Ingredients"])}</td>'
          f'<td>{esc(r["Agent"])}</td></tr>')
    w("</tbody></table></div></section>")

    # section 3
    w("<section><div class='shead'><span class='snum'>03</span>"
      "<h2>Modifications</h2>"
      f"<span class='count'>{s3['total_modified_drugs']:,} drugs touched</span></div>")
    w('<p class="lede">Fields the bulletin changed on drugs already held. '
      'A drug can appear under more than one field.</p>')

    mx = max(by.values())
    w('<div class="bars">')
    for k, v in sorted(by.items(), key=lambda x: -x[1]):
        w(f'<div class="bar"><span class="lbl">{esc(k)}</span>'
          f'<span class="track"><span class="fill" style="width:{v/mx*100:.1f}%"></span></span>'
          f'<span class="val num">{v:,}</span></div>')
    w("</div>")

    # prices
    w('<div class="cols" style="margin-top:22px">')
    w('<div><div class="tw"><table><thead><tr><th colspan="2">Price movement</th>'
      "</tr></thead><tbody>"
      f'<tr><td>Increases</td><td class="n up">{len(up)}</td></tr>'
      f'<tr><td>Decreases</td><td class="n down">{len(dn)}</td></tr>'
      f'<tr><td>Median move</td><td class="n">{med:.1f}%</td></tr>'
      f'<tr><td>Placeholder corrections</td><td class="n">{len(corr)}</td></tr>'
      "</tbody></table></div></div>")
    w('<div><div class="tw"><table><thead><tr><th>Largest decreases</th>'
      '<th style="text-align:right">L.L</th><th style="text-align:right">Δ</th>'
      "</tr></thead><tbody>")
    for p in sorted(dn, key=pct)[:5]:
        w(f'<tr><td class="b">{esc(p["BrandName"])}</td>'
          f'<td class="n">{money(p["oldPrice"])} → {money(p["newPrice"])}</td>'
          f'<td class="n down">{pct(p):+.0f}%</td></tr>')
    w("</tbody></table></div></div></div>")

    if corr:
        w('<div class="note"><b>Four rows were not price rises.</b> '
          "These drugs had left the bulletin earlier and were carried in the register at a "
          "placeholder price; returning to this bulletin restored a real one. They are "
          "excluded from the median above.<br><br>"
          + "<br>".join(
              f'<span class="mono">{esc(p["MoPHCode"])}</span> {esc(p["BrandName"])} — '
              f'<span class="mono">{money(p["oldPrice"])}</span> → '
              f'<span class="mono">{money(p["newPrice"])} L.L</span>'
              for p in sorted(corr, key=lambda x: -x["newPrice"]))
          + "</div>")

    # agents + manufacturers
    w('<div class="cols" style="margin-top:22px">')
    w('<div><div class="tw"><table><thead><tr><th>Agent transfer</th>'
      '<th style="text-align:right">Drugs</th></tr></thead><tbody>')
    for (o, n), c in agents.most_common():
        w(f'<tr><td>{esc(o)} <span style="color:var(--faint)">→</span> '
          f'<b>{esc(n)}</b></td><td class="n">{c}</td></tr>')
    w("</tbody></table></div>"
      '<p class="caption">266 of these are the same agent respelled with its accent '
      "(Abela Frères), not a transfer of marketing rights.</p></div>")

    w('<div><div class="tw"><table><thead><tr><th>Manufacturer change</th>'
      '<th style="text-align:right">Drugs</th></tr></thead><tbody>')
    for (o, n), c in manus.most_common(8):
        w(f'<tr><td>{esc(o)} <span style="color:var(--faint)">→</span> '
          f'<b>{esc(n)}</b></td><td class="n">{c}</td></tr>')
    w("</tbody></table></div>"
      f'<p class="caption">{len(manus)} distinct changes across '
      f'{sum(manus.values())} drugs.</p></div>')
    w("</div></section>")

    # completeness
    w("<section><div class='shead'><span class='snum'>04</span>"
      "<h2>Register completeness</h2><span class='count'>after backfill</span></div>")
    w('<p class="lede">The bulletin carries 11 commercial columns only, so every drug it '
      'inserts arrives with no ATC, ingredients, route or brand/generic. Those were filled '
      'from the MoPH website for both registers. Counts are cells still empty.</p>')
    w('<div class="cols">')
    for title, key, note in [
        ("medapiv2 · marketed", "medapiv2_marketed", f'{comp["medapiv2_marketed"]["rows"]:,} rows'),
        ("medlist · all rows", "medlist", f'{comp["medlist"]["rows"]:,} rows'),
    ]:
        w(f'<div><div class="tw"><table><thead><tr><th>{esc(title)}</th>'
          f'<th style="text-align:right">{esc(note)}</th></tr></thead><tbody>')
        for col, n in comp[key]["empty"].items():
            mark = "" if n else ' style="color:var(--accent)"'
            w(f'<tr><td class="c">{esc(col)}</td><td class="n"{mark}>{n:,}</td></tr>')
        w("</tbody></table></div></div>")
    w("</div>")
    bf = h["fields_backfilled_from_website"]
    w('<p class="caption">Filled this cycle: '
      + " · ".join(f"{esc(k)} {v:,} cells" for k, v in bf.items())
      + ". No populated cell was overwritten.</p>")
    w("</section>")

    w('<footer><span>MedLeb register update</span>'
      f'<span>Bulletin {esc(d["bulletinDate"])}</span>'
      "<span>medlist · medapiv2</span>"
      "<span>Source: MoPH mouacher + moph.gov.lb</span></footer>")
    w("</div>")

    doc = "\n".join(P)
    open(a.out, "w", encoding="utf-8").write(doc)
    print("wrote {} ({:,} bytes)".format(a.out, len(doc)))


if __name__ == "__main__":
    main()
