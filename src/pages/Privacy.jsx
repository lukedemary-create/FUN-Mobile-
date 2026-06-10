import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const C = {
  bg: '#1a1410', surface: '#231c16', border: '#2a2018',
  text: '#f0e8d8', textSec: '#a89070', textMuted: '#6b5540', gold: '#c9a96e',
};

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 36 }}>
    <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 12, borderBottom: `1px solid rgba(201,169,110,0.25)`, paddingBottom: 10 }}>{title}</h2>
    <div style={{ fontSize: 14, color: C.textSec, lineHeight: 1.8 }}>{children}</div>
  </div>
);

export default function Privacy() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif", color: C.text }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px' }}>

        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 13, marginBottom: 40, padding: 0 }}>
          <ArrowLeft size={15}/> Back
        </button>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: C.gold, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Legal</div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: C.text, margin: 0, marginBottom: 8 }}>Privacy Policy</h1>
          <p style={{ color: C.textMuted, fontSize: 13 }}>Last updated: May 2026</p>
        </div>

        <Section title="Overview">
          <p>Planora Technologies ("Planora", "we", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard information when you use our platform at planora.com and related services.</p>
        </Section>

        <Section title="Information We Collect">
          <p style={{ marginBottom: 12 }}><strong style={{ color: C.text }}>Information you provide:</strong> We do not currently require account registration. Any information you enter into planning tools (budgets, goals, financial figures) is stored locally in your browser and is not transmitted to our servers.</p>
          <p style={{ marginBottom: 12 }}><strong style={{ color: C.text }}>Usage data:</strong> We may collect anonymous usage data such as pages visited, features used, and general geographic region to improve the platform. This data does not identify you personally.</p>
          <p><strong style={{ color: C.text }}>Cookies:</strong> We use essential cookies to remember your preferences (such as dismissing notices). We do not use advertising cookies or sell data to third parties.</p>
        </Section>

        <Section title="How We Use Your Information">
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            <li style={{ marginBottom: 8 }}>To provide and improve the Planora platform</li>
            <li style={{ marginBottom: 8 }}>To understand how features are used and fix issues</li>
            <li style={{ marginBottom: 8 }}>To communicate product updates (only if you opt in)</li>
            <li>We do NOT sell, rent, or share your personal data with third parties for marketing purposes</li>
          </ul>
        </Section>

        <Section title="Third-Party Services">
          <p>Planora connects to third-party data providers to display market information:</p>
          <ul style={{ paddingLeft: 20, margin: '12px 0' }}>
            <li style={{ marginBottom: 6 }}>Federal Reserve (FRED) — economic data</li>
            <li style={{ marginBottom: 6 }}>U.S. Bureau of Labor Statistics — labor data</li>
            <li style={{ marginBottom: 6 }}>U.S. Energy Information Administration — energy data</li>
            <li style={{ marginBottom: 6 }}>Yahoo Finance — market quotes and historical data</li>
            <li>Anthropic Claude AI — conversational AI features</li>
          </ul>
          <p style={{ marginTop: 12 }}>These services have their own privacy policies. We encourage you to review them.</p>
        </Section>

        <Section title="Data Security">
          <p>All connections to Planora are encrypted via HTTPS. We do not store sensitive financial information such as bank account numbers, Social Security numbers, or investment account credentials. All planning tool data remains in your browser's local storage.</p>
        </Section>

        <Section title="Your Rights">
          <p>You may clear your locally stored data at any time by clearing your browser's local storage. Since we do not maintain user accounts or store personal data on our servers, there is no account data to request or delete. For any privacy concerns, contact us at privacy@planora.com.</p>
        </Section>

        <Section title="Children's Privacy">
          <p>Planora is not directed to individuals under the age of 18. We do not knowingly collect personal information from minors. If you believe a minor has provided us information, please contact us immediately.</p>
        </Section>

        <Section title="Changes to This Policy">
          <p>We may update this Privacy Policy periodically. We will post the updated policy on this page with a revised "last updated" date. Continued use of the platform after changes constitutes acceptance of the updated policy.</p>
        </Section>

        <Section title="Contact">
          <p>For privacy-related questions or concerns, please contact us at <span style={{ color: C.gold }}>privacy@planora.com</span>.</p>
        </Section>

        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, marginTop: 48, display: 'flex', gap: 24 }}>
          <span style={{ fontSize: 12, color: C.textMuted, cursor: 'pointer' }} onClick={() => navigate('/terms')}>Terms of Service →</span>
          <span style={{ fontSize: 12, color: C.textMuted, cursor: 'pointer' }} onClick={() => navigate('/')}>Back to Planora →</span>
        </div>
      </div>
    </div>
  );
}
