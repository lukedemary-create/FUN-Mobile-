import { useState, useMemo } from 'react'
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Info, Home } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, ReferenceLine, Cell,
} from 'recharts'
import ScreenHeader from '../../navigation/ScreenHeader'
import { C, UI, MONO, DISPLAY } from '../../tokens'

/* ─── formatters ─────────────────────────────────────────── */
const fmtK = n => {
  const a = Math.abs(n)
  if (a >= 1_000_000) return '$' + (n/1_000_000).toFixed(2) + 'M'
  if (a >= 1_000)     return '$' + Math.round(n/1_000) + 'K'
  return '$' + Math.round(n).toLocaleString()
}

/* ─── shared primitives ───────────────────────────────────── */
function Label({ children }) {
  return <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:C.t3, marginBottom:6 }}>{children}</div>
}
function Body({ children }) {
  return <p style={{ fontFamily:UI, fontSize:13, color:C.t2, lineHeight:1.7, margin:'0 0 12px' }}>{children}</p>
}
function Callout({ color, icon:Icon, label, children }) {
  return (
    <div style={{ display:'flex', gap:10, padding:'12px 14px', background:`${color}10`, border:`1px solid ${color}28`, borderRadius:12, marginBottom:12 }}>
      {Icon && <Icon size={14} color={color} style={{ flexShrink:0, marginTop:1 }} />}
      <div>
        {label && <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, color, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>{label}</div>}
        <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.6 }}>{children}</div>
      </div>
    </div>
  )
}
function BulletList({ items, color }) {
  return (
    <div style={{ marginBottom:12 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display:'flex', gap:8, marginBottom:6, alignItems:'flex-start' }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background:color||C.tangerine, flexShrink:0, marginTop:5 }} />
          <span style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.6 }}>{item}</span>
        </div>
      ))}
    </div>
  )
}
function SliderRow({ label, value, min, max, step, onChange, display, color }) {
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
        <span style={{ fontFamily:UI, fontSize:12, color:C.t2, fontWeight:600 }}>{label}</span>
        <span style={{ fontFamily:MONO, fontSize:13, fontWeight:700, color:color||C.tangerine }}>{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(+e.target.value)} style={{ width:'100%', accentColor:color||C.tangerine }} />
    </div>
  )
}

/* ─── inner tab bar ───────────────────────────────────────── */
function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display:'flex', gap:4, background:'rgba(28,21,16,0.06)', borderRadius:12, padding:4, marginBottom:14 }}>
      {tabs.map((t,i) => (
        <button key={t} onClick={()=>onChange(i)} style={{
          flex:1, padding:'7px 4px', borderRadius:9,
          background: active===i ? C.surf : 'transparent',
          border: active===i ? `1px solid ${C.b1}` : '1px solid transparent',
          fontFamily:UI, fontSize:11, fontWeight:700,
          color: active===i ? C.t1 : C.t3,
          cursor:'pointer', transition:'all .15s',
          boxShadow: active===i ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
        }}>{t}</button>
      ))}
    </div>
  )
}

/* ─── section accordion ──────────────────────────────────── */
function Section({ title, badge, badgeColor, icon:Icon, children, defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen)
  const color = badgeColor || C.tangerine
  return (
    <div style={{ background:C.surf, border:`1.5px solid ${open?color+'45':C.b1}`, borderRadius:18, overflow:'hidden', marginBottom:10 }}>
      <div style={{ height:3, background:`linear-gradient(90deg,${color} 0%,transparent 70%)` }} />
      <button onClick={()=>setOpen(v=>!v)} style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'14px 16px', background:'none', border:'none', cursor:'pointer', textAlign:'left' }}>
        {Icon && (
          <div style={{ width:36, height:36, borderRadius:10, background:`${color}14`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Icon size={17} color={color} strokeWidth={1.8} />
          </div>
        )}
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:UI, fontSize:14, fontWeight:700, color:C.t1 }}>{title}</div>
          {badge && <div style={{ fontFamily:UI, fontSize:11, color:C.t3, marginTop:1 }}>{badge}</div>}
        </div>
        {open ? <ChevronUp size={16} color={color}/> : <ChevronDown size={16} color={C.t3}/>}
      </button>
      {open && (
        <div style={{ padding:'0 16px 16px', borderTop:`1px solid ${C.b1}` }}>
          <div style={{ height:12 }} />
          {children}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */

/* BEA Regional Price Parities 2024 (released Feb 2026)
   RPP < 100 → more purchasing power than US average
   RPP > 100 → less purchasing power than US average          */
const RPP_DATA = [
  { state:'West Virginia', abbr:'WV', rpp:83.7 },
  { state:'Mississippi',   abbr:'MS', rpp:87.0 },
  { state:'Arkansas',      abbr:'AR', rpp:86.9 },
  { state:'Alabama',       abbr:'AL', rpp:87.5 },
  { state:'Kentucky',      abbr:'KY', rpp:87.5 },
  { state:'Oklahoma',      abbr:'OK', rpp:87.8 },
  { state:'Iowa',          abbr:'IA', rpp:87.8 },
  { state:'Louisiana',     abbr:'LA', rpp:88.4 },
  { state:'New Mexico',    abbr:'NM', rpp:90.8 },
  { state:'Missouri',      abbr:'MO', rpp:90.5 },
  { state:'Kansas',        abbr:'KS', rpp:91.0 },
  { state:'Indiana',       abbr:'IN', rpp:90.8 },
  { state:'Tennessee',     abbr:'TN', rpp:91.3 },
  { state:'South Carolina',abbr:'SC', rpp:91.5 },
  { state:'Ohio',          abbr:'OH', rpp:92.5 },
  { state:'Michigan',      abbr:'MI', rpp:93.4 },
  { state:'North Carolina',abbr:'NC', rpp:93.0 },
  { state:'Nebraska',      abbr:'NE', rpp:92.8 },
  { state:'South Dakota',  abbr:'SD', rpp:93.5 },
  { state:'Wisconsin',     abbr:'WI', rpp:94.7 },
  { state:'North Dakota',  abbr:'ND', rpp:95.7 },
  { state:'Wyoming',       abbr:'WY', rpp:95.5 },
  { state:'Georgia',       abbr:'GA', rpp:95.3 },
  { state:'Texas',         abbr:'TX', rpp:95.9 },
  { state:'Pennsylvania',  abbr:'PA', rpp:95.6 },
  { state:'Idaho',         abbr:'ID', rpp:97.6 },
  { state:'Illinois',      abbr:'IL', rpp:97.4 },
  { state:'Minnesota',     abbr:'MN', rpp:98.6 },
  { state:'Nevada',        abbr:'NV', rpp:98.8 },
  { state:'Arizona',       abbr:'AZ', rpp:98.2 },
  { state:'Utah',          abbr:'UT', rpp:99.2 },
  { state:'Montana',       abbr:'MT', rpp:99.7 },
  { state:'Maine',         abbr:'ME', rpp:99.9 },
  { state:'Delaware',      abbr:'DE', rpp:100.1 },
  { state:'Virginia',      abbr:'VA', rpp:100.5 },
  { state:'Florida',       abbr:'FL', rpp:100.6 },
  { state:'Colorado',      abbr:'CO', rpp:101.8 },
  { state:'Oregon',        abbr:'OR', rpp:102.3 },
  { state:'Vermont',       abbr:'VT', rpp:102.5 },
  { state:'Washington',    abbr:'WA', rpp:103.5 },
  { state:'New Hampshire', abbr:'NH', rpp:103.2 },
  { state:'Alaska',        abbr:'AK', rpp:104.2 },
  { state:'Rhode Island',  abbr:'RI', rpp:103.8 },
  { state:'Maryland',      abbr:'MD', rpp:104.8 },
  { state:'Connecticut',   abbr:'CT', rpp:105.8 },
  { state:'Massachusetts', abbr:'MA', rpp:107.5 },
  { state:'New York',      abbr:'NY', rpp:109.2 },
  { state:'New Jersey',    abbr:'NJ', rpp:108.8 },
  { state:'DC',            abbr:'DC', rpp:109.9 },
  { state:'Hawaii',        abbr:'HI', rpp:110.0 },
  { state:'California',    abbr:'CA', rpp:110.7 },
].sort((a,b)=>a.rpp-b.rpp)

/* WalletHub 2026 / Tax Foundation methodology — effective property tax rates */
const TAX_DATA = [
  { state:'Hawaii',         abbr:'HI', rate:0.27, medHome:636451, medTax:1719 },
  { state:'Alabama',        abbr:'AL', rate:0.38, medHome:172136, medTax:654  },
  { state:'Nevada',         abbr:'NV', rate:0.47, medHome:361614, medTax:1700 },
  { state:'Arizona',        abbr:'AZ', rate:0.48, medHome:342119, medTax:1642 },
  { state:'Colorado',       abbr:'CO', rate:0.48, medHome:472278, medTax:2268 },
  { state:'South Carolina', abbr:'SC', rate:0.48, medHome:193356, medTax:928  },
  { state:'Idaho',          abbr:'ID', rate:0.49, medHome:329990, medTax:1617 },
  { state:'Delaware',       abbr:'DE', rate:0.50, medHome:285285, medTax:1428 },
  { state:'Tennessee',      abbr:'TN', rate:0.50, medHome:231002, medTax:1155 },
  { state:'Utah',           abbr:'UT', rate:0.52, medHome:393078, medTax:2044 },
  { state:'West Virginia',  abbr:'WV', rate:0.53, medHome:135574, medTax:719  },
  { state:'Louisiana',      abbr:'LA', rate:0.55, medHome:179769, medTax:988  },
  { state:'Arkansas',       abbr:'AR', rate:0.55, medHome:149372, medTax:822  },
  { state:'Wyoming',        abbr:'WY', rate:0.57, medHome:279917, medTax:1595 },
  { state:'DC',             abbr:'DC', rate:0.58, medHome:601147, medTax:3487 },
  { state:'North Carolina', abbr:'NC', rate:0.66, medHome:234900, medTax:1550 },
  { state:'New Mexico',     abbr:'NM', rate:0.70, medHome:222647, medTax:1558 },
  { state:'California',     abbr:'CA', rate:0.70, medHome:659676, medTax:4618 },
  { state:'Montana',        abbr:'MT', rate:0.72, medHome:339881, medTax:2447 },
  { state:'Mississippi',    abbr:'MS', rate:0.72, medHome:152980, medTax:1101 },
  { state:'Virginia',       abbr:'VA', rate:0.73, medHome:353900, medTax:2583 },
  { state:'Indiana',        abbr:'IN', rate:0.74, medHome:195613, medTax:1448 },
  { state:'Kentucky',       abbr:'KY', rate:0.75, medHome:186907, medTax:1402 },
  { state:'Florida',        abbr:'FL', rate:0.76, medHome:351700, medTax:2673 },
  { state:'Georgia',        abbr:'GA', rate:0.77, medHome:265000, medTax:2041 },
  { state:'Oklahoma',       abbr:'OK', rate:0.80, medHome:177756, medTax:1422 },
  { state:'Oregon',         abbr:'OR', rate:0.81, medHome:416700, medTax:3375 },
  { state:'Washington',     abbr:'WA', rate:0.81, medHome:461700, medTax:3740 },
  { state:'Missouri',       abbr:'MO', rate:0.85, medHome:213400, medTax:1814 },
  { state:'Maryland',       abbr:'MD', rate:0.97, medHome:380500, medTax:3692 },
  { state:'North Dakota',   abbr:'ND', rate:0.99, medHome:231000, medTax:2287 },
  { state:'Minnesota',      abbr:'MN', rate:1.02, medHome:299100, medTax:3051 },
  { state:'Maine',          abbr:'ME', rate:1.02, medHome:255900, medTax:2610 },
  { state:'South Dakota',   abbr:'SD', rate:1.06, medHome:209900, medTax:2225 },
  { state:'Massachusetts',  abbr:'MA', rate:1.07, medHome:482900, medTax:5167 },
  { state:'Alaska',         abbr:'AK', rate:1.11, medHome:315700, medTax:3504 },
  { state:'Rhode Island',   abbr:'RI', rate:1.21, medHome:322900, medTax:3907 },
  { state:'Michigan',       abbr:'MI', rate:1.25, medHome:212400, medTax:2655 },
  { state:'Kansas',         abbr:'KS', rate:1.29, medHome:195800, medTax:2526 },
  { state:'Pennsylvania',   abbr:'PA', rate:1.30, medHome:243900, medTax:3171 },
  { state:'Ohio',           abbr:'OH', rate:1.31, medHome:202400, medTax:2651 },
  { state:'Iowa',           abbr:'IA', rate:1.39, medHome:183700, medTax:2553 },
  { state:'Wisconsin',      abbr:'WI', rate:1.42, medHome:241300, medTax:3426 },
  { state:'Texas',          abbr:'TX', rate:1.49, medHome:300400, medTax:4476 },
  { state:'Nebraska',       abbr:'NE', rate:1.49, medHome:209400, medTax:3120 },
  { state:'New York',       abbr:'NY', rate:1.55, medHome:369200, medTax:5722 },
  { state:'Vermont',        abbr:'VT', rate:1.59, medHome:249000, medTax:3959 },
  { state:'New Hampshire',  abbr:'NH', rate:1.66, medHome:348100, medTax:5779 },
  { state:'Connecticut',    abbr:'CT', rate:1.81, medHome:316200, medTax:5724 },
  { state:'Illinois',       abbr:'IL', rate:2.01, medHome:232900, medTax:4680 },
  { state:'New Jersey',     abbr:'NJ', rate:2.11, medHome:395700, medTax:8350 },
]

/* ═══════════════════════════════════════════════════════════
   SECTION: PURCHASING POWER (BEA RPP)
═══════════════════════════════════════════════════════════ */
function PurchasingPower() {
  const [tab, setTab] = useState(0)

  const best5   = RPP_DATA.slice(0, 5)
  const worst5  = [...RPP_DATA].reverse().slice(0, 5)
  const midList = RPP_DATA.filter(d => d.rpp >= 94 && d.rpp <= 106)

  const rppColor = r => r < 90 ? '#4a7c59' : r < 96 ? '#7ab888' : r < 101 ? C.tangerine : r < 106 ? '#e07c3a' : C.down

  return (
    <>
      <Body>The BEA's Regional Price Parities (RPP) measure how far your dollar goes in each state relative to the national average (100). An RPP of 87 means prices are 13% cheaper than average — your dollar buys 15% more.</Body>
      <Tabs tabs={['Best Value','All States','Priciest']} active={tab} onChange={setTab} />

      {tab === 0 && (
        <>
          <Label>Most Purchasing Power — Lowest RPP (2024)</Label>
          {best5.map((d,i) => (
            <div key={d.abbr} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:C.raise, borderRadius:12, marginBottom:6 }}>
              <div style={{ fontFamily:MONO, fontSize:12, fontWeight:800, color:C.t3, width:18 }}>#{i+1}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.t1 }}>{d.state}</div>
                <div style={{ fontFamily:UI, fontSize:11, color:C.t3 }}>Prices {(100-d.rpp).toFixed(1)}% below US average</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:MONO, fontSize:16, fontWeight:800, color:'#4a7c59' }}>{d.rpp}</div>
                <div style={{ fontFamily:UI, fontSize:9, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em' }}>RPP</div>
              </div>
            </div>
          ))}
          <Callout color="#4a7c59" icon={CheckCircle2} label="What This Means">A $60,000 salary in West Virginia (RPP 83.7) has the same real purchasing power as ~$71,700 in a state at the national average. Cost of living matters as much as income.</Callout>
          <BulletList items={[
            'Appalachia and Deep South states consistently show the highest real purchasing power',
            'Remote work has made these markets attractive — but rising demand is gradually lifting prices',
            'Low RPP states often have lower wages too — compare both RPP and median income when evaluating a move',
          ]} color="#4a7c59" />
        </>
      )}

      {tab === 1 && (
        <>
          <Label>All States — BEA RPP 2024 (100 = US average)</Label>
          <div style={{ height:460, marginBottom:12 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RPP_DATA} margin={{ top:4, right:4, bottom:0, left:0 }} layout="vertical">
                <XAxis type="number" domain={[80,115]} tick={{ fontFamily:MONO, fontSize:8, fill:C.t3 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="abbr" tick={{ fontFamily:MONO, fontSize:8, fill:C.t2 }} axisLine={false} tickLine={false} width={22} />
                <ReferenceLine x={100} stroke={C.b2} strokeDasharray="4 3" />
                <Tooltip contentStyle={{ background:C.surf, border:`1px solid ${C.b1}`, borderRadius:8, fontFamily:UI, fontSize:11 }}
                  formatter={(v,n,p) => [p.payload.rpp.toFixed(1), p.payload.state]}
                  labelStyle={{ display:'none' }} />
                <Bar dataKey="rpp" radius={[0,4,4,0]}>
                  {RPP_DATA.map((d,i) => <Cell key={i} fill={rppColor(d.rpp)} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:8 }}>
            {[['<90 — Great value','#4a7c59'],['90–95 — Good value','#7ab888'],['96–101 — Near avg',C.tangerine],['102–106 — Above avg','#e07c3a'],['>106 — Expensive',C.down]].map(([l,c])=>(
              <div key={l} style={{ display:'flex', alignItems:'center', gap:4 }}>
                <div style={{ width:8, height:8, borderRadius:2, background:c }} />
                <span style={{ fontFamily:UI, fontSize:10, color:C.t3 }}>{l}</span>
              </div>
            ))}
          </div>
          <div style={{ fontFamily:UI, fontSize:10, color:C.t3, marginTop:4 }}>Source: BEA Regional Price Parities 2024 (released Feb 2026). Dashed line = US average (100).</div>
        </>
      )}

      {tab === 2 && (
        <>
          <Label>Least Purchasing Power — Highest RPP (2024)</Label>
          {worst5.map((d,i) => (
            <div key={d.abbr} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:C.raise, borderRadius:12, marginBottom:6 }}>
              <div style={{ fontFamily:MONO, fontSize:12, fontWeight:800, color:C.t3, width:18 }}>#{i+1}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.t1 }}>{d.state}</div>
                <div style={{ fontFamily:UI, fontSize:11, color:C.t3 }}>Prices {(d.rpp-100).toFixed(1)}% above US average</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:MONO, fontSize:16, fontWeight:800, color:C.down }}>{d.rpp}</div>
                <div style={{ fontFamily:UI, fontSize:9, color:C.t3, textTransform:'uppercase', letterSpacing:'0.1em' }}>RPP</div>
              </div>
            </div>
          ))}
          <Callout color={C.down} icon={AlertTriangle} label="High Income ≠ High Purchasing Power">California's median household income is ~$84K — but an RPP of 110.7 means you need ~$95K elsewhere to have the same real standard of living. Always adjust for RPP when comparing job offers across states.</Callout>
          <BulletList items={[
            'Housing is the primary driver of high RPPs in coastal states — not all goods are equally expensive',
            'Commuter suburbs of expensive metros often have RPPs 5–10 points lower than the city core',
            'High-RPP states often have higher wages — the question is whether the wage premium exceeds the cost premium',
          ]} color={C.down} />
        </>
      )}
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION: PROPERTY TAX (all 50 states + DC)
═══════════════════════════════════════════════════════════ */
function PropertyTax() {
  const [tab, setTab]       = useState(0)
  const [homeVal, setHome]  = useState(350000)

  const lowest10  = TAX_DATA.slice(0, 10)
  const highest10 = [...TAX_DATA].slice(-10).reverse()

  const rateColor = r => r < 0.55 ? '#4a7c59' : r < 1.00 ? C.tangerine : r < 1.55 ? '#e07c3a' : C.down

  return (
    <>
      <Body>Property tax is a fixed annual cost of ownership — and it varies by 8× across states. Source: WalletHub 2026 based on U.S. Census ACS data, consistent with Tax Foundation methodology.</Body>
      <Tabs tabs={['Lowest','Highest','All States','Estimator']} active={tab} onChange={setTab} />

      {tab === 0 && (
        <>
          <Label>Lowest Effective Rates — Best for Owners</Label>
          {lowest10.map((d,i) => (
            <div key={d.abbr} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', background:C.raise, borderRadius:12, marginBottom:5 }}>
              <div style={{ fontFamily:MONO, fontSize:11, fontWeight:800, color:C.t3, width:18 }}>#{i+1}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.t1 }}>{d.state}</div>
                <div style={{ fontFamily:UI, fontSize:10, color:C.t3 }}>Med. home {fmtK(d.medHome)} · Med. tax {fmtK(d.medTax)}/yr</div>
              </div>
              <div style={{ fontFamily:MONO, fontSize:15, fontWeight:800, color:'#4a7c59' }}>{d.rate.toFixed(2)}%</div>
            </div>
          ))}
          <Callout color="#4a7c59" icon={Info} label="Hawaii Nuance">Hawaii's 0.27% rate looks unbeatable — but median home values of $636K mean even this low rate produces $1,700+/year in taxes. Always look at the dollar amount, not just the rate.</Callout>
        </>
      )}

      {tab === 1 && (
        <>
          <Label>Highest Effective Rates — Most Expensive</Label>
          {highest10.map((d,i) => (
            <div key={d.abbr} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', background:C.raise, borderRadius:12, marginBottom:5 }}>
              <div style={{ fontFamily:MONO, fontSize:11, fontWeight:800, color:C.t3, width:18 }}>#{i+1}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.t1 }}>{d.state}</div>
                <div style={{ fontFamily:UI, fontSize:10, color:C.t3 }}>Med. home {fmtK(d.medHome)} · Med. tax {fmtK(d.medTax)}/yr</div>
              </div>
              <div style={{ fontFamily:MONO, fontSize:15, fontWeight:800, color:C.down }}>{d.rate.toFixed(2)}%</div>
            </div>
          ))}
          <Callout color={C.down} icon={AlertTriangle} label="New Jersey">At 2.11%, a $400K home costs $8,440/year in property taxes — $703/month on top of your mortgage. Factoring this into your true monthly housing cost is essential when comparing markets.</Callout>
        </>
      )}

      {tab === 2 && (
        <>
          <Label>All 51 Jurisdictions by Effective Rate</Label>
          <div style={{ height:560, marginBottom:8 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TAX_DATA} margin={{ top:4, right:8, bottom:0, left:0 }} layout="vertical">
                <XAxis type="number" domain={[0,2.3]} tickFormatter={v=>v+'%'} tick={{ fontFamily:MONO, fontSize:8, fill:C.t3 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="abbr" tick={{ fontFamily:MONO, fontSize:8, fill:C.t2 }} axisLine={false} tickLine={false} width={22} />
                <ReferenceLine x={1.0} stroke={C.b2} strokeDasharray="4 3" />
                <Tooltip contentStyle={{ background:C.surf, border:`1px solid ${C.b1}`, borderRadius:8, fontFamily:UI, fontSize:11 }}
                  formatter={(v,n,p) => [`${p.payload.rate.toFixed(2)}% — ${fmtK(p.payload.medTax)}/yr median`, p.payload.state]}
                  labelStyle={{ display:'none' }} />
                <Bar dataKey="rate" radius={[0,4,4,0]}>
                  {TAX_DATA.map((d,i) => <Cell key={i} fill={rateColor(d.rate)} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ fontFamily:UI, fontSize:10, color:C.t3 }}>Dashed line = 1.0% national reference. Source: WalletHub 2026 / Tax Foundation methodology.</div>
        </>
      )}

      {tab === 3 && (
        <>
          <Body>See what you'd pay annually in any state at your home's value.</Body>
          <SliderRow label="Home Value" value={homeVal} min={100000} max={1500000} step={10000} onChange={setHome} display={fmtK(homeVal)} />
          <div style={{ marginTop:4, maxHeight:380, overflowY:'auto' }}>
            {TAX_DATA.map(d => {
              const annual = homeVal * d.rate/100
              return (
                <div key={d.abbr} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:`1px solid ${C.b1}` }}>
                  <div>
                    <span style={{ fontFamily:UI, fontSize:12, color:C.t1, fontWeight:600 }}>{d.state}</span>
                    <span style={{ fontFamily:MONO, fontSize:10, color:C.t3, marginLeft:6 }}>{d.rate.toFixed(2)}%</span>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:MONO, fontSize:13, fontWeight:700, color:rateColor(d.rate) }}>{fmtK(annual)}/yr</div>
                    <div style={{ fontFamily:MONO, fontSize:10, color:C.t3 }}>{fmtK(annual/12)}/mo</div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION: TRUE COST OF HOMEOWNERSHIP
═══════════════════════════════════════════════════════════ */
function TrueCost() {
  const [price,   setPrice]  = useState(400000)
  const [rate,    setRate]   = useState(6.82)
  const [down,    setDown]   = useState(20)
  const [taxRate, setTaxR]   = useState(0.85)

  const loan      = price * (1 - down/100)
  const r         = rate/100/12, n = 360
  const pmt       = r > 0 ? loan*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1) : loan/n
  const propTax   = price * taxRate/100 / 12
  const insurance = price * 0.005 / 12
  const pmi       = down < 20 ? loan * 0.01 / 12 : 0
  const maint     = price * 0.01 / 12
  const total     = pmt + propTax + insurance + pmi + maint
  const items     = [
    { label:'Principal & Interest', val:pmt,      color:'#3b82f6' },
    { label:'Property Tax',         val:propTax,  color:C.tangerine },
    { label:'Homeowners Insurance', val:insurance, color:'#a855f7' },
    { label:'PMI (if <20% down)',   val:pmi,      color:C.down },
    { label:'Maintenance (1%/yr)',  val:maint,    color:C.sage },
  ].filter(i => i.val > 0)

  return (
    <>
      <Body>The mortgage payment is just one piece. Property tax, insurance, PMI, and maintenance routinely add 40–60% on top of P&I — often the difference between a comfortable payment and financial stress.</Body>
      <div style={{ background:C.raise, borderRadius:14, padding:'14px', marginBottom:14 }}>
        <SliderRow label="Home Price"       value={price}   min={150000} max={1500000} step={10000}  onChange={setPrice} display={fmtK(price)} />
        <SliderRow label="Down Payment"     value={down}    min={3}      max={40}      step={1}       onChange={setDown}  display={down+'%'}          color="#3b82f6" />
        <SliderRow label="Interest Rate"    value={rate}    min={3}      max={10}      step={0.01}    onChange={setRate}  display={rate.toFixed(2)+'%'} color="#a855f7" />
        <SliderRow label="Property Tax Rate" value={taxRate} min={0.27}  max={2.11}    step={0.01}   onChange={setTaxR}  display={taxRate.toFixed(2)+'%'} color={C.tangerine} />
      </div>
      <div style={{ background:C.ink, borderRadius:16, padding:'16px', marginBottom:14, textAlign:'center' }}>
        <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(250,246,237,0.45)', marginBottom:4 }}>True Monthly Cost</div>
        <div style={{ fontFamily:MONO, fontSize:32, fontWeight:800, color:C.cream }}>{fmtK(total)}/mo</div>
        <div style={{ fontFamily:UI, fontSize:11, color:'rgba(250,246,237,0.5)', marginTop:4 }}>vs. {fmtK(pmt)}/mo P&amp;I only — {Math.round((total/pmt-1)*100)}% more</div>
      </div>
      {items.map((it,i) => (
        <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:`1px solid ${C.b1}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:10, height:10, borderRadius:2, background:it.color }} />
            <span style={{ fontFamily:UI, fontSize:12, color:C.t2 }}>{it.label}</span>
          </div>
          <span style={{ fontFamily:MONO, fontSize:13, fontWeight:700, color:it.color }}>{fmtK(it.val)}/mo</span>
        </div>
      ))}
      <Callout color={C.sage} icon={Info} label="The 28% Rule" style={{ marginTop:12 }}>Total housing (PITI) should stay under 28% of gross monthly income. At {fmtK(total)}/mo you need at least {fmtK((total/0.28)*12)}/yr gross income.</Callout>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION: AMORTIZATION
═══════════════════════════════════════════════════════════ */
function AmortizationSection() {
  const [loan,  setLoan]  = useState(320000)
  const [rate,  setRate]  = useState(6.82)
  const [years, setYears] = useState(30)

  const data = useMemo(() => {
    const r = rate/100/12, n = years*12
    const pmt = r > 0 ? loan*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1) : loan/n
    let bal = loan
    const byYear = []
    for (let y=1; y<=years; y++) {
      let intY=0, prinY=0
      for (let m=0; m<12; m++) {
        const int = bal*r, prin = pmt-int
        intY += int; prinY += prin
        bal = Math.max(0, bal-prin)
      }
      byYear.push({ yr:y, interest:Math.round(intY), principal:Math.round(prinY), balance:Math.round(bal) })
    }
    return { rows:byYear, pmt, totalInterest:pmt*n-loan }
  }, [loan,rate,years])

  return (
    <>
      <Body>In the early years of a mortgage, the vast majority of your payment goes to interest — not equity. Knowing this crossover point helps you decide whether extra payments or refinancing make sense.</Body>
      <div style={{ background:C.raise, borderRadius:14, padding:'14px', marginBottom:14 }}>
        <SliderRow label="Loan Amount"  value={loan}  min={100000} max={1000000} step={10000} onChange={setLoan}  display={fmtK(loan)} />
        <SliderRow label="Interest Rate" value={rate} min={3}      max={10}      step={0.01}  onChange={setRate}  display={rate.toFixed(2)+'%'} color="#3b82f6" />
        <SliderRow label="Loan Term"    value={years} min={10}     max={30}      step={5}     onChange={setYears} display={years+' yrs'} color={C.sage} />
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:14 }}>
        <div style={{ flex:1, background:`${C.tangerine}12`, border:`1px solid ${C.tangerine}28`, borderRadius:12, padding:'10px', textAlign:'center' }}>
          <div style={{ fontFamily:MONO, fontSize:15, fontWeight:800, color:C.tangerine }}>{fmtK(data.pmt)}/mo</div>
          <div style={{ fontFamily:UI, fontSize:10, color:C.t3, marginTop:2 }}>Monthly payment</div>
        </div>
        <div style={{ flex:1, background:`${C.down}10`, border:`1px solid ${C.down}28`, borderRadius:12, padding:'10px', textAlign:'center' }}>
          <div style={{ fontFamily:MONO, fontSize:15, fontWeight:800, color:C.down }}>{fmtK(data.totalInterest)}</div>
          <div style={{ fontFamily:UI, fontSize:10, color:C.t3, marginTop:2 }}>Total interest paid</div>
        </div>
      </div>
      <Label>Interest vs. Principal Over Time</Label>
      <div style={{ height:200, marginBottom:12 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.rows} margin={{ top:4, right:4, bottom:0, left:0 }}>
            <defs>
              <linearGradient id="gInt" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.down} stopOpacity={0.3}/><stop offset="95%" stopColor={C.down} stopOpacity={0}/></linearGradient>
              <linearGradient id="gPrin" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.sage} stopOpacity={0.4}/><stop offset="95%" stopColor={C.sage} stopOpacity={0}/></linearGradient>
            </defs>
            <XAxis dataKey="yr" tick={{ fontFamily:MONO, fontSize:9, fill:C.t3 }} tickFormatter={v=>`Yr ${v}`} axisLine={false} tickLine={false} interval={Math.floor(years/4)} />
            <YAxis tick={{ fontFamily:MONO, fontSize:9, fill:C.t3 }} tickFormatter={v=>fmtK(v)} axisLine={false} tickLine={false} width={44} />
            <Tooltip contentStyle={{ background:C.surf, border:`1px solid ${C.b1}`, borderRadius:8, fontFamily:UI, fontSize:11 }}
              formatter={(v,n) => [fmtK(v), n==='interest'?'Interest':'Principal']}
              labelFormatter={l=>`Year ${l}`} labelStyle={{ color:C.t1, fontWeight:700 }} />
            <Area type="monotone" dataKey="interest"  stroke={C.down} strokeWidth={2} fill="url(#gInt)"  dot={false} />
            <Area type="monotone" dataKey="principal" stroke={C.sage} strokeWidth={2} fill="url(#gPrin)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <Callout color={C.tangerine} icon={Info} label="Year 1 Reality">On a 30-year mortgage, roughly 80% of every early payment goes to interest. The break-even — where more goes to principal than interest — isn't until around year 19.</Callout>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION: MORTGAGE TYPES
═══════════════════════════════════════════════════════════ */
function MortgageTypes() {
  const [loanAmt, setLoanAmt] = useState(350000)
  const TYPES = [
    { label:'30-yr Fixed', rate:6.82, n:360, color:'#3b82f6', note:'Most popular — predictable forever' },
    { label:'15-yr Fixed', rate:6.12, n:180, color:C.sage,    note:'Faster payoff, ~$120K less interest' },
    { label:'5/1 ARM',     rate:5.95, n:360, color:C.tangerine, note:'Lower initial, resets at year 5' },
  ]
  const calcs = TYPES.map(t => {
    const r = t.rate/100/12
    const pmt = r > 0 ? loanAmt*r*Math.pow(1+r,t.n)/(Math.pow(1+r,t.n)-1) : loanAmt/t.n
    return { ...t, pmt, totalPaid:pmt*t.n, totalInterest:pmt*t.n-loanAmt }
  })
  return (
    <>
      <Body>Your mortgage type affects monthly payment, total interest, and risk. Here's a live side-by-side comparison of the most common options.</Body>
      <SliderRow label="Loan Amount" value={loanAmt} min={100000} max={1000000} step={10000} onChange={setLoanAmt} display={fmtK(loanAmt)} />
      {calcs.map((t,i) => (
        <div key={i} style={{ background:C.surf, border:`1.5px solid ${t.color}30`, borderRadius:14, padding:'14px', marginBottom:10 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
            <div>
              <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.t1 }}>{t.label}</div>
              <div style={{ fontFamily:UI, fontSize:11, color:C.t3, marginTop:1 }}>{t.note}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:MONO, fontSize:16, fontWeight:800, color:t.color }}>{fmtK(t.pmt)}/mo</div>
              <div style={{ fontFamily:UI, fontSize:10, color:C.t3 }}>{t.rate}% rate</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <div style={{ flex:1, background:`${t.color}10`, borderRadius:8, padding:'8px', textAlign:'center' }}>
              <div style={{ fontFamily:MONO, fontSize:12, fontWeight:700, color:t.color }}>{fmtK(t.totalInterest)}</div>
              <div style={{ fontFamily:UI, fontSize:9, color:C.t3 }}>Total Interest</div>
            </div>
            <div style={{ flex:1, background:`${t.color}10`, borderRadius:8, padding:'8px', textAlign:'center' }}>
              <div style={{ fontFamily:MONO, fontSize:12, fontWeight:700, color:t.color }}>{fmtK(t.totalPaid)}</div>
              <div style={{ fontFamily:UI, fontSize:9, color:C.t3 }}>Total Paid</div>
            </div>
          </div>
        </div>
      ))}
      <Callout color={C.down} icon={AlertTriangle} label="ARM Risk">A 5/1 ARM resets to market rate after 5 years, then adjusts annually. If rates rise, your payment can jump hundreds per month. Only consider an ARM if you plan to sell or refinance before year 5.</Callout>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION: PMI
═══════════════════════════════════════════════════════════ */
function PMISection() {
  const [price, setPrice] = useState(400000)
  const [down,  setDown]  = useState(10)
  const loan   = price * (1 - down/100)
  const ltv    = 100 - down
  const pmiAmt = down < 20 ? loan * 0.01 / 12 : 0

  return (
    <>
      <Body>PMI (Private Mortgage Insurance) is required when you put less than 20% down on a conventional loan. It protects the lender — not you — and can add $100–$300/month to your payment.</Body>
      <div style={{ background:C.raise, borderRadius:14, padding:'14px', marginBottom:14 }}>
        <SliderRow label="Home Price"    value={price} min={150000} max={1000000} step={10000} onChange={setPrice} display={fmtK(price)} />
        <SliderRow label="Down Payment"  value={down}  min={3}      max={30}      step={1}     onChange={setDown}  display={down+'%'} color={down>=20?C.sage:C.down} />
      </div>
      <div style={{ background:down>=20?`${C.sage}14`:`${C.down}10`, border:`1px solid ${down>=20?C.sage:C.down}30`, borderRadius:14, padding:'14px', marginBottom:12 }}>
        {down >= 20 ? (
          <>
            <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.sage, marginBottom:4 }}>✓ No PMI — LTV {ltv}%</div>
            <div style={{ fontFamily:UI, fontSize:12, color:C.t2 }}>At {down}% down you're below the 80% LTV threshold. No PMI on conventional loans.</div>
          </>
        ) : (
          <div style={{ display:'flex', gap:8 }}>
            <div style={{ flex:1, textAlign:'center' }}>
              <div style={{ fontFamily:MONO, fontSize:17, fontWeight:800, color:C.down }}>{fmtK(pmiAmt)}/mo</div>
              <div style={{ fontFamily:UI, fontSize:10, color:C.t3 }}>Monthly PMI</div>
            </div>
            <div style={{ flex:1, textAlign:'center' }}>
              <div style={{ fontFamily:MONO, fontSize:17, fontWeight:800, color:C.tangerine }}>{fmtK(pmiAmt*12)}/yr</div>
              <div style={{ fontFamily:UI, fontSize:10, color:C.t3 }}>Annual PMI cost</div>
            </div>
          </div>
        )}
      </div>
      <BulletList items={[
        'PMI is auto-cancelled when your loan balance hits 78% LTV (Homeowners Protection Act)',
        'At 80% LTV you can REQUEST cancellation — lender must comply with good payment history',
        'Home appreciation counts — rising values may push you past 20% equity faster; order a new appraisal',
        '80/10/10 piggyback loan: 80% first + 10% second mortgage + 10% down avoids PMI entirely',
        'FHA MIP stays for the life of the loan if down < 10% — unlike conventional PMI which is removed',
      ]} color={C.tangerine} />
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION: FIRST-TIME BUYER PROGRAMS
═══════════════════════════════════════════════════════════ */
function FirstTimeBuyers() {
  const [tab, setTab] = useState(0)
  const FEDERAL = [
    { name:'FHA Loan',               down:'3.5%', score:'580+', color:'#3b82f6', note:'Government-backed. MIP stays for life of loan if <10% down. Flexible credit requirements.' },
    { name:'Conventional 97',        down:'3%',   score:'620+', color:C.sage,    note:'Fannie/Freddie. PMI removable at 20% equity. Better long-term than FHA for many buyers.' },
    { name:'Fannie HomeReady',        down:'3%',   score:'620+', color:C.tangerine, note:'Income ≤80% of area median. Reduced PMI. Non-borrower household income counts.' },
    { name:'Freddie Home Possible',   down:'3%',   score:'660+', color:'#a855f7', note:'Similar to HomeReady. Multi-generational household income eligible.' },
    { name:'VA Loan',                 down:'0%',   score:'None', color:C.gold,    note:'Veterans only. No PMI ever. Funding fee applies (waived for disabled vets).' },
    { name:'USDA Rural Loan',         down:'0%',   score:'640+', color:C.teal,    note:'Rural/suburban areas only. Income limits apply. Guarantee fee instead of PMI.' },
  ]
  return (
    <>
      <Body>Most first-time buyers don't realize they can buy with as little as 3% — or 0% for veterans and rural buyers. Stacking federal programs with state grants can reduce out-of-pocket costs dramatically.</Body>
      <Tabs tabs={['Federal Programs','State & Local']} active={tab} onChange={setTab} />

      {tab === 0 && (
        <>
          {FEDERAL.map((p,i) => (
            <div key={i} style={{ background:C.surf, border:`1px solid ${C.b1}`, borderRadius:14, padding:'13px', marginBottom:8, borderLeft:`3px solid ${p.color}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
                <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.t1 }}>{p.name}</div>
                <span style={{ fontFamily:MONO, fontSize:11, fontWeight:700, color:p.color, background:`${p.color}14`, borderRadius:6, padding:'2px 7px' }}>{p.down} down</span>
              </div>
              <div style={{ fontFamily:UI, fontSize:11, color:C.t3, marginBottom:4 }}>Min credit score: {p.score}</div>
              <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.5 }}>{p.note}</div>
            </div>
          ))}
        </>
      )}

      {tab === 1 && (
        <>
          <Callout color={C.indigo} icon={Info} label="State DPA Programs">Every state has Down Payment Assistance (DPA) programs — typically grants or forgivable second loans of 2–5% of the purchase price. These stack on top of federal programs.</Callout>
          <BulletList items={[
            'Search "[Your State] first-time homebuyer assistance" or visit HUD.gov for a state directory',
            'Many DPA programs have income limits (typically 80–120% of area median income)',
            'Some programs are forgivable after 3–5 years of primary residence — essentially free money',
            'Local programs: check your city or county housing authority — many run their own programs',
            'NACA (Neighborhood Assistance Corporation): no down payment, no PMI, below-market rates — strict but powerful',
            'Teacher/firefighter/nurse programs: many states offer profession-specific assistance',
          ]} color={C.indigo} />
          <Callout color={C.sage} icon={CheckCircle2} label="HUD-Approved Counseling">HUD-approved housing counselors offer FREE pre-purchase counseling and know every program in your area. Find one at hud.gov/findacounselor.</Callout>
        </>
      )}
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION: SECTION 121 CAPITAL GAINS
═══════════════════════════════════════════════════════════ */
function CapitalGains() {
  const [price,  setPrice]  = useState(250000)
  const [sale,   setSale]   = useState(600000)
  const [filing, setFiling] = useState('single')
  const [owned,  setOwned]  = useState(3)

  const gain      = sale - price
  const exclusion = filing === 'single' ? 250000 : 500000
  const qualifies = owned >= 2
  const taxable   = qualifies ? Math.max(0, gain - exclusion) : gain
  const taxSaved  = qualifies ? Math.min(gain, exclusion) * 0.15 : 0

  return (
    <>
      <Body>Section 121 lets you exclude up to $250K (single) or $500K (married) of capital gains on your primary home sale — one of the most valuable tax breaks in the entire tax code.</Body>
      <div style={{ display:'flex', gap:8, marginBottom:14 }}>
        {['single','married'].map(f => (
          <button key={f} onClick={()=>setFiling(f)} style={{ flex:1, padding:'10px', borderRadius:12, border:`1.5px solid ${filing===f?C.tangerine:C.b1}`, background:filing===f?`${C.tangerine}12`:C.surf, fontFamily:UI, fontSize:13, fontWeight:700, color:filing===f?C.tangerine:C.t2, cursor:'pointer' }}>
            {f==='single'?'Single — $250K':'Married — $500K'}
          </button>
        ))}
      </div>
      <div style={{ background:C.raise, borderRadius:14, padding:'14px', marginBottom:14 }}>
        <SliderRow label="Purchase Price" value={price} min={50000}  max={1000000} step={10000} onChange={setPrice} display={fmtK(price)} />
        <SliderRow label="Sale Price"     value={sale}  min={100000} max={2000000} step={10000} onChange={setSale}  display={fmtK(sale)}  color={C.sage} />
        <SliderRow label="Years Owned"    value={owned} min={1}      max={10}      step={1}     onChange={setOwned} display={owned+' yrs'} color="#3b82f6" />
      </div>
      <div style={{ background:qualifies?C.ink:`${C.down}10`, borderRadius:14, padding:'14px', marginBottom:12 }}>
        {qualifies ? (
          <>
            <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.14em', color:'rgba(250,246,237,0.45)', marginBottom:8 }}>Section 121 Analysis</div>
            {[['Gain on Sale', fmtK(gain), C.cream],['Exclusion Applied', fmtK(Math.min(gain,exclusion)), C.sage],['Taxable Gain', fmtK(taxable), taxable>0?C.down:C.sage]].map(([l,v,c])=>(
              <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:`1px solid rgba(255,255,255,0.08)` }}>
                <span style={{ fontFamily:UI, fontSize:12, color:'rgba(250,246,237,0.6)' }}>{l}</span>
                <span style={{ fontFamily:MONO, fontSize:13, fontWeight:700, color:c }}>{v}</span>
              </div>
            ))}
            <div style={{ textAlign:'center', marginTop:12 }}>
              <div style={{ fontFamily:MONO, fontSize:18, fontWeight:800, color:C.sage }}>{fmtK(taxSaved)} saved</div>
              <div style={{ fontFamily:UI, fontSize:10, color:'rgba(250,246,237,0.45)' }}>est. federal tax avoided at 15% LTCG rate</div>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.down, marginBottom:4 }}>Exclusion NOT available — only {owned} yr{owned===1?'':'s'} owned</div>
            <div style={{ fontFamily:UI, fontSize:12, color:C.t2 }}>You need at least 2 of the last 5 years as primary residence. Full gain of {fmtK(gain)} may be taxable.</div>
          </>
        )}
      </div>
      <BulletList items={[
        '2-of-5-year rule: must own AND use as primary residence for any 2 of the last 5 years',
        'The ownership and use periods don\'t need to overlap — they can be different 2-year windows',
        'Partial exclusion available for job relocation, health reasons, or unforeseen circumstances',
        'Can\'t use if you excluded another home sale within the prior 2 years',
        'Depreciation recapture still applies if property was ever used as a rental — taxed at 25%',
        'Inherited property: heirs get a step-up in basis to fair market value at death — often zero taxable gain',
      ]} />
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION: 1031 EXCHANGE
═══════════════════════════════════════════════════════════ */
function Exchange1031() {
  const [tab, setTab] = useState(0)
  return (
    <>
      <Body>A 1031 Like-Kind Exchange lets real estate investors defer all capital gains taxes when selling investment property — as long as proceeds are reinvested in like-kind real estate. Does NOT apply to primary residences.</Body>
      <Tabs tabs={['How It Works','Rules','Strategies']} active={tab} onChange={setTab} />

      {tab === 0 && (
        <>
          <div style={{ background:C.ink, borderRadius:16, padding:'16px', marginBottom:14 }}>
            <div style={{ fontFamily:DISPLAY, fontSize:15, fontWeight:700, color:C.cream, marginBottom:12 }}>The 1031 Timeline</div>
            {[
              ['Day 0',   '#3b82f6', 'Close on the sale of your relinquished property'],
              ['Day 45',  C.tangerine,'DEADLINE: Identify up to 3 replacement properties in writing'],
              ['Day 180', C.sage,    'DEADLINE: Close on at least one identified replacement property'],
              ['Result',  C.gold,    'All capital gains taxes deferred — indefinitely until sale without exchange'],
            ].map(([d,c,t],i)=>(
              <div key={i} style={{ display:'flex', gap:12, marginBottom:10, alignItems:'flex-start' }}>
                <div style={{ background:`${c}22`, borderRadius:8, padding:'4px 8px', flexShrink:0, minWidth:52, textAlign:'center' }}>
                  <div style={{ fontFamily:MONO, fontSize:10, fontWeight:800, color:c }}>{d}</div>
                </div>
                <div style={{ fontFamily:UI, fontSize:12, color:'rgba(250,246,237,0.75)', lineHeight:1.55 }}>{t}</div>
              </div>
            ))}
          </div>
          <Callout color={C.gold} icon={Info} label="The Power of Deferral">On a $500K property with $200K of gain, paying 20% LTCG leaves only $460K to reinvest. A 1031 keeps the full $500K working. Over multiple exchanges this compounding effect is enormous.</Callout>
        </>
      )}

      {tab === 1 && (
        <BulletList items={[
          'Must use a Qualified Intermediary (QI) — you cannot touch the proceeds or the exchange is disqualified',
          '"Like-kind" is broad — any US investment real estate for any other US investment real estate',
          '"Boot" = cash or non-like-kind property received — boot is immediately taxable',
          'Must replace both equity AND debt — reducing debt creates "mortgage boot" taxed as gain',
          '3-Property Rule: identify up to 3 properties regardless of value',
          '200% Rule: identify any number of properties if total value ≤ 200% of relinquished',
          '95% Rule: identify unlimited properties if you close on 95% of identified value',
          'Personal use property (vacation homes) require special planning — not automatically eligible',
        ]} color="#3b82f6" />
      )}

      {tab === 2 && (
        <>
          <BulletList items={[
            'Delaware Statutory Trust (DST): qualifies as like-kind property — passive real estate with no management responsibility',
            'Reverse exchange: buy the replacement FIRST, sell the relinquished within 180 days (requires parking arrangement)',
            'Improvement exchange: use proceeds to improve the replacement property within 180 days',
            'Dying while holding: heirs receive a step-up in basis at death — all deferred gain disappears permanently',
            'Convert to primary residence: after 5 years in a 1031 property, partial Sec. 121 exclusion may apply',
          ]} color={C.gold} />
          <Callout color={C.down} icon={AlertTriangle} label="State Clawback Rules">Some states (CA, MA, OR) have "clawback" provisions that tax deferred gain when you sell the replacement property, even if you moved to a lower-tax state. Consult a CPA before crossing state lines with a 1031.</Callout>
        </>
      )}
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION: HOME OFFICE DEDUCTION
═══════════════════════════════════════════════════════════ */
function HomeOffice() {
  const [sqft,     setSqft]   = useState(150)
  const [homeSqft, setHome]   = useState(1800)
  const [method,   setMethod] = useState('simplified')
  const [monthlyE, setExp]    = useState(3000)

  const pctUse    = sqft / homeSqft
  const simplified = Math.min(sqft, 300) * 5
  const actual     = monthlyE * 12 * pctUse

  return (
    <>
      <Body>Self-employed individuals and business owners can deduct home office expenses if a space is used exclusively and regularly for business. The IRS offers two methods with very different tradeoffs.</Body>
      <Callout color={C.down} icon={AlertTriangle} label="Exclusive Use Rule">The most common audit trigger. The space must be used ONLY for business. A desk in your bedroom doesn't qualify. A dedicated room used only as a home office does.</Callout>
      <div style={{ display:'flex', gap:8, marginBottom:14 }}>
        {['simplified','actual'].map(m => (
          <button key={m} onClick={()=>setMethod(m)} style={{ flex:1, padding:'9px', borderRadius:12, border:`1.5px solid ${method===m?C.tangerine:C.b1}`, background:method===m?`${C.tangerine}12`:C.surf, fontFamily:UI, fontSize:12, fontWeight:700, color:method===m?C.tangerine:C.t2, cursor:'pointer' }}>
            {m==='simplified'?'Simplified ($5/sqft)':'Actual Expense'}
          </button>
        ))}
      </div>
      {method==='simplified' ? (
        <>
          <div style={{ background:C.raise, borderRadius:14, padding:'14px', marginBottom:14 }}>
            <SliderRow label="Office Square Footage" value={sqft} min={50} max={300} step={10} onChange={setSqft} display={sqft+' sqft'} />
          </div>
          <div style={{ background:C.ink, borderRadius:14, padding:'14px', marginBottom:12, textAlign:'center' }}>
            <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:'rgba(250,246,237,0.45)', textTransform:'uppercase', letterSpacing:'0.14em', marginBottom:4 }}>Annual Deduction</div>
            <div style={{ fontFamily:MONO, fontSize:28, fontWeight:800, color:C.tangerine }}>${simplified.toLocaleString()}</div>
            <div style={{ fontFamily:UI, fontSize:11, color:'rgba(250,246,237,0.5)', marginTop:4 }}>$5 × {Math.min(sqft,300)} sqft{sqft>300?' (max 300)':''}</div>
          </div>
          <BulletList items={['Max $1,500/year (300 sqft)','Cannot create a loss — unused portion carries forward','No depreciation recapture when you sell — key advantage over actual method','Simpler — no expense tracking required']} />
        </>
      ) : (
        <>
          <div style={{ background:C.raise, borderRadius:14, padding:'14px', marginBottom:14 }}>
            <SliderRow label="Office Sqft"        value={sqft}     min={50}  max={1000} step={10}  onChange={setSqft}  display={sqft+' sqft'} />
            <SliderRow label="Home Total Sqft"    value={homeSqft} min={500} max={5000} step={100} onChange={setHome}  display={homeSqft+' sqft'} color="#3b82f6" />
            <SliderRow label="Monthly Home Costs" value={monthlyE} min={500} max={10000} step={100} onChange={setExp}  display={fmtK(monthlyE)+'/mo'} color={C.sage} />
          </div>
          <div style={{ background:C.ink, borderRadius:14, padding:'14px', marginBottom:12, textAlign:'center' }}>
            <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:'rgba(250,246,237,0.45)', textTransform:'uppercase', letterSpacing:'0.14em', marginBottom:4 }}>Annual Deduction ({(pctUse*100).toFixed(1)}% of home)</div>
            <div style={{ fontFamily:MONO, fontSize:28, fontWeight:800, color:C.sage }}>{fmtK(actual)}</div>
          </div>
          <BulletList items={[`Deduct ${(pctUse*100).toFixed(1)}% of: mortgage interest, utilities, insurance, repairs, depreciation`,'Depreciation on office portion creates recapture tax at 25% when you sell','Requires tracking and proportioning all home expenses','Usually larger deduction for higher-cost homes']} color="#3b82f6" />
        </>
      )}
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION: RENTAL PROPERTY BASICS
═══════════════════════════════════════════════════════════ */
function RentalBasics() {
  const [tab, setTab] = useState(0)

  const [price,  setPrice] = useState(350000)
  const [rent,   setRent]  = useState(2500)
  const [downPct,setDown]  = useState(25)
  const [expPct, setExp]   = useState(40)

  const noi       = rent*12*(1-expPct/100)
  const capRate   = (noi/price)*100
  const cash      = price*downPct/100
  const loan      = price*(1-downPct/100)
  const r         = 0.0682/12, n=360
  const debt      = loan*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1)*12
  const cashFlow  = noi - debt
  const coc       = (cashFlow/cash)*100
  const pctRule   = (rent/price)*100

  return (
    <>
      <Body>Rental real estate builds wealth through cash flow, appreciation, and tax advantages — but the math must work from day one. These are the metrics every investor uses to evaluate a deal.</Body>
      <Tabs tabs={['Calculator','Key Metrics','Tax Strategy']} active={tab} onChange={setTab} />

      {tab === 0 && (
        <>
          <div style={{ background:C.raise, borderRadius:14, padding:'14px', marginBottom:14 }}>
            <SliderRow label="Purchase Price" value={price}  min={100000} max={1000000} step={10000} onChange={setPrice} display={fmtK(price)} />
            <SliderRow label="Monthly Rent"   value={rent}   min={500}    max={10000}   step={50}    onChange={setRent}  display={'$'+rent.toLocaleString()+'/mo'} color={C.sage} />
            <SliderRow label="Down Payment"   value={downPct} min={15}    max={40}      step={5}     onChange={setDown}  display={downPct+'%'} color="#3b82f6" />
            <SliderRow label="Expense Ratio"  value={expPct}  min={20}    max={60}      step={5}     onChange={setExp}   display={expPct+'%'} color={C.tangerine} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
            {[
              ['Cap Rate',     capRate.toFixed(2)+'%', capRate>=6?C.sage:capRate>=4?C.tangerine:C.down],
              ['Cash-on-Cash', coc.toFixed(2)+'%',     coc>=6?C.sage:coc>=3?C.tangerine:C.down],
              ['Annual NOI',   fmtK(noi),               C.tangerine],
              ['Annual CF',    (cashFlow>=0?'+':'')+fmtK(cashFlow), cashFlow>=0?C.sage:C.down],
              ['1% Rule',      pctRule.toFixed(2)+'%',  pctRule>=1?C.sage:C.down],
              ['Cash In',      fmtK(cash),              '#3b82f6'],
            ].map(([l,v,c]) => (
              <div key={l} style={{ background:`${c}12`, border:`1px solid ${c}28`, borderRadius:12, padding:'10px', textAlign:'center' }}>
                <div style={{ fontFamily:MONO, fontSize:14, fontWeight:800, color:c }}>{v}</div>
                <div style={{ fontFamily:UI, fontSize:10, color:C.t3, marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 1 && (
        <>
          {[
            ['Cap Rate', 'NOI ÷ Purchase Price', 'Measures return ignoring financing. 6%+ is generally good; varies by market. Use to compare properties apples-to-apples.'],
            ['Cash-on-Cash', 'Annual Cash Flow ÷ Cash Invested', 'Return on your actual dollars invested. More relevant than cap rate when using a mortgage. Target 6–8%+.'],
            ['1% Rule', 'Monthly Rent ≥ 1% of Price', 'Quick screen: a $300K property should rent for at least $3,000/mo. Hard to hit in expensive markets but a useful filter.'],
            ['50% Rule', 'Operating expenses ≈ 50% of gross rent', 'Rule of thumb: half your rent goes to expenses (taxes, insurance, vacancy, repairs, management) — before mortgage.'],
            ['GRM (Gross Rent Multiplier)', 'Price ÷ Annual Rent', 'Quick valuation: how many years of rent to pay for the property. Lower is better. Market GRMs vary widely.'],
          ].map(([name,formula,desc],i)=>(
            <div key={i} style={{ background:C.raise, borderRadius:12, padding:'12px', marginBottom:8 }}>
              <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.t1, marginBottom:2 }}>{name}</div>
              <div style={{ fontFamily:MONO, fontSize:10, color:C.tangerine, marginBottom:5 }}>{formula}</div>
              <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.5 }}>{desc}</div>
            </div>
          ))}
        </>
      )}

      {tab === 2 && (
        <>
          <BulletList items={[
            'Depreciation: deduct 1/27.5th of the building value each year (land is not depreciable)',
            'Operating deductions: mortgage interest, property tax, insurance, repairs, management fees, mileage',
            '$25K passive loss allowance: if AGI ≤ $100K, deduct up to $25K rental losses against ordinary income — phases out by $150K AGI',
            'Real Estate Professional: 750+ hrs/yr AND majority of total work time in real estate — losses become fully deductible',
            'Cost segregation study: reclassify components (appliances, flooring, landscaping) to 5–15yr depreciation — major tax acceleration in Year 1',
          ]} color="#a855f7" />
          <Callout color={C.down} icon={AlertTriangle} label="Depreciation Recapture">When you sell, all depreciation ever claimed (or allowable) is recaptured and taxed at 25% — even if you never actually deducted it. A 1031 exchange defers this. Holding until death eliminates it via step-up in basis.</Callout>
          <Callout color="#3b82f6" icon={Info} label="Short-Term Rentals (STRs)">STRs (Airbnb, VRBO) may qualify as active income (not passive) if you provide substantial services or the average stay is ≤7 days — opening different deduction pathways. Complex rules; consult a CPA.</Callout>
        </>
      )}
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════ */
export default function MRealEstate() {
  return (
    <div style={{ background:C.bg, minHeight:'100dvh', paddingBottom:100 }}>
      <ScreenHeader title="Real Estate" subtitle="Learn" accent="#3b82f6" />
      <div style={{ padding:'16px 16px 0' }}>
        <div style={{ background:C.ink, borderRadius:20, padding:'20px', marginBottom:20 }}>
          <div style={{ fontFamily:UI, fontSize:9, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(250,246,237,0.45)', marginBottom:8 }}>Real Estate Planning</div>
          <div style={{ fontFamily:DISPLAY, fontSize:22, fontWeight:700, color:C.cream, lineHeight:1.25, marginBottom:8 }}>From first home to investment portfolio — the complete picture.</div>
          <div style={{ fontFamily:UI, fontSize:12, color:'rgba(250,246,237,0.65)', lineHeight:1.7 }}>Real estate is most Americans' largest asset. Understanding the tax code, financing mechanics, and investment fundamentals is the difference between building wealth and just buying a house.</div>
        </div>

        <Section title="Purchasing Power by State" badge="BEA Regional Price Parities 2024" badgeColor="#4a7c59" icon={Home} defaultOpen>
          <PurchasingPower />
        </Section>
        <Section title="Property Tax by State" badge="All 50 states + DC — WalletHub 2026" badgeColor={C.tangerine} icon={Home}>
          <PropertyTax />
        </Section>
        <Section title="True Cost of Homeownership" badge="Beyond the mortgage payment" badgeColor="#3b82f6" icon={Home}>
          <TrueCost />
        </Section>
        <Section title="How Amortization Works" badge="Why early payments are mostly interest" badgeColor={C.down} icon={Home}>
          <AmortizationSection />
        </Section>
        <Section title="Mortgage Types Compared" badge="30-yr Fixed vs 15-yr vs ARM" badgeColor="#a855f7" icon={Home}>
          <MortgageTypes />
        </Section>
        <Section title="PMI — What It Is & How to Remove It" badge="The cost of less than 20% down" badgeColor={C.down} icon={Home}>
          <PMISection />
        </Section>
        <Section title="First-Time Buyer Programs" badge="FHA · VA · USDA · Conventional 3% · State DPA" badgeColor={C.sage} icon={Home}>
          <FirstTimeBuyers />
        </Section>
        <Section title="Capital Gains Exclusion — Section 121" badge="$250K single / $500K married on home sale" badgeColor={C.gold} icon={Home}>
          <CapitalGains />
        </Section>
        <Section title="1031 Like-Kind Exchange" badge="Defer capital gains on investment property" badgeColor="#3b82f6" icon={Home}>
          <Exchange1031 />
        </Section>
        <Section title="Home Office Deduction" badge="Simplified vs. actual expense method" badgeColor={C.teal} icon={Home}>
          <HomeOffice />
        </Section>
        <Section title="Rental Property Basics" badge="Cap rate · cash flow · depreciation · taxes" badgeColor="#a855f7" icon={Home}>
          <RentalBasics />
        </Section>

        <div style={{ fontFamily:UI, fontSize:10, color:C.t3, textAlign:'center', lineHeight:1.6, padding:'8px 16px 0' }}>
          For educational purposes only. Tax laws change — consult a licensed CPA or CFP before making real estate or tax decisions.
        </div>
      </div>
    </div>
  )
}
