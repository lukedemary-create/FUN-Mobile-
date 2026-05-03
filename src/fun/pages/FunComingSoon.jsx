import { useNavigate } from 'react-router-dom';
import {
  Wallet, CreditCard, TrendingUp, Shield, ScrollText,
  Clock, Home, Calendar, Calculator, BookOpen, ArrowRight, Sparkles,
} from 'lucide-react';

const TEAL = '#00B4C6';
const NAVY = '#0A1F44';

const ICON_MAP = { Wallet, CreditCard, TrendingUp, Shield, ScrollText, Clock, Home, Calendar, Calculator, BookOpen };

const PREVIEWS = {
  'Budgeting & Financial Foundations': [
    'Interactive 50/30/20 budget builder with live surplus/deficit tracking',
    'Emergency fund calculator — how many months, where to keep it',
    'Savings rate calculator and debt-to-income ratio explainer',
    'Visual paycheck anatomy: gross vs net income breakdown',
  ],
  'Debt & Credit': [
    'Debt avalanche vs snowball animated side-by-side comparison',
    'Credit score visual breakdown of all 5 FICO factors',
    'Debt payoff calculator with avalanche and snowball timelines',
    'Student loan explainer: federal vs private, IBR, PSLF',
  ],
  'Investing & Accounts': [
    'Account comparison: IRA, Roth IRA, 401(k), HSA, 529, Brokerage',
    '"Which account should I fund first?" — waterfall decision tree',
    'Compound interest calculator with animated growth chart',
    'Risk tolerance quiz with suggested asset allocation',
  ],
  'Insurance Planning': [
    'Life insurance needs calculator using the DIME method',
    'Term vs Whole vs Universal visual comparison',
    'Health plan anatomy: deductible, copay, coinsurance, OOP max',
    'LTC cost estimator by care type with national average data',
  ],
  'Estate Planning & Wills': [
    'Intestate succession flowchart: what happens without a will',
    'Trust types explained: revocable, irrevocable, SNT, CRT, GRAT',
    'Probate vs trust — animated side-by-side comparison',
    'Estate tax calculator and gift tax annual exclusion explainer',
  ],
  'Retirement Planning': [
    'Retirement readiness calculator with projected monthly income',
    'Social Security: claim at 62 vs 67 vs 70 animated comparison',
    '4% rule / safe withdrawal rate interactive calculator',
    'Medicare Parts A, B, C, D visual breakdown',
  ],
  'Major Purchases & Goal Funding': [
    'Home affordability calculator with PMI and 15 vs 30-year comparison',
    '529 education savings calculator with growth projections',
    'Sinking fund planner — goal, timeline, monthly savings needed',
    'Car affordability calculator using the 20/4/10 rule',
  ],
  'Life Events Planning': [
    'Interactive life event selector: marriage, child, job change, divorce',
    'Each event triggers a visual checklist across all planning categories',
    'Personalized action steps for inheritance, retirement, and more',
    'Cross-category impact mapping for every major life transition',
  ],
  'Calculator Hub': [
    '25+ calculators spanning all financial planning categories',
    'Real-time reactive updates as you type or drag sliders',
    'Visual charts (bar, line, pie) for every calculator result',
    'Searchable and filterable by category',
  ],
  'Resource Directory': [
    'Curated providers organized by category with short descriptions',
    'Badge labels: Best for beginners, Low cost, High net worth',
    '"How to choose" guide for each category of provider',
    'Direct links to Vanguard, Fidelity, Policygenius, Trust & Will, and more',
  ],
};

export default function FunComingSoon({ section, icon, next, nextPath }) {
  const navigate  = useNavigate();
  const Icon      = ICON_MAP[icon] || Sparkles;
  const previews  = PREVIEWS[section] || [];

  return (
    <div style={{
      minHeight: '100vh',
      padding: '3rem 2.5rem',
      fontFamily: "'DM Sans', sans-serif",
      maxWidth: 780,
      margin: '0 auto',
    }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: 6 }}>
        <button onClick={() => navigate('/fun')} style={{ background:'none', border:'none', cursor:'pointer', color:'#00B4C6', fontSize:'0.75rem', fontFamily:"'DM Sans',sans-serif", padding:0 }}>
          Dashboard
        </button>
        <span>/</span>
        <span>{section}</span>
      </div>

      {/* Icon + Title */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.75rem' }}>
        <div style={{
          width: 60, height: 60,
          background: 'linear-gradient(135deg, rgba(0,180,198,0.15), rgba(91,200,226,0.08))',
          border: '1px solid rgba(0,180,198,0.25)',
          borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={26} color={TEAL}/>
        </div>
        <div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.875rem',
            fontWeight: 700,
            color: NAVY,
            margin: '0 0 0.375rem',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}>{section}</h1>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 12px',
            background: 'rgba(0,180,198,0.08)',
            border: '1px solid rgba(0,180,198,0.2)',
            borderRadius: 100,
            fontSize: '0.75rem',
            fontWeight: 600,
            color: TEAL,
            letterSpacing: '0.04em',
          }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:TEAL, animation:'funPulse 1.8s ease infinite' }}/>
            Building now
          </div>
        </div>
      </div>

      {/* Description */}
      <p style={{
        fontSize: '1rem',
        color: '#4b5563',
        lineHeight: 1.75,
        margin: '0 0 2rem',
        maxWidth: 640,
      }}>
        This section is under active development. We're building institutional-quality educational content, interactive calculators, visual explainers, and curated resources — designed to match the quality bar of JP Morgan or BlackRock wealth management materials.
      </p>

      {/* What's coming */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 16,
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      }}>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1rem',
          fontWeight: 700,
          color: NAVY,
          margin: '0 0 1rem',
        }}>What's coming in this section</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {previews.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{
                width: 20, height: 20,
                background: 'rgba(0,180,198,0.1)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                marginTop: 1,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: TEAL }}/>
              </div>
              <span style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigate to next section */}
      {next && (
        <div
          onClick={() => navigate(`/fun/${nextPath}`)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            background: NAVY,
            borderRadius: 12,
            cursor: 'pointer',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.45)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>Next section</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 600, color: '#fff' }}>{next}</div>
          </div>
          <ArrowRight size={18} color={TEAL}/>
        </div>
      )}

      <style>{`@keyframes funPulse { 0%,100%{opacity:1} 50%{opacity:0.35} }`}</style>
    </div>
  );
}
