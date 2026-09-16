#!/usr/bin/env python3
"""
Render <label>_report.json as a standalone HTML report.

Covers one register (medapiv2) and three things only: what was added, what was
removed, and every field that was modified, each with its before and after.

    python3 render_month_report.py --report september_report.json --out september_report.html
"""
import argparse, html, json
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
.num{font-variant-numeric:tabular-nums}
.mono{font-family:"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,monospace}

.mast{border-bottom:2px solid var(--ink);padding-block:44px 18px;margin-bottom:30px}
.eyebrow{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);
  font-family:"IBM Plex Mono",monospace}
.mast h1{font-size:clamp(34px,6vw,54px);font-weight:600;line-height:1.02;margin-block:14px 10px;
  letter-spacing:-.015em}
.mast .sub{color:var(--muted);max-width:62ch;font-size:15px}
.mast-meta{display:flex;flex-wrap:wrap;gap:10px 28px;margin-top:20px;font-size:12.5px;
  color:var(--muted);font-family:"IBM Plex Mono",monospace}
.mast-meta b{color:var(--ink);font-weight:600}

.figs{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:24px 30px;
  background:var(--surface);border:1px solid var(--rule);border-radius:3px;padding:24px 26px}
.fig .v{font-family:Spectral,Georgia,serif;font-size:38px;font-weight:600;line-height:1;
  font-variant-numeric:tabular-nums;letter-spacing:-.02em}
.fig .k{font-size:12px;color:var(--muted);margin-top:7px;line-height:1.35}
.fig.acc .v{color:var(--accent)}

section{margin-top:50px}
.shead{display:flex;align-items:baseline;gap:14px;border-bottom:1px solid var(--rule-strong);
  padding-bottom:10px}
.snum{font-family:"IBM Plex Mono",monospace;font-size:12px;color:var(--accent);font-weight:600;
  letter-spacing:.08em}
.shead h2{font-size:24px;font-weight:600;letter-spacing:-.01em}
.shead .count{margin-left:auto;font-family:"IBM Plex Mono",monospace;font-size:13px;
  color:var(--muted);font-variant-numeric:tabular-nums;white-space:nowrap}
.lede{color:var(--muted);max-width:70ch;margin-block:14px 20px;font-size:14.5px}

h3.sub{font-family:"IBM Plex Mono",monospace;font-size:11.5px;letter-spacing:.12em;
  text-transform:uppercase;color:var(--ink);font-weight:600;
  margin-block:30px 10px;display:flex;align-items:baseline;gap:10px}
h3.sub .n{margin-left:auto;color:var(--muted);font-weight:400;font-variant-numeric:tabular-nums}
h3.sub .hint{font-weight:400;text-transform:none;letter-spacing:0;color:var(--faint);
  font-family:"IBM Plex Sans",sans-serif;font-size:12.5px}

.tw{overflow-x:auto;border:1px solid var(--rule);border-radius:3px;background:var(--surface)}
table{border-collapse:collapse;width:100%;font-size:13px}
th{text-align:left;font-family:"IBM Plex Mono",monospace;font-size:10.5px;letter-spacing:.1em;
  text-transform:uppercase;color:var(--muted);font-weight:500;padding:10px 12px;
  border-bottom:1px solid var(--rule-strong);white-space:nowrap;background:var(--sunk)}
td{padding:8px 12px;border-bottom:1px solid var(--rule);vertical-align:top}
tr:last-child td{border-bottom:none}
td.c{font-family:"IBM Plex Mono",monospace;font-size:12px;color:var(--muted);white-space:nowrap}
td.atc{font-family:"IBM Plex Mono",monospace;font-size:12px;color:var(--accent);white-space:nowrap}
td.b{font-weight:600}
td.n{font-family:"IBM Plex Mono",monospace;font-variant-numeric:tabular-nums;text-align:right;
  white-space:nowrap;font-size:12.5px}
td.ing{color:var(--muted);font-size:12.5px;min-width:180px}
td.was{color:var(--muted)}
.arrow{color:var(--faint);padding-inline:2px}
.up{color:var(--rise)} .down{color:var(--fall)}
.blank{color:var(--faint);font-style:italic}
.pill{display:inline-block;font-family:"IBM Plex Mono",monospace;font-size:10.5px;
  padding:1px 6px;border:1px solid var(--rule-strong);border-radius:2px;color:var(--muted);
  white-space:nowrap}
.note{border-left:2px solid var(--flag);background:var(--flag-soft);padding:15px 19px;
  border-radius:0 3px 3px 0;margin-block:20px;font-size:13.5px}
.caption{font-size:12.5px;color:var(--faint);margin-top:9px}
footer{margin-top:60px;padding-top:22px;border-top:1px solid var(--rule);
  font-size:12.5px;color:var(--faint);font-family:"IBM Plex Mono",monospace;
  display:flex;flex-wrap:wrap;gap:8px 24px}
@media (max-width:620px){
  .mast{padding-block:30px 16px}
  .fig .v{font-size:31px}
}
"""

# field -> (heading, one-line hint)
FIELD_META = {
    "PublicPrice":        ("Price", "Public price in L.L"),
    "Agent":              ("Agent", "Local marketing agent"),
    "Form":               ("Form", "Pharmaceutical form"),
    "Manufacturer":       ("Manufacturer", "Producing laboratory"),
    "Stratum":            ("Stratum", "Pricing stratum"),
    "Presentation":       ("Presentation", "Pack description"),
    "DrugName":           ("Brand name", "Registered brand name"),
    "Dosage":             ("Dosage", "Strength"),
    "Country":            ("Country", "Country of origin"),
    "RegistrationNumber": ("Registration number", "MoPH registration"),
}
ORDER = ["PublicPrice", "Agent", "Form", "Manufacturer", "Presentation", "Stratum",
         "DrugName", "Dosage", "Country", "RegistrationNumber"]


def esc(s):
    return html.escape(str(s if s is not None else ""))


def money(v):
    return "—" if v is None else "{:,.0f}".format(v)


def cell(v):
    s = "" if v is None else str(v).strip()
    return '<span class="blank">empty</span>' if s == "" else esc(s)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--report", default="september_report.json")
    ap.add_argument("--out", default="september_report.html")
    a = ap.parse_args()

    d = json.load(open(a.report, encoding="utf-8"))
    t = d["templateReport"]
    s1, s2 = t["section1_newly_marketed"], t["section2_newly_not_marketed"]
    cbt = d.get("changesByType", {})
    h = d["headline"]
    total_field_changes = sum(len(v) for v in cbt.values())

    P = []
    w = P.append
    w("<title>September Mouacher Changes</title>")
    w('<link rel="preconnect" href="https://fonts.googleapis.com">')
    w('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>')
    w('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
      "family=Spectral:wght@500;600&family=IBM+Plex+Sans:wght@400;500;600&"
      'family=IBM+Plex+Mono:wght@400;500;600&display=swap">')
    w("<style>" + PAL + CSS + "</style>")
    w('<div class="wrap">')

    # masthead
    w('<header class="mast">')
    w('<div class="eyebrow">Lebanon · Ministry of Public Health · Drug price bulletin</div>')
    w("<h1>September Mouacher Changes</h1>")
    w('<p class="sub">Every change the mouacher of '
      f'{esc(d["bulletinDate"])} made to the medapiv2 drug register: what was added, '
      "what was removed, and each field that was modified, with its value before and after.</p>")
    w('<div class="mast-meta">')
    w(f'<span>Bulletin <b>{esc(d["bulletinDate"])}</b></span>')
    w('<span>Register <b>medapiv2 · drug</b></span>')
    w(f'<span>Marketed after <b class="num">{d["endState"]["medapiv2_marketed"]:,}</b></span>')
    w(f'<span>Generated <b>{esc(d["generatedAt"][:10])}</b></span>')
    w("</div></header>")

    # summary
    w('<div class="figs">')
    for v, k, cls in [
        (f'{h["newly_marketed"]}', "added", "acc"),
        (f'{h["newly_not_marketed"]}', "removed", ""),
        (f'{h["modified"]:,}', "drugs modified", ""),
        (f"{total_field_changes:,}", "individual field changes", ""),
    ]:
        w(f'<div class="fig {cls}"><div class="v num">{v}</div><div class="k">{k}</div></div>')
    w("</div>")

    # 01 added
    w("<section><div class='shead'><span class='snum'>01</span><h2>Added</h2>"
      f"<span class='count'>{s1['total_newly_marketed_drugs']} drugs · "
      f"{s1['total_atc_codes_newly_marketed_drugs']} distinct ATC</span></div>")
    w('<p class="lede">In this bulletin, not previously in the register.</p>')
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
    w("</tbody></table></div></section>")

    # 02 removed
    w("<section><div class='shead'><span class='snum'>02</span><h2>Removed</h2>"
      f"<span class='count'>{s2['total_newly_unmarketed_drugs']} drugs</span></div>")
    w('<p class="lede">Held in the register but absent from this bulletin. Flagged '
      "NotMarketed rather than deleted, so prescribing history stays resolvable.</p>")
    w('<div class="tw"><table><thead><tr><th>Code</th><th>Brand</th><th>ATC</th>'
      "<th>Ingredients</th><th>Form</th><th>Agent</th>"
      "<th style='text-align:right'>Last price L.L</th></tr></thead><tbody>")
    for r in sorted(s2["rows"], key=lambda x: x["BrandName"]):
        w("<tr>"
          f'<td class="c">{esc(r["MoPHCode"])}</td>'
          f'<td class="b">{esc(r["BrandName"])}</td>'
          f'<td class="atc">{esc(r["ATC"])}</td>'
          f'<td class="ing">{esc(r["Ingredients"])}</td>'
          f'<td>{esc(r["Form"])}</td>'
          f'<td>{esc(r["Agent"])}</td>'
          f'<td class="n">{money(r["PublicPrice"])}</td></tr>')
    w("</tbody></table></div></section>")

    # 03 modified
    w("<section><div class='shead'><span class='snum'>03</span><h2>Modified</h2>"
      f"<span class='count'>{h['modified']:,} drugs · "
      f"{total_field_changes:,} field changes</span></div>")
    w('<p class="lede">Every modified field, grouped by what changed. A drug appears '
      "under each field the bulletin altered, so the field changes outnumber the drugs.</p>")

    for f in ORDER + [k for k in cbt if k not in ORDER]:
        rows = cbt.get(f)
        if not rows:
            continue
        title, hint = FIELD_META.get(f, (f, ""))
        w(f'<h3 class="sub">{esc(title)} <span class="hint">{esc(hint)}</span>'
          f'<span class="n">{len(rows):,}</span></h3>')

        if f == "PublicPrice":
            pr = []
            for r in rows:
                b, af = r["before"], r["after"]
                delta = ((af - b) / b * 100) if (b and af is not None) else None
                pr.append((r, delta))
            # placeholder corrections are not price rises; show them apart
            corr = [(r, dl) for r, dl in pr if dl is not None and abs(dl) > 1000]
            real = [(r, dl) for r, dl in pr if not (dl is not None and abs(dl) > 1000)]
            w('<div class="tw"><table><thead><tr><th>Code</th><th>Brand</th>'
              '<th style="text-align:right">Before</th>'
              '<th style="text-align:right">After</th>'
              '<th style="text-align:right">Change</th></tr></thead><tbody>')
            for r, dl in real:
                cls = "up" if dl and dl > 0 else ("down" if dl and dl < 0 else "")
                dtxt = "—" if dl is None else f"{dl:+.1f}%"
                w("<tr>"
                  f'<td class="c">{esc(r["MoPHCode"])}</td>'
                  f'<td class="b">{esc(r["BrandName"])}</td>'
                  f'<td class="n was">{money(r["before"])}</td>'
                  f'<td class="n">{money(r["after"])}</td>'
                  f'<td class="n {cls}">{dtxt}</td></tr>')
            w("</tbody></table></div>")
            if corr:
                w('<div class="note"><b>Carried at a placeholder price.</b> '
                  "These had left an earlier bulletin and sat at a token value; returning "
                  "to this one restored a real price. They are not price rises.</div>")
                w('<div class="tw"><table><thead><tr><th>Code</th><th>Brand</th>'
                  '<th style="text-align:right">Before</th>'
                  '<th style="text-align:right">After</th></tr></thead><tbody>')
                for r, dl in sorted(corr, key=lambda x: -(x[0]["after"] or 0)):
                    w("<tr>"
                      f'<td class="c">{esc(r["MoPHCode"])}</td>'
                      f'<td class="b">{esc(r["BrandName"])}</td>'
                      f'<td class="n was">{money(r["before"])}</td>'
                      f'<td class="n">{money(r["after"])}</td></tr>')
                w("</tbody></table></div>")
            continue

        w('<div class="tw"><table><thead><tr><th>Code</th><th>Brand</th>'
          "<th>Before</th><th>After</th></tr></thead><tbody>")
        for r in rows:
            w("<tr>"
              f'<td class="c">{esc(r["MoPHCode"])}</td>'
              f'<td class="b">{esc(r["BrandName"])}</td>'
              f'<td class="was">{cell(r["before"])}</td>'
              f'<td>{cell(r["after"])}</td></tr>')
        w("</tbody></table></div>")

        if f == "Agent":
            grp = Counter((str(r["before"]), str(r["after"])) for r in rows)
            top = grp.most_common(1)[0]
            w(f'<p class="caption">{top[1]} of these are one agent respelled with its '
              f'accent ({esc(top[0][1])}), not a transfer of marketing rights.</p>')

    w("</section>")

    w('<footer><span>medapiv2 · drug</span>'
      f'<span>Bulletin {esc(d["bulletinDate"])}</span>'
      "<span>Source: MoPH mouacher</span></footer>")
    w("</div>")

    doc = "\n".join(P)
    open(a.out, "w", encoding="utf-8").write(doc)
    print("wrote {} ({:,} bytes)".format(a.out, len(doc)))


if __name__ == "__main__":
    main()
