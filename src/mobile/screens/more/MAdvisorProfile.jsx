import { useLocation, useNavigate } from 'react-router-dom'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'

const DEFAULT = {
  name:'Sarah Mitchell, CFP®', firm:'Meridian Wealth Partners', specialty:'Retirement Planning · Estate Strategy',
  aum:'$180M AUM', rating:4.9, reviews:47, city:'New York, NY', fee:'Fee-Only', badge:'Top Rated', badgeColor:C.teal,
  bio:'Sarah has 18 years of experience helping families and executives navigate complex financial planning decisions. As a CERTIFIED FINANCIAL PLANNER™ practitioner and CPA, she brings a holistic, tax-integrated approach to every client relationship.',
  services:['Retirement Income Planning','Tax Optimization Strategy','Estate & Gifting Strategy','Investment Policy & Asset Allocation','Business Owner Financial Planning'],
  credentials:['CFP® — Certified Financial Planner','CPA — Certified Public Accountant','Member, NAPFA','Member, FPA'],
  minimum:'$750,000 investable assets',
  feeStructure:'1.00% AUM on first $1M, 0.75% thereafter. No commissions. Fiduciary standard.',
}

export default function MAdvisorProfile() {
  const { state } = useLocation()
  const nav = useNavigate()
  const a = { ...DEFAULT, ...state }

  return (
    <div style={{ background:C.bg, minHeight:'100dvh' }}>
      <ScreenHeader title="Advisor Profile" subtitle="Wealth Counsel" accent={C.teal} />

      {/* Profile Header */}
      <div style={{ padding:'16px 16px 0' }}>
        <div style={{ background:C.raise, border:`1px solid ${C.b2}`, borderRadius:18, padding:'18px' }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:14 }}>
            <div style={{ width:60, height:60, borderRadius:'50%', background:`rgba(0,180,198,0.15)`, border:`2px solid ${C.teal}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ fontFamily:DISPLAY, fontSize:24, fontWeight:700, color:C.teal }}>{a.name.charAt(0)}</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:UI, fontSize:15, fontWeight:700, color:C.t1, marginBottom:2 }}>{a.name}</div>
              <div style={{ fontFamily:UI, fontSize:12, color:C.teal, marginBottom:2 }}>{a.firm}</div>
              <div style={{ fontFamily:UI, fontSize:11, color:C.t3 }}>{a.city}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:MONO, fontSize:15, fontWeight:700, color:C.teal }}>★ {a.rating}</div>
              <div style={{ fontFamily:UI, fontSize:10, color:C.t3 }}>{a.reviews} reviews</div>
            </div>
          </div>

          <div style={{ fontFamily:UI, fontSize:13, color:C.t2, lineHeight:1.7, marginBottom:14 }}>{a.bio || DEFAULT.bio}</div>

          <div style={{ display:'flex', gap:8 }}>
            <span style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:C.teal, background:'rgba(0,180,198,0.12)', border:'1px solid rgba(0,180,198,0.25)', borderRadius:6, padding:'3px 8px' }}>{a.fee}</span>
            <span style={{ fontFamily:MONO, fontSize:10, color:C.t3, background:C.b1, borderRadius:6, padding:'3px 8px' }}>{a.aum}</span>
          </div>
        </div>
      </div>

      {/* Services */}
      <MSectionHeader label="Services Offered" />
      <div style={{ padding:'0 16px' }}>
        <MCard>
          {(a.services || DEFAULT.services).map((s, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom: i < (a.services || DEFAULT.services).length-1 ? `1px solid ${C.b1}` : 'none' }}>
              <span style={{ fontFamily:MONO, fontSize:11, color:C.teal }}>✓</span>
              <span style={{ fontFamily:UI, fontSize:13, color:C.t2 }}>{s}</span>
            </div>
          ))}
        </MCard>
      </div>

      {/* Credentials */}
      <MSectionHeader label="Credentials & Memberships" />
      <div style={{ padding:'0 16px' }}>
        <MCard>
          {(a.credentials || DEFAULT.credentials).map((c, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom: i < (a.credentials || DEFAULT.credentials).length-1 ? `1px solid ${C.b1}` : 'none' }}>
              <span style={{ fontFamily:UI, fontSize:14 }}>🏅</span>
              <span style={{ fontFamily:UI, fontSize:12, color:C.t2 }}>{c}</span>
            </div>
          ))}
        </MCard>
      </div>

      {/* Fees */}
      <MSectionHeader label="Fees & Minimums" />
      <div style={{ padding:'0 16px' }}>
        <MCard style={{ background:C.raise }}>
          <div style={{ marginBottom:10 }}>
            <div style={{ fontFamily:UI, fontSize:11, color:C.t3, marginBottom:3 }}>Minimum</div>
            <div style={{ fontFamily:UI, fontSize:13, color:C.t1 }}>{a.minimum || DEFAULT.minimum}</div>
          </div>
          <div>
            <div style={{ fontFamily:UI, fontSize:11, color:C.t3, marginBottom:3 }}>Fee Structure</div>
            <div style={{ fontFamily:UI, fontSize:13, color:C.t2, lineHeight:1.6 }}>{a.feeStructure || DEFAULT.feeStructure}</div>
          </div>
        </MCard>
      </div>

      {/* CTA */}
      <div style={{ padding:'14px 16px 24px' }}>
        <button style={{ width:'100%', padding:'14px', background:C.teal, border:'none', borderRadius:12, fontFamily:UI, fontSize:14, fontWeight:700, color:C.bg, cursor:'pointer' }}>
          Request Introduction
        </button>
      </div>
    </div>
  )
}
