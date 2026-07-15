import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'

const ALL_TOPICS = [
  // Budgeting
  { id:'50-30-20', title:'The 50/30/20 Rule', category:'Budgeting', level:'Beginner', mins:5, path:'/learn/budgeting' },
  { id:'zero-based', title:'Zero-Based Budgeting', category:'Budgeting', level:'Beginner', mins:7, path:'/learn/budgeting' },
  { id:'emergency-fund', title:'Building an Emergency Fund', category:'Budgeting', level:'Beginner', mins:6, path:'/learn/budgeting' },
  // Debt & Credit
  { id:'credit-score', title:'Understanding Credit Scores', category:'Debt & Credit', level:'Beginner', mins:8, path:'/learn/debt' },
  { id:'avalanche', title:'Debt Avalanche Method', category:'Debt & Credit', level:'Intermediate', mins:6, path:'/learn/debt' },
  { id:'snowball', title:'Debt Snowball Method', category:'Debt & Credit', level:'Beginner', mins:5, path:'/learn/debt' },
  { id:'credit-utilization', title:'Credit Utilization Explained', category:'Debt & Credit', level:'Beginner', mins:4, path:'/learn/debt' },
  // Investing
  { id:'compound', title:'Compound Interest: The 8th Wonder', category:'Investing', level:'Beginner', mins:8, path:'/learn/investing' },
  { id:'dca', title:'Dollar-Cost Averaging', category:'Investing', level:'Beginner', mins:6, path:'/learn/investing' },
  { id:'index-funds', title:'Index Funds vs Active Management', category:'Investing', level:'Intermediate', mins:9, path:'/learn/investing' },
  { id:'risk-return', title:'Risk vs Return Tradeoff', category:'Investing', level:'Beginner', mins:7, path:'/learn/investing' },
  { id:'rule-72', title:'The Rule of 72', category:'Investing', level:'Beginner', mins:3, path:'/learn/investing' },
  // Portfolio
  { id:'diversification', title:'Diversification Strategy', category:'Portfolio', level:'Intermediate', mins:8, path:'/learn/portfolio' },
  { id:'rebalancing', title:'Portfolio Rebalancing', category:'Portfolio', level:'Intermediate', mins:7, path:'/learn/portfolio' },
  { id:'asset-alloc', title:'Asset Allocation Models', category:'Portfolio', level:'Intermediate', mins:10, path:'/learn/portfolio' },
  // Insurance
  { id:'term-life', title:'Term vs Whole Life Insurance', category:'Insurance', level:'Beginner', mins:8, path:'/learn/insurance' },
  { id:'disability', title:'Disability Insurance Guide', category:'Insurance', level:'Intermediate', mins:7, path:'/learn/insurance' },
  { id:'umbrella', title:'Why You Need Umbrella Insurance', category:'Insurance', level:'Intermediate', mins:5, path:'/learn/insurance' },
  // Estate
  { id:'will', title:'Why You Need a Will', category:'Estate', level:'Beginner', mins:6, path:'/learn/estate' },
  { id:'trust', title:'Revocable Living Trust Explained', category:'Estate', level:'Advanced', mins:10, path:'/learn/estate' },
  { id:'beneficiary', title:'Beneficiary Designations 101', category:'Estate', level:'Beginner', mins:5, path:'/learn/estate' },
  // Retirement
  { id:'401k', title:'401(k) Fundamentals', category:'Retirement', level:'Beginner', mins:8, path:'/learn/retirement' },
  { id:'roth-ira', title:'Roth IRA: Complete Guide', category:'Retirement', level:'Beginner', mins:9, path:'/learn/retirement' },
  { id:'rmd', title:'Required Minimum Distributions', category:'Retirement', level:'Advanced', mins:8, path:'/learn/retirement' },
  { id:'retire-order', title:'Optimal Savings Order', category:'Retirement', level:'Intermediate', mins:6, path:'/learn/retirement' },
  // Tax
  { id:'tax-brackets', title:'How Tax Brackets Actually Work', category:'Tax', level:'Beginner', mins:7, path:'/learn/tax' },
  { id:'tax-loss', title:'Tax-Loss Harvesting Strategy', category:'Tax', level:'Advanced', mins:8, path:'/learn/tax' },
  { id:'hsa', title:'HSA: Triple Tax Advantage', category:'Tax', level:'Intermediate', mins:6, path:'/learn/tax' },
  // Real Estate
  { id:'mortgage', title:'Mortgage Calculator Deep Dive', category:'Real Estate', level:'Beginner', mins:8, path:'/learn/buy-rent-lease' },
  { id:'pti-ratio', title:'Price-to-Income Ratio', category:'Real Estate', level:'Intermediate', mins:5, path:'/learn/buy-rent-lease' },
]

const CATEGORIES = ['All', ...new Set(ALL_TOPICS.map(t => t.category))]
const LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']
const LEVEL_COLORS = { Beginner:C.teal, Intermediate:C.gold, Advanced:C.indigo }

export default function MLearnersLibrary() {
  const nav = useNavigate()
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')
  const [level, setLevel] = useState('All Levels')

  const filtered = ALL_TOPICS.filter(t => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase())
    const matchCat = cat === 'All' || t.category === cat
    const matchLevel = level === 'All Levels' || t.level === level
    return matchSearch && matchCat && matchLevel
  })

  return (
    <div style={{ background:C.bg, minHeight:'100dvh', position:'relative' }}>

      <ScreenHeader title="Learner's Library" subtitle="Learn" accent={C.indigo} />

      {/* Header Stats */}
      <div style={{ padding:'12px 16px 0', display:'flex', gap:10 }}>
        {[['30+','Articles'],['5','Levels'],['Free','Always']].map(([v,l]) => (
          <div key={l} style={{ flex:1, textAlign:'center', background:`rgba(129,140,248,0.1)`, border:`1px solid rgba(129,140,248,0.2)`, borderRadius:10, padding:'8px' }}>
            <div style={{ fontFamily:MONO, fontSize:15, fontWeight:700, color:C.indigo }}>{v}</div>
            <div style={{ fontFamily:UI, fontSize:10, color:C.t3 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ padding:'12px 16px 0' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search topics..."
          style={{ width:'100%', boxSizing:'border-box', background:C.surf, border:`1px solid ${C.b2}`, borderRadius:12, padding:'11px 14px', fontFamily:UI, fontSize:14, color:C.t1, outline:'none' }}
        />
      </div>

      {/* Category Filter */}
      <div style={{ padding:'10px 16px 0', display:'flex', gap:8, overflowX:'auto', scrollbarWidth:'none' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{
            flexShrink:0, padding:'6px 12px', borderRadius:8, border:`1px solid ${cat===c ? C.indigo : C.b2}`,
            background: cat===c ? 'rgba(129,140,248,0.12)' : C.surf, cursor:'pointer',
            fontFamily:UI, fontSize:11, fontWeight:600, color: cat===c ? C.indigo : C.t3,
          }}>{c}</button>
        ))}
      </div>

      {/* Level Filter */}
      <div style={{ padding:'8px 16px 0', display:'flex', gap:8, overflowX:'auto', scrollbarWidth:'none' }}>
        {LEVELS.map(l => (
          <button key={l} onClick={() => setLevel(l)} style={{
            flexShrink:0, padding:'5px 10px', borderRadius:6, border:`1px solid ${level===l ? C.gold : C.b2}`,
            background: level===l ? 'rgba(201,169,110,0.1)' : 'transparent', cursor:'pointer',
            fontFamily:UI, fontSize:10, fontWeight:600, color: level===l ? C.gold : C.t3,
          }}>{l}</button>
        ))}
      </div>

      {/* Results */}
      <MSectionHeader label={`${filtered.length} Topics`} />
      <div style={{ padding:'0 16px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'40px 20px', color:C.t3, fontFamily:UI, fontSize:13 }}>No topics found for "{search}"</div>
        ) : (
          <MCard style={{ padding:0, overflow:'hidden' }}>
            {filtered.map((t, i) => (
              <div key={t.id} onClick={() => nav(t.path)} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px', borderBottom: i < filtered.length-1 ? `1px solid ${C.b1}` : 'none', cursor:'pointer' }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:UI, fontSize:13, fontWeight:600, color:C.t1, marginBottom:3 }}>{t.title}</div>
                  <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                    <span style={{ fontFamily:UI, fontSize:10, color:C.t3 }}>{t.category}</span>
                    <span style={{ color:C.b2 }}>·</span>
                    <span style={{ fontFamily:MONO, fontSize:10, color:C.t3 }}>{t.mins} min</span>
                  </div>
                </div>
                <span style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:LEVEL_COLORS[t.level], background:`${LEVEL_COLORS[t.level]}15`, border:`1px solid ${LEVEL_COLORS[t.level]}30`, borderRadius:5, padding:'2px 6px', flexShrink:0 }}>{t.level}</span>
              </div>
            ))}
          </MCard>
        )}
      </div>
      <div style={{ height:24 }} />
    </div>
  )
}
