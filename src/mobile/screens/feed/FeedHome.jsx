import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'

const ARTICLES = [
  {
    id:1, category:'Markets', title:'The Fed\'s Rate Pause and What It Means for Your Portfolio',
    preview:'After 12 consecutive rate decisions, the Federal Reserve has held rates at 5.25–5.50%. Here\'s what this inflection point means for stocks, bonds, and your financial plan.',
    author:'Planora Research', mins:5, date:'Jun 27', color:C.gold, tags:['Fed','Rates','Bonds'],
  },
  {
    id:2, category:'Planning', title:'Roth Conversion Ladder: The Complete 2026 Guide',
    preview:'Converting traditional IRA funds to Roth is one of the most powerful tax planning moves available. We break down the strategy, timing, and math.',
    author:'Planning Team', mins:8, date:'Jun 26', color:C.indigo, tags:['Tax','Roth','Retirement'],
  },
  {
    id:3, category:'Education', title:'Why Most Investors Underperform Their Own Funds',
    preview:'DALBAR\'s annual study shows the average investor earns 2–3% less than the funds they hold. Behavioral finance explains why — and how to fix it.',
    author:'FUN Team', mins:6, date:'Jun 25', color:C.teal, tags:['Behavior','Investing','Psychology'],
  },
  {
    id:4, category:'Markets', title:'Sector Rotation: Where Institutional Money Is Moving',
    preview:'Smart money rotates between sectors as the economic cycle evolves. Understanding rotation can help time market exposure more intelligently.',
    author:'Planora Research', mins:7, date:'Jun 24', color:C.gold, tags:['Sectors','Institutions'],
  },
  {
    id:5, category:'Planning', title:'The HSA Hack: Your Most Tax-Efficient Account',
    preview:'Most people treat an HSA as a health spending account. High earners use it as a stealth IRA. Here\'s the strategy that changes everything.',
    author:'Planning Team', mins:5, date:'Jun 23', color:C.indigo, tags:['HSA','Tax','Strategy'],
  },
  {
    id:6, category:'Wealth', title:'Estate Planning for Non-Wealthy Families: Why It Matters at Any Net Worth',
    preview:'You don\'t need millions to need an estate plan. A simple will and healthcare directive protects your family regardless of wealth.',
    author:'Wealth Team', mins:9, date:'Jun 22', color:C.teal, tags:['Estate','Planning','Family'],
  },
  {
    id:7, category:'Markets', title:'How to Read an Economic Calendar Like a Pro',
    preview:'NFP, CPI, FOMC, PCE — the alphabet soup of economic data moves markets. Here\'s the fast guide to what each indicator means.',
    author:'Planora Research', mins:6, date:'Jun 21', color:C.gold, tags:['Macro','Data','Calendar'],
  },
  {
    id:8, category:'Education', title:'The 4% Rule Is Not Dead — It Just Has Rules',
    preview:'Critics have called the 4% rule outdated. But the original Trinity Study authors still defend it with caveats. Here\'s the nuance that matters.',
    author:'FUN Team', mins:7, date:'Jun 20', color:C.teal, tags:['Retirement','4% Rule','FIRE'],
  },
]

const CATEGORIES = ['All', 'Markets', 'Planning', 'Education', 'Wealth']

export default function FeedHome() {
  const nav = useNavigate()
  const [cat, setCat] = useState('All')
  const filtered = cat === 'All' ? ARTICLES : ARTICLES.filter(a => a.category === cat)

  return (
    <div style={{ background:C.bg, minHeight:'100dvh' }}>
      <ScreenHeader title="Feed" subtitle="Insights & Research" accent={C.indigo} />

      {/* Featured Article */}
      <div style={{ padding:'14px 16px 0' }}>
        <div onClick={() => nav('/feed/article', { state: ARTICLES[0] })} style={{ background:`linear-gradient(135deg, rgba(201,169,110,0.15) 0%, rgba(201,169,110,0.04) 100%)`, border:`1px solid rgba(201,169,110,0.3)`, borderRadius:18, padding:'18px', cursor:'pointer' }}>
          <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:C.gold, textTransform:'uppercase', letterSpacing:'0.14em', marginBottom:6 }}>Featured · {ARTICLES[0].date}</div>
          <div style={{ fontFamily:DISPLAY, fontSize:18, fontWeight:700, color:C.t1, lineHeight:1.3, marginBottom:8 }}>
            {ARTICLES[0].title}
          </div>
          <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.6, marginBottom:12 }}>
            {ARTICLES[0].preview.substring(0, 100)}...
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ display:'flex', gap:6 }}>
              {ARTICLES[0].tags.map(tag => (
                <span key={tag} style={{ fontFamily:UI, fontSize:9, fontWeight:700, color:C.gold, background:'rgba(201,169,110,0.12)', border:'1px solid rgba(201,169,110,0.25)', borderRadius:5, padding:'2px 6px' }}>{tag}</span>
              ))}
            </div>
            <span style={{ fontFamily:MONO, fontSize:11, color:C.t3 }}>{ARTICLES[0].mins} min read</span>
          </div>
        </div>
      </div>

      {/* Insights Link */}
      <div style={{ padding:'10px 16px 0' }}>
        <div onClick={() => nav('/feed/insights')} style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14, padding:'13px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer' }}>
          <div>
            <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.indigo }}>Market Insights</div>
            <div style={{ fontFamily:UI, fontSize:11, color:C.t3 }}>Weekly macro views & sector analysis</div>
          </div>
          <span style={{ fontFamily:MONO, fontSize:16, color:C.indigo }}>→</span>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ padding:'12px 16px 0', display:'flex', gap:8, overflowX:'auto', scrollbarWidth:'none' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{
            flexShrink:0, padding:'7px 14px', borderRadius:9, border:`1px solid ${cat===c ? C.indigo : C.b2}`,
            background: cat===c ? 'rgba(129,140,248,0.12)' : C.surf, cursor:'pointer',
            fontFamily:UI, fontSize:12, fontWeight:600, color: cat===c ? C.indigo : C.t3,
          }}>{c}</button>
        ))}
      </div>

      {/* Article List */}
      <MSectionHeader label={`${filtered.length} Articles`} />
      <div style={{ padding:'0 16px' }}>
        {filtered.map((a, i) => (
          <div key={a.id} onClick={() => nav('/feed/article', { state: a })} style={{ background:C.surf, border:`1px solid ${C.b2}`, borderRadius:16, padding:'14px', marginBottom:10, cursor:'pointer' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
              <span style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:a.color, background:`${a.color}15`, border:`1px solid ${a.color}30`, borderRadius:5, padding:'2px 7px' }}>{a.category}</span>
              <span style={{ fontFamily:MONO, fontSize:10, color:C.t3 }}>{a.mins} min · {a.date}</span>
            </div>
            <div style={{ fontFamily:UI, fontSize:14, fontWeight:700, color:C.t1, lineHeight:1.3, marginBottom:6 }}>{a.title}</div>
            <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.55 }}>{a.preview.substring(0, 90)}...</div>
            <div style={{ marginTop:10, display:'flex', gap:5 }}>
              {a.tags.slice(0,2).map(tag => (
                <span key={tag} style={{ fontFamily:UI, fontSize:9, color:C.t3, background:C.raise, borderRadius:4, padding:'2px 6px' }}>{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ height:24 }} />
    </div>
  )
}
