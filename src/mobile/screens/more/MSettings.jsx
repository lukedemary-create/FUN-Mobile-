import { useState } from 'react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader } from '../../components/MCard'
import { C, UI, MONO } from '../../tokens'

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width:44, height:26, borderRadius:13, background: value ? C.indigo : C.b2, cursor:'pointer', position:'relative', transition:'background 0.2s', flexShrink:0 }}>
      <div style={{ position:'absolute', top:3, left: value ? 21 : 3, width:20, height:20, borderRadius:'50%', background:C.t1, transition:'left 0.2s' }} />
    </div>
  )
}

export default function MSettings() {
  const [notifs, setNotifs] = useState(true)
  const [marketAlerts, setMarketAlerts] = useState(true)
  const [newsDigest, setNewsDigest] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [compactView, setCompactView] = useState(false)
  const [biometric, setBiometric] = useState(false)
  const [dataSharing, setDataSharing] = useState(false)

  const SECTIONS = [
    {
      title:'Account',
      items:[
        { label:'Profile', sub:'Name, email, phone', type:'nav' },
        { label:'Subscription', sub:'Planora Free · Upgrade', type:'nav', badge:'Free' },
        { label:'Connected Accounts', sub:'Link financial accounts', type:'nav' },
        { label:'Advisor Connection', sub:'Link to your advisor', type:'nav' },
      ]
    },
    {
      title:'Notifications',
      items:[
        { label:'Push Notifications', sub:'In-app alerts', type:'toggle', value:notifs, onChange:setNotifs },
        { label:'Market Alerts', sub:'Volatility and key levels', type:'toggle', value:marketAlerts, onChange:setMarketAlerts },
        { label:'Daily News Digest', sub:'Morning briefing', type:'toggle', value:newsDigest, onChange:setNewsDigest },
      ]
    },
    {
      title:'Display',
      items:[
        { label:'Dark Mode', sub:'Arche warm-dark theme', type:'toggle', value:darkMode, onChange:setDarkMode },
        { label:'Compact View', sub:'Denser data layout', type:'toggle', value:compactView, onChange:setCompactView },
        { label:'Currency', sub:'US Dollar (USD)', type:'nav' },
      ]
    },
    {
      title:'Security',
      items:[
        { label:'Biometric Unlock', sub:'Face ID / Fingerprint', type:'toggle', value:biometric, onChange:setBiometric },
        { label:'Auto-Lock', sub:'After 5 minutes', type:'nav' },
        { label:'Change PIN', sub:'4-digit app PIN', type:'nav' },
      ]
    },
    {
      title:'Privacy & Data',
      items:[
        { label:'Analytics Sharing', sub:'Help improve Planora', type:'toggle', value:dataSharing, onChange:setDataSharing },
        { label:'Data Export', sub:'Download your data', type:'nav' },
        { label:'Delete Account', sub:'Permanently remove account', type:'nav', danger:true },
      ]
    },
    {
      title:'About',
      items:[
        { label:'App Version', sub:'1.0.0 Beta', type:'info' },
        { label:'Terms of Service', sub:'', type:'nav' },
        { label:'Privacy Policy', sub:'', type:'nav' },
        { label:'Licenses', sub:'Open source', type:'nav' },
      ]
    },
  ]

  return (
    <div style={{ background:C.bg, minHeight:'100dvh' }}>
      <ScreenHeader title="Settings" subtitle="More" accent={C.t2} />

      {/* Profile Card */}
      <div style={{ padding:'14px 16px 0' }}>
        <MCard style={{ background:C.raise }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:52, height:52, borderRadius:'50%', background:'rgba(129,140,248,0.15)', border:`2px solid ${C.indigo}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ fontFamily:'Playfair Display, Georgia, serif', fontSize:22, fontWeight:700, color:C.indigo }}>P</span>
            </div>
            <div>
              <div style={{ fontFamily:UI, fontSize:15, fontWeight:700, color:C.t1 }}>Planora User</div>
              <div style={{ fontFamily:UI, fontSize:12, color:C.t3 }}>user@email.com</div>
              <div style={{ fontFamily:UI, fontSize:11, color:C.indigo, marginTop:2 }}>Planora Free · Mobile Beta</div>
            </div>
          </div>
        </MCard>
      </div>

      {SECTIONS.map(section => (
        <div key={section.title}>
          <MSectionHeader label={section.title} />
          <div style={{ padding:'0 16px' }}>
            <MCard style={{ padding:0, overflow:'hidden' }}>
              {section.items.map((item, i) => (
                <div key={item.label} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px', borderBottom: i < section.items.length-1 ? `1px solid ${C.b1}` : 'none', cursor: item.type !== 'info' ? 'pointer' : 'default' }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:UI, fontSize:13, fontWeight:500, color: item.danger ? '#c0392b' : C.t1 }}>{item.label}</div>
                    {item.sub && <div style={{ fontFamily:UI, fontSize:11, color:C.t3, marginTop:1 }}>{item.sub}</div>}
                  </div>
                  {item.type === 'toggle' && <Toggle value={item.value} onChange={item.onChange} />}
                  {item.type === 'nav' && (
                    <>
                      {item.badge && <span style={{ fontFamily:UI, fontSize:10, fontWeight:700, color:C.teal, background:'rgba(0,180,198,0.1)', border:'1px solid rgba(0,180,198,0.2)', borderRadius:5, padding:'2px 6px' }}>{item.badge}</span>}
                      <span style={{ fontFamily:MONO, fontSize:16, color:C.t3 }}>›</span>
                    </>
                  )}
                  {item.type === 'info' && <span style={{ fontFamily:MONO, fontSize:12, color:C.t3 }}>{item.sub}</span>}
                </div>
              ))}
            </MCard>
          </div>
        </div>
      ))}

      {/* Sign Out */}
      <div style={{ padding:'14px 16px 32px' }}>
        <button style={{ width:'100%', padding:'14px', background:'transparent', border:`1px solid rgba(192,57,43,0.4)`, borderRadius:12, fontFamily:UI, fontSize:14, fontWeight:700, color:'#c0392b', cursor:'pointer' }}>
          Sign Out
        </button>
      </div>
    </div>
  )
}
