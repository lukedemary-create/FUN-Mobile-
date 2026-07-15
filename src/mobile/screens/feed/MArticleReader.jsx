import { useLocation, useNavigate } from 'react-router-dom'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'

const FULL_CONTENT = `The Federal Reserve's decision to hold interest rates at 5.25–5.50% marks a pivotal moment in the tightening cycle. After one of the most aggressive rate hike campaigns in modern history, the pause signals a shift in the Fed's posture — but not necessarily a pivot to cuts.

**What the Rate Pause Means for Stocks**

Historically, rate pauses have been bullish for equities in the near term. The S&P 500 has averaged +10% in the 12 months following the final rate hike of a cycle. However, this assumes a soft landing scenario — mild economic slowdown without recession.

High-growth and technology stocks, which are most sensitive to discount rate changes, tend to benefit most from a stable or declining rate environment. Value stocks and financials may face headwinds if rates remain elevated and net interest margins compress.

**Bonds: The Opportunity Many Are Missing**

With the 10-year Treasury yield above 4.5%, investors have not seen this level of income from fixed income in over 15 years. Investment-grade corporate bonds now yield 5–6%, and high-yield bonds offer 7–9%.

Duration risk remains — if rates move higher unexpectedly, bond prices fall. But locking in yield at these levels provides meaningful income and portfolio diversification.

**Your Financial Plan Implications**

For those in or near retirement: this environment favors a higher fixed income allocation. The income argument for bonds is compelling in ways it hasn't been since 2007.

For long-term investors: a rate pause typically benefits the total portfolio. Maintain your allocation, continue dollar-cost averaging, and avoid timing the market based on Fed decisions.

For mortgage holders: refinancing may become attractive in 2025–2026 if the Fed begins cutting. Watch the 30-year fixed rate — when it drops below your current rate by 0.75%+, run the refinance math.

**Key Risks to Watch**

Inflation re-acceleration remains the primary risk. Sticky services inflation and energy price volatility could force the Fed back into hike mode — a scenario markets are not currently pricing in aggressively.

**Bottom Line**

The rate pause is not a signal to take dramatic action. Stay diversified, extend bond duration carefully, and review your portfolio's interest rate sensitivity. This is a moment for precision, not reaction.`

export default function MArticleReader() {
  const { state: article } = useLocation()
  const nav = useNavigate()

  const content = article ? FULL_CONTENT : ''
  const a = article || { title:'Article', category:'Markets', author:'Planora', date:'', mins:5, color:C.gold, tags:[] }

  return (
    <div style={{ background:C.bg, minHeight:'100dvh' }}>
      <ScreenHeader title={a.category} subtitle="Feed" accent={a.color} />

      <div style={{ padding:'16px 16px 0' }}>
        {/* Category + Meta */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <span style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:a.color, background:`${a.color}15`, border:`1px solid ${a.color}30`, borderRadius:5, padding:'3px 8px' }}>{a.category}</span>
          <span style={{ fontFamily:MONO, fontSize:10, color:C.t3 }}>{a.mins} min read · {a.date}</span>
        </div>

        {/* Title */}
        <div style={{ fontFamily:DISPLAY, fontSize:22, fontWeight:700, color:C.t1, lineHeight:1.3, marginBottom:12 }}>
          {a.title}
        </div>

        {/* Author */}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20, paddingBottom:16, borderBottom:`1px solid ${C.b2}` }}>
          <div style={{ width:32, height:32, borderRadius:'50%', background:`${a.color}20`, border:`1px solid ${a.color}40`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontFamily:MONO, fontSize:12, fontWeight:700, color:a.color }}>{a.author?.charAt(0)}</span>
          </div>
          <div>
            <div style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.t1 }}>{a.author}</div>
            <div style={{ fontFamily:UI, fontSize:11, color:C.t3 }}>Planora Insights</div>
          </div>
        </div>

        {/* Preview */}
        <div style={{ fontFamily:UI, fontSize:14, fontWeight:500, color:C.t1, lineHeight:1.7, marginBottom:20, padding:'14px', background:C.raise, borderLeft:`3px solid ${a.color}`, borderRadius:'0 12px 12px 0' }}>
          {a.preview}
        </div>

        {/* Full Content */}
        <div style={{ fontFamily:UI, fontSize:14, color:C.t2, lineHeight:1.85 }}>
          {content.split('\n\n').map((paragraph, i) => {
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              return (
                <div key={i} style={{ fontFamily:UI, fontSize:15, fontWeight:700, color:a.color, marginBottom:12, marginTop: i > 0 ? 20 : 0 }}>
                  {paragraph.replace(/\*\*/g, '')}
                </div>
              )
            }
            if (paragraph.includes('**')) {
              const parts = paragraph.split(/(\*\*[^*]+\*\*)/)
              return (
                <p key={i} style={{ marginBottom:16, marginTop:0 }}>
                  {parts.map((part, j) => part.startsWith('**') && part.endsWith('**')
                    ? <strong key={j} style={{ color:C.t1, fontWeight:700 }}>{part.replace(/\*\*/g, '')}</strong>
                    : <span key={j}>{part}</span>
                  )}
                </p>
              )
            }
            return <p key={i} style={{ marginBottom:16, marginTop:0 }}>{paragraph}</p>
          })}
        </div>

        {/* Tags */}
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:24, paddingTop:16, borderTop:`1px solid ${C.b2}` }}>
          {(a.tags || []).map(tag => (
            <span key={tag} style={{ fontFamily:UI, fontSize:11, color:a.color, background:`${a.color}12`, border:`1px solid ${a.color}25`, borderRadius:6, padding:'4px 10px' }}>{tag}</span>
          ))}
        </div>

        {/* Related */}
        <div style={{ marginTop:24, paddingTop:16, borderTop:`1px solid ${C.b2}` }}>
          <div style={{ fontFamily:UI, fontSize:11, fontWeight:700, color:C.t3, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:10 }}>More from Planora</div>
          {['The Roth Conversion Opportunity in 2026','Why Sector Rotation Matters Now','Building a Recession-Proof Portfolio'].map(title => (
            <div key={title} onClick={() => nav(-1)} style={{ padding:'11px 0', borderBottom:`1px solid ${C.b1}`, cursor:'pointer' }}>
              <div style={{ fontFamily:UI, fontSize:13, fontWeight:600, color:C.t1, marginBottom:2 }}>{title}</div>
              <div style={{ fontFamily:MONO, fontSize:10, color:C.t3 }}>Planora Insights · 5 min</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height:32 }} />
    </div>
  )
}
