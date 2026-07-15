import { useLocation } from 'react-router-dom'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO } from '../../tokens'

const MODULE_CONTENT = {
  1: {
    sections:[
      { h:'LLC (Limited Liability Company)', body:'Most popular entity for small business. Flexible taxation — can be taxed as sole prop, partnership, S-Corp, or C-Corp. Personal liability protection. Relatively simple to form and maintain. Recommended for most solo entrepreneurs and small partnerships.' },
      { h:'S-Corporation', body:'Pass-through taxation like LLC. Key benefit: owner-employees pay payroll taxes only on reasonable salary, not on all distributions. This can create significant self-employment tax savings above ~$80K net income. Must be a US citizen, no more than 100 shareholders.' },
      { h:'C-Corporation', body:'Double taxation (corporate + dividend). But: 21% flat corporate tax rate makes it attractive for retained earnings at high incomes. Required for venture funding. Complex compliance. Rarely optimal for small business without growth capital needs.' },
      { h:'Sole Proprietorship', body:'Simplest structure — no formation needed. But: zero liability protection and full self-employment tax on all net income (15.3% up to ~$168K). Only appropriate for very early stage or low-risk operations.' },
      { h:'The S-Corp Election', body:'Many LLC owners elect S-Corp status when net income exceeds ~$80,000. The SE tax savings on distributions (not salary) can save $5,000–$15,000+ annually. Requires payroll setup and additional compliance. Do the math with your CPA.' },
    ]
  },
  2: {
    sections:[
      { h:'QBI Deduction (Section 199A)', body:'Qualified Business Income deduction allows pass-through owners to deduct up to 20% of qualified business income. Reduces effective tax rate significantly. Phase-out above $197,300 single / $394,600 married (2026). Service businesses have stricter limits.' },
      { h:'Solo 401(k) for Business Owners', body:'If self-employed with no employees (except spouse), a Solo 401k allows contributions up to $69,000 in 2026 ($76,500 with catch-up). Employee deferral + employer profit-sharing, potentially all pre-tax. Best retirement vehicle for high-income sole proprietors.' },
      { h:'Home Office Deduction', body:'Exclusive and regular use required. Actual expense method or simplified ($5/sq ft, max 300 sq ft). Deduct percentage of mortgage interest, utilities, insurance, repairs, and depreciation. Can be significant for full-time home-based businesses.' },
      { h:'Vehicle Deductions', body:'Standard mileage (67¢/mile in 2026) or actual expense method. Section 179 and bonus depreciation allow immediate expensing of qualifying vehicles. Heavy SUV (>6,000 lbs GVWR) threshold: up to $30,000 Section 179 in 2026.' },
      { h:'Health Insurance Deduction', body:'Self-employed can deduct 100% of health insurance premiums paid for themselves and family. Not available if eligible for employer-sponsored coverage through a spouse. One of the most overlooked deductions for business owners.' },
    ]
  },
}

const DEFAULT_CONTENT = {
  sections:[
    { h:'Overview', body:'This module covers essential concepts for business owners. Understanding these planning strategies can significantly impact your financial outcomes and long-term wealth building.' },
    { h:'Key Planning Areas', body:'Business owners face unique challenges: entity structure optimization, separating business and personal finances, building retirement wealth outside the business, and planning for an eventual exit.' },
    { h:'Action Steps', body:'Work with a CFP® who specializes in business owner planning. The intersection of personal financial planning, business taxation, and succession planning requires specialized expertise that most generalist advisors lack.' },
  ]
}

export default function MBizModule() {
  const { state } = useLocation()
  const mod = state || { id:1, title:'Business Entity Selection', icon:'🏢', mins:12 }
  const content = MODULE_CONTENT[mod.id] || DEFAULT_CONTENT

  return (
    <div style={{ background:C.bg, minHeight:'100dvh' }}>
      <ScreenHeader title={mod.title || 'Module'} subtitle="Business Planning" accent={C.gold} />

      <div style={{ padding:'16px 16px 0' }}>
        {/* Module header */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
          <span style={{ fontSize:28 }}>{mod.icon}</span>
          <div>
            <div style={{ fontFamily:'Playfair Display, Georgia, serif', fontSize:18, fontWeight:700, color:C.t1, lineHeight:1.2 }}>{mod.title}</div>
            <div style={{ fontFamily:UI, fontSize:11, color:C.gold, marginTop:3 }}>Business Planning · {mod.mins} min read</div>
          </div>
        </div>

        {content.sections.map((s, i) => (
          <MCard key={i}>
            <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.gold, marginBottom:8 }}>{s.h}</div>
            <div style={{ fontFamily:UI, fontSize:13, color:C.t2, lineHeight:1.7 }}>{s.body}</div>
          </MCard>
        ))}

        <MCard style={{ background:C.raise }}>
          <div style={{ fontFamily:UI, fontSize:12, fontWeight:600, color:C.gold, marginBottom:5 }}>Work With a Specialist</div>
          <div style={{ fontFamily:UI, fontSize:12, color:C.t2, lineHeight:1.65 }}>
            Business owner financial planning is one of the most complex and high-value areas in the profession. A CFP® with business planning expertise can identify strategies worth tens of thousands annually.
          </div>
        </MCard>
      </div>
      <div style={{ height:24 }} />
    </div>
  )
}
