import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  motion, AnimatePresence, useInView,
  useScroll, useTransform, useSpring, useMotionValue,
} from 'framer-motion';
import {
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer,
} from 'recharts';
import {
  Activity, Shield, Users, BookOpen, TrendingUp,
  Lock, BarChart2, Globe, ArrowRight, Target,
} from 'lucide-react';

/* ─── TOKENS ────────────────────────────────────────────────────── */
const C = {
  bg:        '#0a0a0f',
  surface:   '#111318',
  elevated:  '#16181f',
  border:    '#1e2028',
  text:      '#f1f5f9',
  textSec:   '#94a3b8',
  textMuted: '#64748b',
  success:   '#10b981',
  warning:   '#f59e0b',
  danger:    '#ef4444',
  gold:      '#F5A623',
  teal:      '#00B4C6',
  indigo:    '#818cf8',
};

/* ─── CHART DATA ─────────────────────────────────────────────────── */
const gdpData = [
  { y:'2022', usa:2.1, eu:3.5, china:3.0 },
  { y:'2023', usa:2.5, eu:0.6, china:5.2 },
  { y:'2024', usa:2.8, eu:0.9, china:4.8 },
  { y:'2025', usa:2.4, eu:1.4, china:4.5 },
  { y:'2026', usa:2.6, eu:1.8, china:4.2 },
];
const allocData = [
  { name:'Equities',     value:58.2, color:C.gold    },
  { name:'Fixed Income', value:22.1, color:C.teal    },
  { name:'Alternatives', value:14.0, color:C.indigo  },
  { name:'Real Estate',  value:2.0,  color:'#10b981' },
  { name:'Cash',         value:3.7,  color:'#64748b' },
];
const fpData = [
  {y:0,v:100000},{y:5,v:148000},{y:10,v:210000},
  {y:15,v:320000},{y:20,v:480000},{y:25,v:720000},{y:30,v:1100000},
];

/* ─── GLOBAL CSS ─────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { overflow-x: hidden; }
  input::placeholder { color: #64748b; }

  @keyframes breatheGold {
    0%,100% { box-shadow: 0 0 20px rgba(245,166,35,0.15); }
    50%      { box-shadow: 0 0 55px rgba(245,166,35,0.45); }
  }
  @keyframes tickerScroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes scanLine {
    0%   { top:0%; opacity:0; }
    5%   { opacity:0.4; }
    95%  { opacity:0.4; }
    100% { top:100%; opacity:0; }
  }
  @keyframes orbDrift {
    0%   { transform: translate(0px,0px) scale(1); }
    33%  { transform: translate(60px,-40px) scale(1.08); }
    66%  { transform: translate(-30px,25px) scale(0.96); }
    100% { transform: translate(0px,0px) scale(1); }
  }
  @keyframes featureFloat {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-5px); }
  }
  @keyframes shimmerSlide {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  .ticker-track { display:flex; animation: tickerScroll 28s linear infinite; }
  .scan-line    { position:absolute; left:0; right:0; height:1px; background:rgba(0,180,198,0.35); animation:scanLine 9s linear infinite; pointer-events:none; z-index:2; }
  .orb          { position:absolute; border-radius:50%; filter:blur(110px); pointer-events:none; animation:orbDrift 30s ease-in-out infinite; }
`;

/* ─── PARTICLE CANVAS ────────────────────────────────────────────── */
function ParticleCanvas({ count = 260, style = {} }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.16,
      size: Math.random() * 1.8 + 0.3,
      opacity: Math.random() * 0.28 + 0.06,
      color: Math.random() > 0.48 ? C.gold : C.teal,
      layer: Math.floor(Math.random() * 3),
    }));

    const SPEED = [0.2, 0.55, 1.0];
    const ALPHA = [0.1, 0.2, 0.35];

    const tick = () => {
      if (!canvas.width) { animRef.current = requestAnimationFrame(tick); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      particles.forEach(p => {
        p.x += p.vx * SPEED[p.layer];
        p.y += p.vy * SPEED[p.layer];
        if (p.x < -4) p.x = canvas.width + 4;
        if (p.x > canvas.width + 4) p.x = -4;
        if (p.y < -4) p.y = canvas.height + 4;
        if (p.y > canvas.height + 4) p.y = -4;
        const dx = p.x - mx, dy = p.y - my;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100 && dist > 0) { const f = (100 - dist) / 100; p.x += (dx/dist)*f*1.5; p.y += (dy/dist)*f*1.5; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (p.layer + 1) / 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity * ALPHA[p.layer];
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(tick);
    };
    tick();

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    document.addEventListener('mousemove', onMove);
    return () => { cancelAnimationFrame(animRef.current); ro.disconnect(); document.removeEventListener('mousemove', onMove); };
  }, [count]);

  return <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', ...style }} />;
}

/* ─── BOOT OVERLAY ───────────────────────────────────────────────── */
function BootOverlay({ onComplete }) {
  const [phase, setPhase]       = useState(0);
  const [typed, setTyped]       = useState('');
  const [tagTyped, setTagTyped] = useState('');
  const [done, setDone]         = useState(false);
  const wordmark = 'PLANORA';
  const tagline  = 'INSTITUTIONAL INTELLIGENCE. PERSONAL IMPACT.';

  const skip = useCallback(() => { setDone(true); setTimeout(onComplete, 400); }, [onComplete]);

  useEffect(() => {
    const timers = [];
    const t = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); };
    t(() => setPhase(1), 300);
    t(() => setPhase(2), 1200);
    t(() => setPhase(3), 1700);
    let i = 0;
    const typeWord = () => { if (i < wordmark.length) { i++; setTyped(wordmark.slice(0, i)); t(typeWord, 80); } };
    t(typeWord, 1750);
    let j = 0;
    const typeTag = () => { if (j < tagline.length) { j++; setTagTyped(tagline.slice(0, j)); t(typeTag, 22); } };
    t(() => { setPhase(4); typeTag(); }, 2350);
    t(() => setPhase(5), 3000);
    t(() => { setDone(true); onComplete(); }, 3500);
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          onClick={skip}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          style={{ position:'fixed', inset:0, zIndex:9999, background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', cursor:'pointer', overflow:'hidden' }}
        >
          {phase >= 1 && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.6 }} style={{ position:'absolute', inset:0 }}>
              <ParticleCanvas count={180} />
            </motion.div>
          )}
          {phase === 0 && (
            <motion.div
              initial={{ opacity:0, scale:0 }} animate={{ opacity:[0,1,0.4,1], scale:[0,1.4,0.8,1] }} transition={{ duration:0.3 }}
              style={{ width:6, height:6, borderRadius:'50%', background:C.gold, boxShadow:`0 0 20px ${C.gold}` }}
            />
          )}
          {phase >= 2 && (
            <motion.div
              initial={{ scale:0, opacity:0 }}
              animate={phase >= 5 ? { scale:0.3, opacity:0, y:-300, x:-480 } : { scale:1, opacity:1 }}
              transition={phase >= 5 ? { duration:0.45, ease:[0.4,0,0.2,1] } : { type:'spring', stiffness:280, damping:22 }}
              style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:20, position:'relative', zIndex:2 }}
            >
              <motion.div
                initial={{ scale:0 }} animate={{ scale:1 }}
                transition={{ type:'spring', stiffness:320, damping:20 }}
                style={{ width:80, height:80, background:C.gold, borderRadius:20, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 60px ${C.gold}70, 0 0 120px ${C.gold}30`, animation:'breatheGold 2.5s ease-in-out infinite' }}
              >
                <span style={{ fontSize:40, fontWeight:900, color:'#0a0a0f', lineHeight:1, fontFamily:'Inter, sans-serif', letterSpacing:'-0.04em' }}>P</span>
              </motion.div>
              {phase >= 3 && (
                <div style={{ display:'flex', gap:2 }}>
                  {typed.split('').map((ch, i) => (
                    <motion.span key={i} initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.15 }}
                      style={{ fontSize:32, fontWeight:900, color:C.gold, letterSpacing:'0.18em', fontFamily:'Inter, sans-serif', textShadow:`0 0 30px ${C.gold}60` }}
                    >{ch}</motion.span>
                  ))}
                  {typed.length < wordmark.length && (
                    <motion.span animate={{ opacity:[1,0] }} transition={{ repeat:Infinity, duration:0.5 }} style={{ fontSize:32, color:C.gold }}>|</motion.span>
                  )}
                </div>
              )}
              {phase >= 4 && (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.3 }}
                  style={{ fontSize:10, fontWeight:700, color:C.teal, letterSpacing:'0.22em', textTransform:'uppercase', fontFamily:'Inter, sans-serif', maxWidth:400, textAlign:'center' }}
                >
                  {tagTyped}
                  {tagTyped.length < tagline.length && (
                    <motion.span animate={{ opacity:[1,0] }} transition={{ repeat:Infinity, duration:0.4 }}>|</motion.span>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:0.5 }} transition={{ delay:0.8 }}
            style={{ position:'absolute', bottom:32, right:32, fontSize:11, color:C.textMuted, border:`1px solid ${C.border}`, borderRadius:6, padding:'6px 14px', letterSpacing:'0.06em' }}
          >CLICK TO SKIP</motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── NAV ────────────────────────────────────────────────────────── */
function Nav({ onEnter, visible, scrollY }) {
  const navBg = useTransform(scrollY, [0, 80], ['rgba(10,10,15,0.0)', 'rgba(10,10,15,0.92)']);
  const navBorder = useTransform(scrollY, [0, 80], ['rgba(30,32,40,0)', 'rgba(30,32,40,1)']);
  const links = ['Platform','Solutions','Research','Wealth','Education','About'];

  return (
    <motion.header
      initial={{ opacity:0, y:-20 }}
      animate={visible ? { opacity:1, y:0 } : { opacity:0, y:-20 }}
      transition={{ duration:0.5 }}
      style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, backdropFilter:'blur(24px)', background:navBg, borderBottom:`1px solid`, borderBottomColor:navBorder }}
    >
      <div style={{ maxWidth:1280, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:60 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:30, height:30, background:C.gold, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 12px ${C.gold}40` }}>
            <span style={{ fontSize:14, fontWeight:900, color:'#0a0a0f', lineHeight:1 }}>P</span>
          </div>
          <span style={{ fontSize:14, fontWeight:800, color:C.text, letterSpacing:'0.04em' }}>PLANORA</span>
          <span style={{ fontSize:8, fontWeight:700, color:C.gold, letterSpacing:'0.1em', textTransform:'uppercase', opacity:0.75 }}>TERMINAL</span>
        </div>
        <nav style={{ display:'flex', alignItems:'center', gap:2 }}>
          {links.map(l => (
            <button key={l} style={{ background:'none', border:'none', cursor:'pointer', padding:'6px 11px', borderRadius:6, fontSize:13, color:C.textSec, fontWeight:500, fontFamily:'inherit', transition:'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = C.text}
              onMouseLeave={e => e.currentTarget.style.color = C.textSec}
            >{l}</button>
          ))}
        </nav>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <button style={{ background:'none', border:'none', cursor:'pointer', padding:'7px 14px', fontSize:13, color:C.textSec, fontFamily:'inherit' }}>Sign In</button>
          <button onClick={onEnter} style={{ background:C.gold, color:'#0a0a0f', border:'none', borderRadius:8, padding:'8px 18px', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontFamily:'inherit', boxShadow:`0 0 20px ${C.gold}35`, transition:'box-shadow 0.2s, transform 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow=`0 0 36px ${C.gold}60`; e.currentTarget.style.transform='translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow=`0 0 20px ${C.gold}35`; e.currentTarget.style.transform='none'; }}
          >Request Demo <ArrowRight size={13}/></button>
        </div>
      </div>
    </motion.header>
  );
}

/* ─── CHAR-BY-CHAR TITLE ─────────────────────────────────────────── */
function CharByChar({ text, style = {} }) {
  const chars = text.split('');
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once:true, margin:'-80px' }}
      variants={{ hidden:{}, visible:{ transition:{ staggerChildren:0.025 } } }}
      style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', ...style }}
    >
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity:0, y:14, filter:'blur(4px)' },
            visible: { opacity:1, y:0, filter:'blur(0px)', transition:{ type:'spring', stiffness:280, damping:22 } },
          }}
          style={{ display:'inline-block', whiteSpace: ch === ' ' ? 'pre' : 'normal' }}
        >{ch === ' ' ? '\u00a0' : ch}</motion.span>
      ))}
    </motion.div>
  );
}

/* ─── HERO DASHBOARD MOCKUP ──────────────────────────────────────── */
function HeroDashboard({ rotateX, rotateY, opacity, scale }) {
  return (
    <motion.div style={{ opacity, scale, perspective: 1200 }} initial={{ opacity:0, x:50 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.9, delay:0.5, ease:[0.22,1,0.36,1] }}>
      {/* Continuous float */}
      <motion.div animate={{ y:[0,-12,0] }} transition={{ duration:5.2, repeat:Infinity, ease:'easeInOut' }} style={{ transformStyle:'preserve-3d' }}>
        {/* Subtle rotation oscillation — different period for organic feel */}
        <motion.div animate={{ rotateZ:[0,-1.3,0] }} transition={{ duration:7.1, repeat:Infinity, ease:'easeInOut' }} style={{ transformStyle:'preserve-3d' }}>
          {/* Mouse tilt — driven by spring motion values from parent */}
          <motion.div style={{ rotateX, rotateY, position:'relative', transformStyle:'preserve-3d' }}>

            {/* Floating portfolio card */}
            <motion.div
              initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }}
              transition={{ delay:1.2, duration:0.7 }}
              style={{ position:'absolute', top:'10%', left:'4%', zIndex:4, background:'rgba(17,19,24,0.94)', backdropFilter:'blur(16px)', border:`1px solid ${C.border}`, borderRadius:12, padding:'12px 16px', width:148, boxShadow:'0 20px 50px rgba(0,0,0,0.5)' }}
            >
              <div style={{ fontSize:8, color:C.textMuted, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:8 }}>Portfolio</div>
              <div style={{ width:80, height:80, margin:'0 auto 8px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={allocData} innerRadius={22} outerRadius={36} dataKey="value" strokeWidth={0}>
                      {allocData.map((e,i) => <Cell key={i} fill={e.color}/>)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ fontSize:14, fontWeight:800, color:C.text, fontFamily:'monospace', textAlign:'center' }}>$28.7M</div>
              <div style={{ fontSize:9, color:C.success, fontFamily:'monospace', textAlign:'center' }}>+12.4% YTD</div>
            </motion.div>

            {/* Floating risk card */}
            <motion.div
              initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}
              transition={{ delay:1.4, duration:0.7 }}
              style={{ position:'absolute', bottom:'6%', right:'-14%', zIndex:4, background:'rgba(17,19,24,0.94)', backdropFilter:'blur(16px)', border:`1px solid ${C.teal}35`, borderRadius:12, padding:'12px 16px', width:136, boxShadow:`0 20px 50px rgba(0,0,0,0.5), 0 0 20px ${C.teal}15` }}
            >
              <div style={{ fontSize:8, color:C.textMuted, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:6 }}>Risk Score</div>
              <div style={{ fontSize:28, fontWeight:900, color:C.teal, fontFamily:'monospace', letterSpacing:'-0.02em' }}>42</div>
              <div style={{ fontSize:9, color:C.teal, fontWeight:700, marginBottom:8 }}>MODERATE</div>
              <div style={{ height:4, background:C.elevated, borderRadius:2 }}>
                <div style={{ width:'42%', height:'100%', background:`linear-gradient(90deg, ${C.success}, ${C.teal})`, borderRadius:2 }}/>
              </div>
            </motion.div>

            {/* Main dashboard window */}
            <div style={{ background:'#0d1117', border:`1px solid ${C.border}`, borderRadius:16, overflow:'hidden', boxShadow:`0 50px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04), 0 0 60px ${C.gold}10`, position:'relative' }}>
              <div className="scan-line"/>
              {/* Chrome */}
              <div style={{ background:C.elevated, padding:'10px 14px', display:'flex', alignItems:'center', gap:6, borderBottom:`1px solid ${C.border}` }}>
                {['#ef4444','#f59e0b','#10b981'].map((c,i) => <div key={i} style={{ width:10, height:10, borderRadius:'50%', background:c, opacity:0.8 }}/>)}
                <div style={{ flex:1, display:'flex', justifyContent:'center' }}>
                  <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, padding:'3px 20px', fontSize:10, color:C.textMuted, fontFamily:'monospace' }}>planora.app/dashboard</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                  <div style={{ width:5, height:5, borderRadius:'50%', background:C.success, boxShadow:`0 0 6px ${C.success}` }}/>
                  <span style={{ fontSize:9, color:C.success, fontFamily:'monospace', fontWeight:700 }}>LIVE</span>
                </div>
              </div>
              {/* Ticker */}
              <div style={{ background:C.bg, borderBottom:`1px solid ${C.border}`, overflow:'hidden', height:24 }}>
                <div className="ticker-track">
                  {['S&P 500 7,242.53 +0.39%','AAPL $192.40 +1.24%','NVDA $875.62 +2.18%','MSFT $415.20 -0.31%','TSLA $256.80 +3.45%','JPM $198.40 +0.88%',
                    'S&P 500 7,242.53 +0.39%','AAPL $192.40 +1.24%','NVDA $875.62 +2.18%','MSFT $415.20 -0.31%','TSLA $256.80 +3.45%','JPM $198.40 +0.88%',
                  ].map((t,i) => (
                    <span key={i} style={{ fontSize:9, color:i%3===2?C.danger:C.success, fontFamily:'monospace', padding:'0 20px', lineHeight:'24px', whiteSpace:'nowrap' }}>{t}</span>
                  ))}
                </div>
              </div>
              {/* Body */}
              <div style={{ display:'flex', height:300 }}>
                {/* Sidebar */}
                <div style={{ width:46, background:C.bg, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', alignItems:'center', padding:'10px 0', gap:6 }}>
                  <div style={{ width:26, height:26, background:C.gold, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:4, boxShadow:`0 0 10px ${C.gold}50` }}>
                    <span style={{ fontSize:11, fontWeight:900, color:'#0a0a0f' }}>P</span>
                  </div>
                  {[true,false,false,false,false,false].map((active,i) => (
                    <div key={i} style={{ width:28, height:28, borderRadius:6, background:active?`${C.gold}18`:'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <div style={{ width:13, height:2, background:active?C.gold:'rgba(255,255,255,0.15)', borderRadius:2 }}/>
                    </div>
                  ))}
                </div>
                {/* Main */}
                <div style={{ flex:1, padding:'12px', overflow:'hidden' }}>
                  <div style={{ fontSize:8, fontWeight:700, letterSpacing:'0.14em', color:C.textMuted, textTransform:'uppercase', marginBottom:8 }}>MARKETS OVERVIEW</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:5, marginBottom:8 }}>
                    {[
                      { sym:'S&P 500',   val:'7,242.53',  chg:'+28.06', pct:'+0.39%', up:true  },
                      { sym:'DOW JONES', val:'49,502.00', chg:'-163.00',pct:'-0.33%', up:false },
                      { sym:'NASDAQ',    val:'25,288.63', chg:'+248.38',pct:'+0.99%', up:true  },
                    ].map(idx => (
                      <div key={idx.sym} style={{ background:C.elevated, borderRadius:6, padding:'7px 8px', border:`1px solid ${idx.up?'rgba(16,185,129,0.2)':'rgba(239,68,68,0.2)'}` }}>
                        <div style={{ fontSize:7.5, color:C.textMuted, fontFamily:'monospace', marginBottom:2 }}>{idx.sym}</div>
                        <div style={{ fontSize:12, fontWeight:700, color:C.text, fontFamily:'monospace' }}>{idx.val}</div>
                        <div style={{ fontSize:8.5, color:idx.up?C.success:C.danger, fontFamily:'monospace' }}>{idx.chg} ({idx.pct})</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:C.elevated, borderRadius:6, padding:'8px 10px', marginBottom:8, border:`1px solid ${C.border}` }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                      <span style={{ fontSize:8, color:C.textSec, fontFamily:'monospace' }}>S&P 500 · 1D</span>
                      <span style={{ fontSize:8, color:C.success, fontFamily:'monospace', fontWeight:600 }}>+0.39%</span>
                    </div>
                    <svg width="100%" height="38" viewBox="0 0 260 38" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="hero-g" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.28"/>
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                        </linearGradient>
                        <filter id="lineGlow"><feGaussianBlur stdDeviation="1.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                      </defs>
                      <polygon points="0,34 22,26 43,30 65,18 87,12 108,15 130,8 152,4 173,10 195,2 216,0 238,4 260,2 260,38 0,38" fill="url(#hero-g)"/>
                      <polyline points="0,34 22,26 43,30 65,18 87,12 108,15 130,8 152,4 173,10 195,2 216,0 238,4 260,2" stroke="#10b981" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#lineGlow)"/>
                    </svg>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:3 }}>
                    {[{sym:'XLK',pct:'+1.49%',up:true},{sym:'XLF',pct:'-0.48%',up:false},{sym:'XLE',pct:'-1.34%',up:false},{sym:'XLV',pct:'-0.53%',up:false},{sym:'XLY',pct:'+0.24%',up:true}].map(s => (
                      <div key={s.sym} style={{ background:s.up?'rgba(16,185,129,0.12)':'rgba(239,68,68,0.12)', borderRadius:4, padding:4, textAlign:'center', border:`1px solid ${s.up?'rgba(16,185,129,0.22)':'rgba(239,68,68,0.22)'}` }}>
                        <div style={{ fontSize:8, fontWeight:700, color:C.text, fontFamily:'monospace' }}>{s.sym}</div>
                        <div style={{ fontSize:7.5, color:s.up?C.success:C.danger, fontFamily:'monospace' }}>{s.pct}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Right panel */}
                <div style={{ width:108, borderLeft:`1px solid ${C.border}`, padding:'12px 10px', display:'flex', flexDirection:'column', gap:10 }}>
                  <div>
                    <div style={{ fontSize:7.5, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>Fear & Greed</div>
                    <svg width="88" height="48" viewBox="0 0 88 48">
                      <defs><linearGradient id="fg-g" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#ef4444"/><stop offset="50%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#10b981"/></linearGradient></defs>
                      <path d="M 7 43 A 37 37 0 0 1 81 43" stroke="#1e2028" strokeWidth="7" fill="none" strokeLinecap="round"/>
                      <path d="M 7 43 A 37 37 0 0 1 81 43" stroke="url(#fg-g)" strokeWidth="7" fill="none" strokeLinecap="round" strokeDasharray="116" strokeDashoffset="30"/>
                      <text x="44" y="41" textAnchor="middle" fontSize="16" fontWeight="800" fill={C.text} fontFamily="monospace">48</text>
                    </svg>
                    <div style={{ fontSize:9, color:C.warning, fontWeight:700, marginTop:-2 }}>Neutral</div>
                  </div>
                  <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:8 }}>
                    <div style={{ fontSize:7.5, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>Market Clock</div>
                    <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:3 }}>
                      <div style={{ width:5, height:5, borderRadius:'50%', background:C.danger }}/>
                      <span style={{ fontSize:9, color:C.danger, fontWeight:700 }}>CLOSED</span>
                    </div>
                    <div style={{ fontSize:11, color:C.text, fontFamily:'monospace', fontWeight:700 }}>01:45:12</div>
                    <div style={{ fontSize:8, color:C.textMuted, marginTop:2 }}>Opens Mon 9:30</div>
                  </div>
                  <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:8 }}>
                    <div style={{ fontSize:7.5, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>VIX</div>
                    <div style={{ fontSize:13, fontWeight:700, color:C.text, fontFamily:'monospace' }}>18.42</div>
                    <div style={{ fontSize:8, color:C.success, fontFamily:'monospace' }}>+0.00%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Portfolio value badge */}
            <motion.div
              initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.5, duration:0.55 }}
              style={{ position:'absolute', bottom:-20, left:-28, background:'rgba(17,19,24,0.94)', backdropFilter:'blur(12px)', border:`1px solid ${C.border}`, borderRadius:12, padding:'10px 14px', boxShadow:'0 20px 50px rgba(0,0,0,0.5)', display:'flex', alignItems:'center', gap:10, zIndex:3 }}
            >
              <div style={{ width:32, height:32, background:`rgba(16,185,129,0.12)`, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <TrendingUp size={14} color={C.success}/>
              </div>
              <div>
                <div style={{ fontSize:10, color:C.textSec }}>Portfolio Value</div>
                <div style={{ fontSize:14, fontWeight:700, color:C.text, fontFamily:'monospace' }}>$2,847,320</div>
              </div>
              <div style={{ fontSize:11, color:C.success, fontFamily:'monospace', fontWeight:600 }}>+2.4%</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ─── SCENE 2: PLATFORM CARD ─────────────────────────────────────── */
function PlatformCard({ p, navigate, entryVariants }) {
  const cardRef   = useRef(null);
  const spotX     = useMotionValue(0);
  const spotY     = useMotionValue(0);
  const rotX      = useMotionValue(0);
  const rotY      = useMotionValue(0);
  const springRotX = useSpring(rotX, { stiffness:300, damping:25 });
  const springRotY = useSpring(rotY, { stiffness:300, damping:25 });
  const [hov, setHov] = useState(false);

  const onMove = useCallback((e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    spotX.set(x - 150);
    spotY.set(y - 150);
    rotX.set(((y / r.height) - 0.5) * -12);
    rotY.set(((x / r.width)  - 0.5) *  12);
  }, [rotX, rotY, spotX, spotY]);

  const onLeave = useCallback(() => {
    rotX.set(0); rotY.set(0); setHov(false);
  }, [rotX, rotY]);

  return (
    <motion.div variants={entryVariants} style={{ perspective:1200, transformStyle:'preserve-3d' }}>
      <motion.div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={onLeave}
        onClick={() => navigate(p.route)}
        style={{
          rotateX: springRotX,
          rotateY: springRotY,
          transformStyle: 'preserve-3d',
          background: C.surface,
          border: `1px solid ${hov ? p.accent + '55' : C.border}`,
          borderRadius:18, padding:28, cursor:'pointer',
          position:'relative', overflow:'hidden',
          boxShadow: hov ? `0 28px 64px rgba(0,0,0,0.55), 0 0 40px ${p.accent}15` : '0 8px 32px rgba(0,0,0,0.3)',
          transition:'border-color 0.25s, box-shadow 0.25s',
          willChange:'transform',
        }}
        whileHover={{ scale:1.02, transition:{ type:'spring', stiffness:200, damping:20 } }}
      >
        {/* Mouse-tracking spotlight */}
        <motion.div style={{ position:'absolute', width:300, height:300, borderRadius:'50%', background:`radial-gradient(circle, ${p.accent}18 0%, transparent 70%)`, pointerEvents:'none', x:spotX, y:spotY, opacity: hov ? 1 : 0, transition:'opacity 0.3s' }}/>

        {/* Top accent bar */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, transparent, ${p.accent}, transparent)`, borderRadius:'18px 18px 0 0' }}/>

        {/* Corner glow */}
        <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, background:`radial-gradient(circle, ${p.accent}10 0%, transparent 65%)`, pointerEvents:'none' }}/>

        {/* Arrow */}
        <motion.div
          animate={{ rotate: hov ? 45 : 0, color: hov ? p.accent : C.textMuted }}
          transition={{ duration:0.22 }}
          style={{ position:'absolute', top:22, right:22 }}
        >
          <ArrowRight size={15} color={hov ? p.accent : C.textMuted}/>
        </motion.div>

        <div style={{ marginBottom:18 }}>{p.icon}</div>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', color:p.accent, textTransform:'uppercase', marginBottom:6 }}>{p.label}</div>
        <div style={{ fontSize:21, fontWeight:800, color:C.text, letterSpacing:'-0.01em', marginBottom:10 }}>{p.name}</div>
        <div style={{ fontSize:13, color:C.textSec, lineHeight:1.72, marginBottom:22 }}>{p.desc}</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {p.features.map(f => (
            <div key={f} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:C.textSec }}>
              <div style={{ width:5, height:5, borderRadius:'50%', background:p.accent, flexShrink:0, boxShadow:`0 0 4px ${p.accent}` }}/>{f}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── SCENE 2: PLATFORM CARDS SECTION ───────────────────────────── */
function PlatformCards({ navigate }) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['center center', 'end start'],
  });
  const leftX  = useTransform(scrollYProgress, [0,1], [0, -50]);
  const rightX = useTransform(scrollYProgress, [0,1], [0,  50]);

  const platforms = [
    {
      id:'terminal', accent:C.gold, route:'/dashboard',
      label:'Market Intelligence Platform', name:'Planora Terminal',
      desc:'Institutional-grade analytics, live market data, risk modeling, and wealth planning tools — all in one terminal.',
      features:['Real-time Data','Risk Analysis','Planning Tools','Wealth Counsel'],
      icon:(
        <div style={{ width:44, height:44, background:C.gold, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 20px ${C.gold}40` }}>
          <span style={{ fontSize:22, fontWeight:900, color:'#0a0a0f' }}>P</span>
        </div>
      ),
    },
    {
      id:'nexus', accent:C.teal, route:'/nexus',
      label:'Advisor-Client Platform', name:'Nexus',
      desc:'Secure collaboration hub for advisors and clients with shared dashboards, messaging, and portfolio oversight.',
      features:['Client Portal','Workflow Center','Life Events','Secure Messaging'],
      icon:(
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <polygon points="22,2 42,12 42,32 22,42 2,32 2,12" fill="none" stroke={C.teal} strokeWidth="1.5"/>
          <polygon points="22,10 34,17 34,27 22,34 10,27 10,17" fill="none" stroke={C.teal} strokeWidth="1" opacity="0.4"/>
          <circle cx="22" cy="22" r="5" fill={C.teal}/>
          <circle cx="22" cy="22" r="9" fill="none" stroke={C.teal} strokeWidth="0.5" opacity="0.3"/>
        </svg>
      ),
    },
    {
      id:'fun', accent:C.indigo, route:'/fun',
      label:'Financial Education Network', name:'FUN',
      desc:'Interactive learning, calculators, and planning modules to empower clients at every stage of their journey.',
      features:['Education Modules','Calculators','Visual Guides','Assessments'],
      icon:(
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <circle cx="22" cy="22" r="21" stroke={C.indigo} strokeWidth="1.5" fill="none" opacity="0.6"/>
          <circle cx="22" cy="7"  r="5" fill={C.indigo}/>
          <circle cx="7"  cy="35" r="5" fill={C.indigo} opacity="0.8"/>
          <circle cx="37" cy="35" r="5" fill={C.indigo} opacity="0.8"/>
          <line x1="22" y1="12" x2="7"  y2="30" stroke={C.indigo} strokeWidth="1.5" opacity="0.6"/>
          <line x1="22" y1="12" x2="37" y2="30" stroke={C.indigo} strokeWidth="1.5" opacity="0.6"/>
          <line x1="7"  y1="35" x2="37" y2="35" stroke={C.indigo} strokeWidth="1.5" opacity="0.6"/>
        </svg>
      ),
    },
  ];

  // Entry variants: left slides from -60+rotate, center rises, right slides from +60+rotate
  const cardVariants = [
    { hidden:{ opacity:0, x:-60, rotate:-5 }, visible:{ opacity:1, x:0, rotate:0, transition:{ type:'spring', stiffness:100, damping:20 } } },
    { hidden:{ opacity:0, y:70 },             visible:{ opacity:1, y:0,            transition:{ type:'spring', stiffness:100, damping:20, delay:0.15 } } },
    { hidden:{ opacity:0, x:60, rotate:5 },  visible:{ opacity:1, x:0, rotate:0,  transition:{ type:'spring', stiffness:100, damping:20, delay:0.3 } } },
  ];

  return (
    <section ref={sectionRef} style={{ padding:'120px 0', background:C.bg, position:'relative', overflow:'hidden' }}>
      {/* Ambient orbs */}
      <div className="orb" style={{ width:500, height:500, background:`radial-gradient(circle, ${C.gold}07 0%, transparent 65%)`, top:'-10%', right:'-5%' }}/>
      <div className="orb" style={{ width:400, height:400, background:`radial-gradient(circle, ${C.teal}06 0%, transparent 65%)`, bottom:'-10%', left:'10%', animationDelay:'-12s' }}/>

      {/* Scene top gradient overlap */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:80, background:`linear-gradient(to bottom, ${C.bg}, transparent)`, pointerEvents:'none', zIndex:2 }}/>

      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 32px', position:'relative', zIndex:1 }}>
        {/* Eyebrow pill */}
        <motion.div
          initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, margin:'-60px' }} transition={{ duration:0.6 }}
          style={{ textAlign:'center', marginBottom:20 }}
        >
          <div style={{ display:'inline-flex', alignItems:'center', gap:10, background:`${C.gold}10`, border:`1px solid ${C.gold}25`, borderRadius:99, padding:'6px 18px' }}>
            <div style={{ width:5, height:5, borderRadius:'50%', background:C.gold, boxShadow:`0 0 8px ${C.gold}` }}/>
            <span style={{ fontSize:11, fontWeight:700, color:C.gold, letterSpacing:'0.16em', textTransform:'uppercase' }}>Three Platforms. One Ecosystem.</span>
          </div>
        </motion.div>

        {/* Character-by-character title */}
        <CharByChar
          text="Choose your command center."
          style={{ fontSize:36, fontWeight:800, color:C.text, letterSpacing:'-0.02em', marginBottom:56, justifyContent:'center' }}
        />

        {/* Cards with spread parallax */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once:true, margin:'-80px' }}
          style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:20 }}
        >
          <motion.div style={{ x: leftX }}>
            <PlatformCard p={platforms[0]} navigate={navigate} entryVariants={cardVariants[0]} />
          </motion.div>
          <PlatformCard p={platforms[1]} navigate={navigate} entryVariants={cardVariants[1]} />
          <motion.div style={{ x: rightX }}>
            <PlatformCard p={platforms[2]} navigate={navigate} entryVariants={cardVariants[2]} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── SCENE 3: FEATURE STRIP ─────────────────────────────────────── */
function FeatureStrip() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset:['start end', 'center center'] });
  const sectionScale = useTransform(scrollYProgress, [0,1], [0.95, 1]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.5], [0.5, 1]);

  const features = [
    { icon: Activity,  title:'Real-Time Intelligence',  desc:'Live markets, news, and macro insights',               delay:0     },
    { icon: BarChart2, title:'Advanced Risk Analysis',  desc:'Scenario modeling & Monte Carlo simulations',           delay:0.1   },
    { icon: Target,    title:'Portfolio Optimization',  desc:'Data-driven allocation & rebalancing tools',            delay:0.2   },
    { icon: Globe,     title:'Wealth Planning',         desc:'Cash flow, goals, estate & retirement',                 delay:0.3   },
    { icon: Users,     title:'Client Collaboration',    desc:'Dashboards, tasks & secure communication',              delay:0.4   },
    { icon: Lock,      title:'Secure by Design',        desc:'Bank-grade security & enterprise infrastructure',        delay:0.5   },
  ];

  return (
    <motion.section
      ref={sectionRef}
      style={{ scale: sectionScale, opacity: sectionOpacity, background:C.elevated, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:'52px 0', willChange:'transform, opacity' }}
    >
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 32px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:36 }}>
          <div style={{ flexShrink:0, minWidth:130 }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.14em', color:C.gold, textTransform:'uppercase', lineHeight:1.8 }}>BUILT FOR MODERN<br/>WEALTH MANAGERS</div>
          </div>
          <div style={{ width:1, height:50, background:C.border, flexShrink:0 }}/>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', flex:1 }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity:0, x:-30 }}
                  whileInView={{ opacity:1, x:0 }}
                  viewport={{ once:true, margin:'-40px' }}
                  transition={{ duration:0.55, delay:f.delay, ease:[0.22,1,0.36,1] }}
                  style={{ padding:'0 18px', borderLeft: i > 0 ? `1px solid ${C.border}` : 'none' }}
                >
                  {/* Icon — rotates on entry, subtle float after */}
                  <motion.div
                    initial={{ rotate:-180, scale:0.5 }}
                    whileInView={{ rotate:0, scale:1 }}
                    viewport={{ once:true }}
                    transition={{ type:'spring', stiffness:200, damping:16, delay:f.delay + 0.05 }}
                    style={{ marginBottom:10, display:'inline-block', animation:`featureFloat ${3.5 + i * 0.4}s ease-in-out infinite`, animationDelay:`${i * 0.5}s` }}
                  >
                    <Icon size={18} color={C.gold}/>
                  </motion.div>
                  <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:4, lineHeight:1.3 }}>{f.title}</div>
                  <div style={{ fontSize:11, color:C.textMuted, lineHeight:1.5 }}>{f.desc}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ─── SCENE 4: DASHBOARD PREVIEW ─────────────────────────────────── */
function DashboardPreview() {
  const navigate = useNavigate();
  const sectionRef  = useRef(null);
  const curtainRef  = useRef(null);
  const row1Ref     = useRef(null);
  const row2Ref     = useRef(null);

  // Curtain reveal
  const { scrollYProgress: curtainProg } = useScroll({ target: curtainRef, offset:['start end','start 25%'] });
  const curtainClip = useTransform(curtainProg, [0,1], ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']);

  // Row depth parallax
  const { scrollYProgress: row1Prog } = useScroll({ target: row1Ref, offset:['start end','end start'] });
  const { scrollYProgress: row2Prog } = useScroll({ target: row2Ref, offset:['start end','end start'] });
  const row1Y = useTransform(row1Prog, [0,1], [40, -40]);
  const row2Y = useTransform(row2Prog, [0,1], [60, -25]);

  const HoverCard = ({ children, delay = 0, accent = C.gold }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once:true, margin:'-60px' });
    const [hov, setHov] = useState(false);

    return (
      <motion.div
        ref={ref}
        initial={{ opacity:0, scale:0.88, y:30 }}
        animate={inView ? { opacity:1, scale:1, y:0 } : {}}
        transition={{ duration:0.65, delay, ease:[0.22,1,0.36,1] }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background:'rgba(17,19,24,0.92)', backdropFilter:'blur(12px)',
          border:`1px solid ${hov ? accent + '45' : C.border}`,
          borderRadius:14, padding:20, cursor:'default',
          boxShadow: hov ? `0 20px 48px rgba(0,0,0,0.45), 0 0 28px ${accent}12` : '0 4px 16px rgba(0,0,0,0.2)',
          transform: hov ? 'translateY(-6px) scale(1.015)' : 'none',
          transition:'border-color 0.2s, box-shadow 0.2s, transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <section ref={sectionRef} style={{ padding:'120px 0', background:C.bg, position:'relative', overflow:'hidden' }}>
      {/* Curtain-revealed atmospheric background */}
      <motion.div
        ref={curtainRef}
        style={{ clipPath: curtainClip, position:'absolute', inset:0, background:`radial-gradient(ellipse 80% 60% at 30% 50%, ${C.teal}06 0%, transparent 55%), radial-gradient(ellipse 60% 80% at 70% 30%, ${C.gold}05 0%, transparent 55%)`, pointerEvents:'none' }}
      />

      {/* Scene gradient at top */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:100, background:`linear-gradient(to bottom, ${C.elevated}, transparent)`, pointerEvents:'none', zIndex:1 }}/>

      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 32px', position:'relative', zIndex:2 }}>
        <motion.div
          initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, margin:'-60px' }} transition={{ duration:0.6 }}
          style={{ marginBottom:52 }}
        >
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.18em', color:C.textMuted, textTransform:'uppercase', marginBottom:14 }}>PLATFORM INTELLIGENCE</div>
          <CharByChar text="Every tool you need. All in one place." style={{ fontSize:36, fontWeight:800, color:C.text, letterSpacing:'-0.02em', marginBottom:14, justifyContent:'flex-start' }}/>
          <p style={{ fontSize:15, color:C.textSec, maxWidth:500, lineHeight:1.75 }}>Institutional-grade dashboards, research, and planning tools built for modern wealth management professionals.</p>
        </motion.div>

        {/* Row 1 — front row (100% scroll rate) */}
        <motion.div ref={row1Ref} style={{ y: row1Y, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14, marginBottom:14, willChange:'transform' }}>
          {/* Card 1 — Portfolio */}
          <HoverCard delay={0} accent={C.gold}>
            <div style={{ fontSize:8, fontWeight:700, letterSpacing:'0.14em', color:C.textMuted, textTransform:'uppercase', marginBottom:12 }}>PORTFOLIO ALLOCATION</div>
            <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:14 }}>
              <div style={{ width:80, height:80, flexShrink:0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={allocData} innerRadius={25} outerRadius={38} dataKey="value" strokeWidth={0}>{allocData.map((e,i) => <Cell key={i} fill={e.color}/>)}</Pie></PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:16, fontWeight:800, color:C.text, fontFamily:'monospace', marginBottom:2 }}>$28.7M</div>
                <div style={{ fontSize:10, color:C.textMuted, marginBottom:8 }}>Total Value</div>
                {allocData.map(a => (
                  <div key={a.name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:3 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                      <div style={{ width:6, height:6, borderRadius:2, background:a.color, flexShrink:0 }}/>
                      <span style={{ fontSize:9, color:C.textSec }}>{a.name}</span>
                    </div>
                    <span style={{ fontSize:9, color:C.text, fontFamily:'monospace' }}>{a.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:4 }}>Portfolio Intelligence</div>
            <div style={{ fontSize:11, color:C.textSec, lineHeight:1.6, marginBottom:10 }}>Deep visibility into performance, allocation, and risk across all accounts.</div>
            <span onClick={() => navigate('/RiskAnalysis')} style={{ fontSize:11, color:C.gold, fontWeight:700, display:'flex', alignItems:'center', gap:4, cursor:'pointer' }}>Learn more <ArrowRight size={11}/></span>
          </HoverCard>

          {/* Card 2 — Macro Outlook */}
          <HoverCard delay={0.08} accent={C.teal}>
            <div style={{ fontSize:8, fontWeight:700, letterSpacing:'0.14em', color:C.textMuted, textTransform:'uppercase', marginBottom:4 }}>MACRO OUTLOOK</div>
            <div style={{ fontSize:11, color:C.textSec, marginBottom:12 }}>Global GDP Growth Forecast</div>
            <div style={{ height:90, marginBottom:8 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gdpData} margin={{ top:4, right:4, left:-30, bottom:0 }}>
                  <Line type="monotone" dataKey="usa"   stroke={C.gold}   strokeWidth={1.5} dot={false}/>
                  <Line type="monotone" dataKey="eu"    stroke={C.teal}   strokeWidth={1.5} dot={false}/>
                  <Line type="monotone" dataKey="china" stroke={C.danger} strokeWidth={1.5} dot={false}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display:'flex', gap:12, marginBottom:12 }}>
              {[['USA',C.gold],['Europe',C.teal],['China',C.danger]].map(([l,c]) => (
                <div key={l} style={{ display:'flex', alignItems:'center', gap:5, fontSize:9, color:C.textSec }}>
                  <div style={{ width:12, height:2, background:c, borderRadius:1 }}/>{l}
                </div>
              ))}
            </div>
            <div style={{ fontSize:11, color:C.textSec, lineHeight:1.6, marginBottom:10 }}>Macro insights from global markets, economy, and policy trends.</div>
            <span onClick={() => navigate('/consumer')} style={{ fontSize:11, color:C.gold, fontWeight:700, display:'flex', alignItems:'center', gap:4, cursor:'pointer' }}>Learn more <ArrowRight size={11}/></span>
          </HoverCard>

          {/* Card 3 — Macro Research */}
          <HoverCard delay={0.16} accent={C.gold}>
            <div style={{ fontSize:8, fontWeight:700, letterSpacing:'0.14em', color:C.textMuted, textTransform:'uppercase', marginBottom:12 }}>MACRO RESEARCH</div>
            <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:14 }}>
              {[
                { label:'Fed Funds Rate', val:'4.25%', delta:'▼ -0.25%', color:C.success },
                { label:'CPI YoY',        val:'3.1%',  delta:'▼ -0.2%',  color:C.success },
                { label:'10Y Treasury',   val:'4.42%', delta:'▲ +0.08%', color:C.danger  },
                { label:'Unemployment',   val:'4.1%',  delta:'→ flat',   color:C.warning },
              ].map(r => (
                <div key={r.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 8px', background:C.elevated, borderRadius:6 }}>
                  <span style={{ fontSize:11, color:C.textSec }}>{r.label}</span>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ fontSize:10, color:r.color, fontFamily:'monospace' }}>{r.delta}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:C.text, fontFamily:'monospace' }}>{r.val}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize:11, color:C.textSec, lineHeight:1.6, marginBottom:10 }}>Actionable insights from global markets, economy, and policy trends.</div>
            <span onClick={() => navigate('/labor')} style={{ fontSize:11, color:C.gold, fontWeight:700, display:'flex', alignItems:'center', gap:4, cursor:'pointer' }}>Learn more <ArrowRight size={11}/></span>
          </HoverCard>
        </motion.div>

        {/* Row 2 — back row (85% scroll rate = slightly slower) */}
        <motion.div ref={row2Ref} style={{ y: row2Y, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14, willChange:'transform' }}>
          {/* Card 4 — Retirement */}
          <HoverCard delay={0.04} accent={C.success}>
            <div style={{ fontSize:8, fontWeight:700, letterSpacing:'0.14em', color:C.textMuted, textTransform:'uppercase', marginBottom:12 }}>RETIREMENT PLAN</div>
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:11, color:C.textSec, marginBottom:4 }}>Probability of Success</div>
              <div style={{ fontSize:40, fontWeight:900, color:C.success, fontFamily:'monospace', letterSpacing:'-0.03em', lineHeight:1 }}>92%</div>
            </div>
            <div style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <span style={{ fontSize:10, color:C.textMuted }}>Target: 85%</span>
                <span style={{ fontSize:10, color:C.success, fontWeight:700 }}>On Track</span>
              </div>
              <div style={{ height:5, background:C.elevated, borderRadius:99 }}>
                <div style={{ width:'92%', height:'100%', background:`linear-gradient(90deg, ${C.success}, #34d399)`, borderRadius:99, boxShadow:`0 0 8px ${C.success}50` }}/>
              </div>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderTop:`1px solid ${C.border}`, marginBottom:10 }}>
              <span style={{ fontSize:11, color:C.textMuted }}>Investable Assets</span>
              <span style={{ fontSize:12, fontWeight:700, color:C.text, fontFamily:'monospace' }}>$4,250,000</span>
            </div>
            <div style={{ fontSize:11, color:C.textSec, lineHeight:1.6, marginBottom:10 }}>Model your retirement with Monte Carlo simulation and 2026 contribution limits.</div>
            <span style={{ fontSize:11, color:C.textMuted, fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>Coming soon <ArrowRight size={11}/></span>
          </HoverCard>

          {/* Card 5 — Future Planning */}
          <HoverCard delay={0.12} accent={C.indigo}>
            <div style={{ fontSize:8, fontWeight:700, letterSpacing:'0.14em', color:C.textMuted, textTransform:'uppercase', marginBottom:12 }}>FUTURE PLANNING</div>
            <div style={{ height:80, marginBottom:10 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={fpData} margin={{ top:4, right:4, left:-30, bottom:0 }}>
                  <defs>
                    <linearGradient id="fp-g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.indigo} stopOpacity="0.3"/>
                      <stop offset="100%" stopColor={C.indigo} stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke={C.indigo} strokeWidth={1.5} fill="url(#fp-g)" dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:6 }}>Future Planning</div>
            <div style={{ fontSize:11, color:C.textSec, lineHeight:1.6, marginBottom:10 }}>Model your future with confidence using goals-based planning tools with real-time projections.</div>
            <span onClick={() => navigate('/FuturePlanning')} style={{ fontSize:11, color:C.gold, fontWeight:700, display:'flex', alignItems:'center', gap:4, cursor:'pointer' }}>Learn more <ArrowRight size={11}/></span>
          </HoverCard>

          {/* Card 6 — Client Engagement */}
          <HoverCard delay={0.2} accent={C.teal}>
            <div style={{ fontSize:8, fontWeight:700, letterSpacing:'0.14em', color:C.textMuted, textTransform:'uppercase', marginBottom:12 }}>CLIENT ENGAGEMENT</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:14 }}>
              <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
                <div style={{ width:24, height:24, borderRadius:'50%', background:`${C.gold}22`, border:`1px solid ${C.gold}40`, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:C.gold, fontWeight:700 }}>A</div>
                <div style={{ background:C.elevated, borderRadius:'8px 8px 8px 2px', padding:'7px 10px', flex:1 }}>
                  <div style={{ fontSize:9, color:C.gold, fontWeight:600, marginBottom:2 }}>Advisor · Today 10:30 AM</div>
                  <div style={{ fontSize:11, color:C.textSec }}>Market update and portfolio review is ready.</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'flex-start', flexDirection:'row-reverse' }}>
                <div style={{ width:24, height:24, borderRadius:'50%', background:`${C.teal}22`, border:`1px solid ${C.teal}40`, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:C.teal, fontWeight:700 }}>C</div>
                <div style={{ background:`${C.teal}12`, borderRadius:'8px 8px 2px 8px', padding:'7px 10px', flex:1 }}>
                  <div style={{ fontSize:9, color:C.teal, fontWeight:600, marginBottom:2 }}>Client · 10:32 AM</div>
                  <div style={{ fontSize:11, color:C.textSec }}>Great, thank you!</div>
                </div>
              </div>
            </div>
            <div style={{ fontSize:11, color:C.textSec, lineHeight:1.6, marginBottom:10 }}>Stronger relationships through transparency, communication, and proactive insights.</div>
            <span onClick={() => navigate('/nexus/client')} style={{ fontSize:11, color:C.gold, fontWeight:700, display:'flex', alignItems:'center', gap:4, cursor:'pointer' }}>Learn more <ArrowRight size={11}/></span>
          </HoverCard>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── SCENE 5: FOOTER ────────────────────────────────────────────── */
function Footer() {
  const [email, setEmail] = useState('');
  const cols = [
    { head:'Platform',  links:['Planora Terminal','Nexus','FUN','Integrations','Security'] },
    { head:'Solutions', links:['Wealth Management','Family Office','RIAs','Institutions','Trust & Estates'] },
    { head:'Research',  links:['Market Insights','Macro Outlook','Sector Analysis','Reports','Data Providers'] },
    { head:'Wealth',    links:['Portfolio Tools','Risk Analysis','Financial Planning','Retirement','Tax Planning'] },
    { head:'Education', links:['Courses','Calculators','Guides','Webinars','Resource Center'] },
    { head:'Company',   links:['About Us','Careers','Press','Partners','Contact'] },
  ];

  return (
    <motion.footer
      initial={{ opacity:0, y:60, scaleY:0.96 }}
      whileInView={{ opacity:1, y:0, scaleY:1 }}
      viewport={{ once:true, margin:'-5%' }}
      transition={{ duration:0.9, ease:[0.22,1,0.36,1] }}
      style={{ background:C.elevated, borderTop:`1px solid ${C.border}`, padding:'64px 0 30px', transformOrigin:'bottom', willChange:'transform, opacity' }}
    >
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 32px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'240px 1fr 280px', gap:48, marginBottom:52 }}>
          {/* Brand */}
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6, delay:0.1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ width:32, height:32, background:C.gold, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 16px ${C.gold}40` }}>
                <span style={{ fontSize:15, fontWeight:900, color:'#0a0a0f' }}>P</span>
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:C.text, letterSpacing:'0.04em' }}>PLANORA</div>
                <div style={{ fontSize:8, color:C.gold, letterSpacing:'0.1em', textTransform:'uppercase' }}>TERMINAL</div>
              </div>
            </div>
            <p style={{ fontSize:12, color:C.textMuted, lineHeight:1.75, marginBottom:20 }}>
              The unified ecosystem for institutional intelligence, advisor collaboration, and financial education.
            </p>
            <div style={{ display:'flex', gap:8 }}>
              {['in','tw','yt','⊕'].map(s => (
                <div key={s} style={{ width:30, height:30, borderRadius:7, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:C.textMuted, cursor:'pointer', transition:'border-color 0.15s, color 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=C.gold; e.currentTarget.style.color=C.gold; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.textMuted; }}
                >{s}</div>
              ))}
            </div>
          </motion.div>

          {/* Nav cols — stagger left to right */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:8 }}>
            {cols.map((col, ci) => (
              <motion.div key={col.head} initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5, delay:0.15 + ci * 0.06 }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', color:C.text, textTransform:'uppercase', marginBottom:14 }}>{col.head}</div>
                {col.links.map(l => (
                  <div key={l} style={{ fontSize:12, color:C.textMuted, marginBottom:9, cursor:'pointer', transition:'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = C.text}
                    onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
                  >{l}</div>
                ))}
              </motion.div>
            ))}
          </div>

          {/* Newsletter */}
          <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5, delay:0.55 }}>
            <div style={{ fontSize:16, fontWeight:800, color:C.text, marginBottom:8, letterSpacing:'-0.01em' }}>Stay ahead of the markets.</div>
            <div style={{ fontSize:12, color:C.textMuted, marginBottom:18, lineHeight:1.7 }}>Get insights, platform updates, and market intelligence weekly.</div>
            <div style={{ display:'flex' }}>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={{ flex:1, background:C.surface, border:`1px solid ${C.border}`, borderRight:'none', borderRadius:'8px 0 0 8px', padding:'11px 14px', fontSize:12, color:C.text, outline:'none', fontFamily:'inherit', transition:'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor=`${C.gold}60`}
                onBlur={e  => e.target.style.borderColor=C.border}
              />
              <button style={{ background:C.gold, color:'#0a0a0f', border:'none', borderRadius:'0 8px 8px 0', padding:'11px 18px', fontSize:12, fontWeight:800, cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit', boxShadow:`0 0 16px ${C.gold}40`, transition:'box-shadow 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow=`0 0 28px ${C.gold}60`}
                onMouseLeave={e => e.currentTarget.style.boxShadow=`0 0 16px ${C.gold}40`}
              >Subscribe</button>
            </div>
          </motion.div>
        </div>

        <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:24, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontSize:11, color:C.textMuted }}>© 2026 Planora Technologies, Inc. All rights reserved.</div>
          <div style={{ display:'flex', gap:20 }}>
            {['Privacy Policy','Terms of Service','Disclosure','Sitemap'].map(l => (
              <span key={l} style={{ fontSize:11, color:C.textMuted, cursor:'pointer', transition:'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = C.text}
                onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
              >{l}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

/* ─── LANDING — MAIN ORCHESTRATOR ────────────────────────────────── */
export default function Landing() {
  const navigate    = useNavigate();
  const heroRef     = useRef(null);
  const [bootDone, setBootDone] = useState(() => sessionStorage.getItem('planora_booted') === '1');

  // Global scroll Y
  const { scrollY } = useScroll();

  // Hero section scroll progress (0 = at top, 1 = hero fully scrolled out)
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // ── 5-layer parallax ──────────────────────────────────────────────
  // Layer 1 (particles — deepest): compensate 80% → stays most behind
  const layer1Y = useTransform(heroProgress, [0,1], [0, 120]);
  // Layer 2 (orbs): compensate 65%
  const layer2Y = useTransform(heroProgress, [0,1], [0, 80]);
  // Layer 3 (dashboard): compensate 40%
  const layer3Y = useTransform(heroProgress, [0,1], [0, 50]);
  // Layer 4 (text): compensate 15%
  const layer4Y = useTransform(heroProgress, [0,1], [0, 20]);
  // Layer 5 (grid — foreground): slightly ahead of scroll
  const layer5Y = useTransform(heroProgress, [0,1], [0, -20]);

  // Background zoom: 1.0 → 1.15 over first 30% of hero scroll
  const bgScale = useTransform(heroProgress, [0, 0.3], [1, 1.15]);

  // Dashboard exit — scale + fade as user scrolls hero
  const dashOpacity = useTransform(heroProgress, [0.25, 0.65], [1, 0]);
  const dashScale   = useTransform(heroProgress, [0, 0.65], [1, 0.88]);

  // ── Mouse parallax for dashboard tilt ────────────────────────────
  const mouseXVal = useMotionValue(0);
  const mouseYVal = useMotionValue(0);
  const springX   = useSpring(mouseXVal, { stiffness:80, damping:20 });
  const springY   = useSpring(mouseYVal, { stiffness:80, damping:20 });
  const dashRotateX = useTransform(springY, [-1,1], [4, -4]);
  const dashRotateY = useTransform(springX, [-1,1], [-8, 8]);

  const handleHeroMouse = useCallback((e) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseXVal.set((e.clientX - rect.left) / rect.width  * 2 - 1);
    mouseYVal.set((e.clientY - rect.top)  / rect.height * 2 - 1);
  }, [mouseXVal, mouseYVal]);

  const handleBootComplete = useCallback(() => {
    sessionStorage.setItem('planora_booted', '1');
    setBootDone(true);
  }, []);

  const trust = [
    { icon: <Activity size={12} color={C.gold}/>, label:'Live Market Data'       },
    { icon: <Shield   size={12} color={C.gold}/>, label:'Bank-Grade Security'    },
    { icon: <Users    size={12} color={C.gold}/>, label:'Advisor & Client Tools' },
    { icon: <BookOpen size={12} color={C.gold}/>, label:'Education & Planning'   },
  ];

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Inter', -apple-system, sans-serif", color:C.text, overflowX:'hidden' }}>
      <style>{GLOBAL_CSS}</style>

      {!bootDone && <BootOverlay onComplete={handleBootComplete}/>}

      <Nav onEnter={() => navigate('/dashboard')} visible={bootDone} scrollY={scrollY}/>

      {/* ══ SCENE 1 — HERO ══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouse}
        style={{ height:'100vh', position:'relative', overflow:'hidden', display:'flex', alignItems:'center' }}
      >
        {/* Layer 1 — Particles (deepest, slowest) */}
        <motion.div style={{ position:'absolute', inset:0, y:layer1Y, zIndex:0 }}>
          <ParticleCanvas count={280}/>
        </motion.div>

        {/* Layer 0 — Zooming background */}
        <motion.div style={{ position:'absolute', inset:'-8%', scale:bgScale, zIndex:0, background:`radial-gradient(ellipse 70% 60% at 60% 40%, ${C.gold}07 0%, transparent 55%), radial-gradient(ellipse 50% 70% at 80% 70%, ${C.teal}06 0%, transparent 55%), ${C.bg}` }}/>

        {/* Layer 2 — Ambient orbs */}
        <motion.div style={{ position:'absolute', inset:0, y:layer2Y, zIndex:1, pointerEvents:'none' }}>
          <div className="orb" style={{ width:700, height:700, background:`radial-gradient(circle, ${C.gold}08 0%, transparent 60%)`, top:'-15%', right:'18%' }}/>
          <div className="orb" style={{ width:500, height:500, background:`radial-gradient(circle, ${C.teal}07 0%, transparent 60%)`, bottom:'-12%', left:'28%', animationDelay:'-15s' }}/>
        </motion.div>

        {/* Layer 5 — Grid (foreground, slightly faster) */}
        <motion.div style={{ position:'absolute', inset:0, y:layer5Y, zIndex:1, pointerEvents:'none', backgroundImage:`linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)`, backgroundSize:'56px 56px' }}/>

        {/* Layer 4 — Hero text content */}
        <motion.div style={{ position:'relative', y:layer4Y, zIndex:3, width:'100%' }}>
          <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 32px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1.1fr', gap:72, alignItems:'center' }}>

              {/* Left — headline + CTAs */}
              <motion.div
                initial="hidden"
                animate={bootDone ? 'show' : 'hidden'}
                variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.12, delayChildren:0.1 } } }}
              >
                {/* Eyebrow */}
                <motion.div
                  variants={{ hidden:{ opacity:0, x:-24 }, show:{ opacity:1, x:0, transition:{ duration:0.65, ease:[0.22,1,0.36,1] } } }}
                  style={{ display:'inline-flex', alignItems:'center', gap:8, background:`${C.gold}12`, border:`1px solid ${C.gold}30`, borderRadius:100, padding:'6px 16px', marginBottom:28 }}
                >
                  <div style={{ width:5, height:5, borderRadius:'50%', background:C.gold, boxShadow:`0 0 8px ${C.gold}` }}/>
                  <span style={{ fontSize:11, fontWeight:700, color:C.gold, letterSpacing:'0.1em', textTransform:'uppercase' }}>Three Platforms. One Ecosystem.</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  variants={{ hidden:{ opacity:0, y:40 }, show:{ opacity:1, y:0, transition:{ type:'spring', stiffness:120, damping:20 } } }}
                  style={{ fontSize:56, fontWeight:900, letterSpacing:'-0.035em', color:C.text, lineHeight:1.08, marginBottom:22 }}
                >
                  The Future of<br/>
                  Wealth Management,<br/>
                  <span style={{ color:C.gold, textShadow:`0 0 40px ${C.gold}40` }}>Unified.</span>
                </motion.h1>

                {/* Subheading */}
                <motion.p
                  variants={{ hidden:{ opacity:0, y:24 }, show:{ opacity:1, y:0, transition:{ duration:0.7, ease:[0.22,1,0.36,1] } } }}
                  style={{ fontSize:16, color:C.textSec, lineHeight:1.78, maxWidth:460, marginBottom:38 }}
                >
                  Planora unifies institutional-grade market intelligence, advisor collaboration, and financial education in one connected ecosystem built for the next generation of wealth management.
                </motion.p>

                {/* CTAs */}
                <motion.div
                  variants={{ hidden:{ opacity:0, y:18, scale:0.95 }, show:{ opacity:1, y:0, scale:1, transition:{ type:'spring', stiffness:200, damping:20 } } }}
                  style={{ display:'flex', gap:14, marginBottom:48 }}
                >
                  <button
                    onClick={() => navigate('/dashboard')}
                    style={{ background:C.gold, color:'#0a0a0f', border:'none', borderRadius:11, padding:'15px 30px', fontSize:14, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', gap:8, fontFamily:'inherit', boxShadow:`0 0 32px ${C.gold}40, inset 0 1px 1px rgba(255,255,255,0.25)`, letterSpacing:'0.01em', transition:'transform 0.15s, box-shadow 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 0 52px ${C.gold}65, inset 0 1px 1px rgba(255,255,255,0.25)`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow=`0 0 32px ${C.gold}40, inset 0 1px 1px rgba(255,255,255,0.25)`; }}
                  >Enter Platform <ArrowRight size={15}/></button>
                  <button
                    onClick={() => navigate('/fun')}
                    style={{ background:'rgba(255,255,255,0.04)', backdropFilter:'blur(8px)', color:C.text, border:`1px solid ${C.border}`, borderRadius:11, padding:'15px 30px', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'border-color 0.2s, background 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor=`${C.teal}60`; e.currentTarget.style.boxShadow=`0 0 20px ${C.teal}20`; e.currentTarget.style.background=`rgba(0,180,198,0.06)`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}
                  >Explore Solutions</button>
                </motion.div>

                {/* Trust badges */}
                <motion.div
                  variants={{ hidden:{ opacity:0 }, show:{ opacity:1, transition:{ duration:0.6, delay:0.1 } } }}
                  style={{ display:'flex', gap:0, borderTop:`1px solid ${C.border}`, paddingTop:24 }}
                >
                  {trust.map((b,i) => (
                    <div key={b.label} style={{ display:'flex', alignItems:'center', gap:6, paddingRight:18, marginRight:18, borderRight: i < 3 ? `1px solid ${C.border}` : 'none' }}>
                      {b.icon}
                      <span style={{ fontSize:11, color:C.textSec, whiteSpace:'nowrap' }}>{b.label}</span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right — empty column placeholder so grid aligns */}
              <div/>
            </div>
          </div>
        </motion.div>

        {/* Layer 3 — Dashboard (mid-depth, exits as hero scrolls) */}
        <motion.div
          style={{ position:'absolute', right:'4%', top:'50%', translateY:'-50%', y:layer3Y, zIndex:2, opacity:dashOpacity, scale:dashScale, willChange:'transform, opacity' }}
        >
          <HeroDashboard rotateX={dashRotateX} rotateY={dashRotateY} opacity={dashOpacity} scale={dashScale}/>
        </motion.div>

        {/* Scene bottom fade */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:130, background:`linear-gradient(to bottom, transparent, ${C.bg})`, pointerEvents:'none', zIndex:5 }}/>
      </section>

      {/* ══ SCENE 2 — THREE PLATFORMS ═══════════════════════════════ */}
      <PlatformCards navigate={navigate}/>

      {/* Scene transition */}
      <div style={{ height:1, background:C.border }}/>

      {/* ══ SCENE 3 — FEATURE STRIP ═════════════════════════════════ */}
      <FeatureStrip/>

      {/* Scene transition gradient */}
      <div style={{ height:60, background:`linear-gradient(to bottom, ${C.elevated}, ${C.bg})` }}/>

      {/* ══ SCENE 4 — DASHBOARD PREVIEW ═════════════════════════════ */}
      <DashboardPreview/>

      {/* ══ SCENE 5 — FOOTER ════════════════════════════════════════ */}
      <Footer/>
    </div>
  );
}
