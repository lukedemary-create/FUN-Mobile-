import { useState } from 'react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO } from '../../tokens'

const BROKERAGES = [
  {
    name:'Fidelity', type:'Full-Service', color:C.teal,
    best:'Best overall for most investors',
    pros:['No account minimum','$0 commissions on stocks/ETFs','Excellent research tools','Fractional shares available','Strong retirement account options'],
    cons:['Mutual fund fees vary','Interface can feel cluttered'],
    accounts:['Brokerage','IRA / Roth IRA','401k rollover','HSA'],
    rating:4.9,
  },
  {
    name:'Charles Schwab', type:'Full-Service', color:C.gold,
    best:'Best for long-term investors & retirees',
    pros:['No minimums','$0 commissions','24/7 customer service','Excellent advisor access','Strong ETF selection'],
    cons:['Cash sweep rates historically low','App less modern than competitors'],
    accounts:['Brokerage','IRA / Roth IRA','Checking & Savings','Rollover IRA'],
    rating:4.8,
  },
  {
    name:'Vanguard', type:'Full-Service', color:C.indigo,
    best:'Best for passive, long-term index investors',
    pros:['Industry-leading low-cost funds','Client-owned structure aligns incentives','Excellent for retirement accounts'],
    cons:['Dated platform interface','No fractional shares on stocks','Limited research tools'],
    accounts:['IRA / Roth IRA','Brokerage','529 Plans'],
    rating:4.6,
  },
  {
    name:'Interactive Brokers', type:'Advanced', color:C.gold,
    best:'Best for active traders & international investing',
    pros:['Lowest margin rates','Advanced trading tools','Access to 150+ global markets','IBKR Lite: $0 commissions'],
    cons:['Steep learning curve','Complex fee structure on Pro tier','Less beginner-friendly'],
    accounts:['Brokerage','IRA','Margin Account','Options'],
    rating:4.7,
  },
  {
    name:'Robinhood', type:'Mobile-First', color:'#27ae60',
    best:'Best for beginners wanting simple stock trading',
    pros:['Very simple mobile interface','$0 commissions','Fractional shares','Crypto support'],
    cons:['Payment for order flow model','Limited research','No IRAs on free tier','Controversial PFOF practices'],
    accounts:['Brokerage','Robinhood Gold','IRA'],
    rating:4.0,
  },
  {
    name:'J.P. Morgan Self-Directed', type:'Bank-Integrated', color:C.teal,
    best:'Best if you bank with Chase',
    pros:['Seamless Chase integration','$0 commissions','Blueprint portfolios available'],
    cons:['Limited research vs pure brokers','Fewer advanced features'],
    accounts:['Brokerage','IRA'],
    rating:4.3,
  },
]

const ACCOUNT_TYPES = [
  { t:'Taxable Brokerage', desc:'No contribution limits, no restrictions on withdrawals. Capital gains taxes apply. Best for goals beyond retirement.', use:'After maxing tax-advantaged accounts' },
  { t:'Traditional IRA', desc:'Pre-tax contributions (if eligible). Tax-deferred growth. Withdrawals taxed as ordinary income. RMDs at 73.', use:'If deductible and in higher bracket now' },
  { t:'Roth IRA', desc:'After-tax contributions. Tax-free growth and withdrawals. No RMDs. Best for younger investors.', use:'If in lower bracket now or expect higher later' },
  { t:'Rollover IRA', desc:'Receives funds from old employer 401k plans. Keeps tax-deferred status. Wide investment selection.', use:'When leaving a job with an old 401k' },
]

export default function MBrokerageGuide() {
  const [selected, setSelected] = useState(null)
  const [tab, setTab] = useState('compare')

  return (
    <div style={{ background:C.bg, minHeight:'100dvh' }}>
      <ScreenHeader title="Brokerage Guide" subtitle="More" accent={C.indigo} />

      <div style={{ display:'flex', borderBottom:`1px solid ${C.b2}`, padding:'0 16px' }}>
        {[['compare','Compare'],['accounts','Account Types'],['tips','Tips']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ flex:1, padding:'11px 0', background:'none', border:'none', cursor:'pointer', borderBottom:`2px solid ${tab===k ? C.indigo : 'transparent'}`, color: tab===k ? C.indigo : C.t3, fontFamily:UI, fontSize:12, fontWeight:600 }}>{l}</button>
        ))}
      </div>

      {tab === 'compare' && (
        <>
          <MSectionHeader label="Major Brokerages" />
          <div style={{ padding:'0 16px' }}>
            {BROKERAGES.map(b => (
              <div key={b.name}>
                <div onClick={() => setSelected(selected === b.name ? null : b.name)} style={{ background: selected===b.name ? `${b.color}10` : C.surf, border:`1px solid ${selected===b.name ? b.color : C.b2}`, borderRadius:16, padding:'14px', marginBottom:8, cursor:'pointer' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                    <div>
                      <div style={{ fontFamily:UI, fontSize:14, fontWeight:700, color:b.color }}>{b.name}</div>
                      <div style={{ fontFamily:UI, fontSize:11, color:C.t3 }}>{b.type}</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontFamily:MONO, fontSize:13, fontWeight:700, color:C.gold }}>★ {b.rating}</div>
                      <div style={{ fontFamily:MONO, fontSize:9, color:C.t3 }}>editor rating</div>
                    </div>
                  </div>
                  <div style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.teal, marginBottom: selected===b.name ? 10 : 0 }}>{b.best}</div>

                  {selected === b.name && (
                    <div style={{ borderTop:`1px solid ${C.b2}`, paddingTop:10 }}>
                      <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:'#4a7c59', marginBottom:4 }}>Pros</div>
                      {b.pros.map(p => (
                        <div key={p} style={{ display:'flex', gap:6, marginBottom:3 }}>
                          <span style={{ color:'#4a7c59', fontSize:11 }}>✓</span>
                          <span style={{ fontFamily:UI, fontSize:12, color:C.t2 }}>{p}</span>
                        </div>
                      ))}
                      <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:'#c0392b', marginTop:8, marginBottom:4 }}>Cons</div>
                      {b.cons.map(c => (
                        <div key={c} style={{ display:'flex', gap:6, marginBottom:3 }}>
                          <span style={{ color:'#c0392b', fontSize:11 }}>✗</span>
                          <span style={{ fontFamily:UI, fontSize:12, color:C.t2 }}>{c}</span>
                        </div>
                      ))}
                      <div style={{ marginTop:10 }}>
                        <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.t3, marginBottom:4 }}>Available Accounts</div>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                          {b.accounts.map(a => (
                            <span key={a} style={{ fontFamily:UI, fontSize:10, color:b.color, background:`${b.color}12`, border:`1px solid ${b.color}25`, borderRadius:5, padding:'2px 7px' }}>{a}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'accounts' && (
        <>
          <MSectionHeader label="Account Type Guide" />
          <div style={{ padding:'0 16px' }}>
            {ACCOUNT_TYPES.map(a => (
              <MCard key={a.t}>
                <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.indigo, marginBottom:4 }}>{a.t}</div>
                <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65, marginBottom:8 }}>{a.desc}</div>
                <div style={{ fontFamily:UI, fontSize:11, fontWeight:600, color:C.teal, background:'rgba(0,180,198,0.08)', border:'1px solid rgba(0,180,198,0.2)', borderRadius:6, padding:'4px 8px', display:'inline-block' }}>Use when: {a.use}</div>
              </MCard>
            ))}
          </div>
        </>
      )}

      {tab === 'tips' && (
        <>
          <MSectionHeader label="How to Choose" />
          <div style={{ padding:'0 16px' }}>
            <MCard style={{ background:C.raise }}>
              {[
                ['For Beginners','Start with Fidelity or Schwab. Full features, no minimums, excellent education resources, and long track records of reliability.'],
                ['For Retirement Focus','Vanguard or Fidelity. Lowest-cost index funds, excellent IRA options, long-term investor alignment.'],
                ['For Active Traders','Interactive Brokers. Best margin rates, advanced order types, global market access.'],
                ['For Bank Integration','Chase Self-Directed if you\'re already a Chase customer. Convenience and consolidated view.'],
                ['Avoid the Hype','Flashy apps with commission-free trading may use payment-for-order flow. For most investors, execution quality matters more than zero commissions.'],
              ].map(([l,v]) => (
                <div key={l} style={{ padding:'10px 0', borderBottom:`1px solid ${C.b1}` }}>
                  <div style={{ fontFamily:UI, fontSize:12, fontWeight:700, color:C.indigo, marginBottom:3 }}>{l}</div>
                  <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.6 }}>{v}</div>
                </div>
              ))}
            </MCard>
          </div>
        </>
      )}
      <div style={{ height:24 }} />
    </div>
  )
}
