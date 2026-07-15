import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader, MPrimaryBtn } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import useUserLS from '../../hooks/useUserLS'

const fmt = n => {
  const v = Math.abs(n || 0)
  if (v >= 1e6) return (n < 0 ? '-$' : '$') + (v/1e6).toFixed(2) + 'M'
  if (v >= 1e3) return (n < 0 ? '-$' : '$') + Math.round(v/1e3) + 'K'
  return (n < 0 ? '-$' : '$') + Math.round(v).toLocaleString()
}

const DEF_ASSETS = [
  { name:'401(k)', value:185000, category:'Retirement' },
  { name:'Roth IRA', value:48000, category:'Retirement' },
  { name:'Taxable Brokerage', value:62000, category:'Investments' },
  { name:'Primary Home', value:480000, category:'Real Estate' },
  { name:'Checking/Savings', value:22000, category:'Cash' },
]
const DEF_LIAB = [
  { name:'Mortgage', value:312000, category:'Real Estate' },
  { name:'Car Loan', value:18400, category:'Auto' },
  { name:'Student Loans', value:24200, category:'Education' },
]

const histData = [
  { m:'Jan', v:280000 }, { m:'Feb', v:298000 }, { m:'Mar', v:310000 },
  { m:'Apr', v:305000 }, { m:'May', v:322000 }, { m:'Jun', v:341200 },
]

export default function MNetWorth() {
  const [assets, setAssets] = useUserLS('nwt_mobile_assets', DEF_ASSETS)
  const [liabs, setLiabs] = useUserLS('nwt_mobile_liabs', DEF_LIAB)
  const [tab, setTab] = useState('overview')

  const totalAssets = assets.reduce((a, x) => a + x.value, 0)
  const totalLiabs = liabs.reduce((a, x) => a + x.value, 0)
  const netWorth = totalAssets - totalLiabs

  return (
    <div style={{ background:C.bg, minHeight:'100dvh' }}>
      <ScreenHeader title="Net Worth" subtitle="Planning" accent={C.gold} />

      {/* Hero */}
      <div style={{ padding:'14px 16px 0' }}>
        <MCard>
          <div style={{ fontFamily:UI, fontSize:11, color:C.t3, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:4 }}>Total Net Worth</div>
          <div style={{ fontFamily:DISPLAY, fontSize:36, fontWeight:700, color:C.gold }}>{fmt(netWorth)}</div>
          <div style={{ display:'flex', gap:20, marginTop:8 }}>
            <div><div style={{ fontFamily:UI, fontSize:10, color:C.t3, textTransform:'uppercase' }}>Assets</div><div style={{ fontFamily:MONO, fontSize:14, fontWeight:700, color:C.up }}>{fmt(totalAssets)}</div></div>
            <div><div style={{ fontFamily:UI, fontSize:10, color:C.t3, textTransform:'uppercase' }}>Liabilities</div><div style={{ fontFamily:MONO, fontSize:14, fontWeight:700, color:C.down }}>{fmt(totalLiabs)}</div></div>
          </div>
          <div style={{ marginTop:14, height:100 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={histData}>
                <defs>
                  <linearGradient id="nwGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.gold} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={C.gold} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" tick={{ fontFamily:MONO, fontSize:9, fill:C.t3 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={['auto','auto']} />
                <Tooltip contentStyle={{ background:C.raise, border:`1px solid ${C.b2}`, borderRadius:8 }} formatter={v=>[fmt(v)]} />
                <Area type="monotone" dataKey="v" stroke={C.gold} strokeWidth={2} fill="url(#nwGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </MCard>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', borderBottom:`1px solid ${C.b2}`, padding:'0 16px' }}>
        {['overview','assets','liabilities'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex:1, padding:'11px 0', background:'none', border:'none', cursor:'pointer',
            borderBottom:`2px solid ${tab===t ? C.gold : 'transparent'}`,
            color: tab===t ? C.gold : C.t3,
            fontFamily:UI, fontSize:12, fontWeight:600, textTransform:'capitalize',
          }}>{t}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div style={{ padding:'12px 16px 0' }}>
          {[['Assets', assets, C.up],['Liabilities', liabs, C.down]].map(([lbl, items, color]) => (
            <div key={lbl} style={{ marginBottom:14 }}>
              <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:8 }}>{lbl}</div>
              {items.map(item => (
                <div key={item.name} style={{
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                  padding:'12px 0', borderBottom:`1px solid ${C.b1}`,
                }}>
                  <div>
                    <div style={{ fontFamily:UI, fontSize:14, fontWeight:600, color:C.t1 }}>{item.name}</div>
                    <div style={{ fontFamily:UI, fontSize:11, color:C.t3 }}>{item.category}</div>
                  </div>
                  <div style={{ fontFamily:MONO, fontSize:14, fontWeight:700, color }}>{fmt(item.value)}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {tab === 'assets' && (
        <div style={{ padding:'12px 16px 0' }}>
          {assets.map((a, i) => (
            <MCard key={a.name}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                <div style={{ flex:1, fontFamily:UI, fontSize:14, fontWeight:600, color:C.t1 }}>{a.name}</div>
                <button onClick={() => setAssets(p => p.filter((_,j)=>j!==i))} style={{ background:'none', border:'none', cursor:'pointer' }}>
                  <Trash2 size={14} color={C.t3} />
                </button>
              </div>
              <div style={{ display:'flex', alignItems:'center', background:C.bg, border:`1px solid ${C.b2}`, borderRadius:8, padding:'0 10px' }}>
                <span style={{ fontFamily:MONO, fontSize:14, color:C.t3, marginRight:4 }}>$</span>
                <input
                  type="number"
                  value={a.value}
                  onChange={e => setAssets(p => p.map((x,j)=>j===i?{...x,value:+e.target.value||0}:x))}
                  style={{ flex:1, background:'none', border:'none', outline:'none', fontFamily:MONO, fontSize:16, color:C.up, padding:'10px 0' }}
                />
              </div>
            </MCard>
          ))}
          <MPrimaryBtn fullWidth onClick={() => setAssets(p => [...p, { name:`Asset ${p.length+1}`, value:0, category:'Other' }])}>
            + Add Asset
          </MPrimaryBtn>
        </div>
      )}

      {tab === 'liabilities' && (
        <div style={{ padding:'12px 16px 0' }}>
          {liabs.map((l, i) => (
            <MCard key={l.name}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                <div style={{ flex:1, fontFamily:UI, fontSize:14, fontWeight:600, color:C.t1 }}>{l.name}</div>
                <button onClick={() => setLiabs(p => p.filter((_,j)=>j!==i))} style={{ background:'none', border:'none', cursor:'pointer' }}>
                  <Trash2 size={14} color={C.t3} />
                </button>
              </div>
              <div style={{ display:'flex', alignItems:'center', background:C.bg, border:`1px solid ${C.b2}`, borderRadius:8, padding:'0 10px' }}>
                <span style={{ fontFamily:MONO, fontSize:14, color:C.t3, marginRight:4 }}>$</span>
                <input
                  type="number"
                  value={l.value}
                  onChange={e => setLiabs(p => p.map((x,j)=>j===i?{...x,value:+e.target.value||0}:x))}
                  style={{ flex:1, background:'none', border:'none', outline:'none', fontFamily:MONO, fontSize:16, color:C.down, padding:'10px 0' }}
                />
              </div>
            </MCard>
          ))}
          <MPrimaryBtn fullWidth onClick={() => setLiabs(p => [...p, { name:`Liability ${p.length+1}`, value:0, category:'Other' }])}>
            + Add Liability
          </MPrimaryBtn>
        </div>
      )}
      <div style={{ height:24 }} />
    </div>
  )
}
