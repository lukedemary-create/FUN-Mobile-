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

export default function Terms() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif", color: C.text }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px' }}>

        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 13, marginBottom: 40, padding: 0 }}>
          <ArrowLeft size={15}/> Back
        </button>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: C.gold, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Legal</div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: C.text, margin: 0, marginBottom: 8 }}>Terms of Service</h1>
          <p style={{ color: C.textMuted, fontSize: 13 }}>Last updated: May 2026</p>
        </div>

        <div style={{ background: 'rgba(201,169,110,0.07)', border: `1px solid rgba(201,169,110,0.25)`, borderRadius: 10, padding: '16px 20px', marginBottom: 40 }}>
          <p style={{ margin: 0, fontSize: 13, color: '#a89070', lineHeight: 1.7 }}>
            <strong style={{ color: '#c9a96e' }}>IMPORTANT DISCLAIMER:</strong> Planora is an educational and informational platform only. Nothing on this platform constitutes financial, investment, legal, or tax advice. All market data, analyses, projections, and AI-generated content are for informational purposes only. Past performance does not guarantee future results. Always consult a licensed financial advisor, attorney, or tax professional before making any financial decisions.
          </p>
        </div>

        <Section title="Acceptance of Terms">
          <p>By accessing or using Planora ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform. We reserve the right to update these terms at any time.</p>
        </Section>

        <Section title="Description of Service">
          <p>Planora is a financial education and market intelligence platform that provides:</p>
          <ul style={{ paddingLeft: 20, margin: '12px 0' }}>
            <li style={{ marginBottom: 6 }}>Market data and economic indicators for educational purposes</li>
            <li style={{ marginBottom: 6 }}>Financial planning tools and calculators</li>
            <li style={{ marginBottom: 6 }}>AI-powered conversational features</li>
            <li style={{ marginBottom: 6 }}>Educational content about financial topics</li>
            <li>Risk analysis and portfolio modeling tools</li>
          </ul>
        </Section>

        <Section title="Not Financial Advice">
          <p style={{ marginBottom: 12 }}>Planora is NOT a registered investment advisor, broker-dealer, financial planner, or fiduciary. The platform does NOT provide personalized investment advice, recommendations to buy or sell specific securities, or any form of financial planning services regulated by the SEC, FINRA, or any other regulatory body.</p>
          <p>All content, tools, data, projections, and AI responses are provided for educational and informational purposes only and should not be relied upon for making investment or financial decisions.</p>
        </Section>

        <Section title="Data Accuracy">
          <p>Market data, economic statistics, and financial information displayed on Planora are sourced from third-party providers and are provided "as is" without warranty of accuracy, completeness, or timeliness. Planora makes no representations regarding the accuracy of any data displayed. You should verify all information independently before relying on it.</p>
        </Section>

        <Section title="Acceptable Use">
          <p style={{ marginBottom: 12 }}>You agree NOT to:</p>
          <ul style={{ paddingLeft: 20, margin: '0 0 12px' }}>
            <li style={{ marginBottom: 6 }}>Use the Platform for any unlawful purpose</li>
            <li style={{ marginBottom: 6 }}>Attempt to reverse engineer, scrape, or copy the Platform</li>
            <li style={{ marginBottom: 6 }}>Overload or disrupt the Platform's infrastructure</li>
            <li style={{ marginBottom: 6 }}>Use automated bots or scripts to access the Platform</li>
            <li>Misrepresent Planora data or content as professional financial advice</li>
          </ul>
        </Section>

        <Section title="AI Features">
          <p>The AI-powered features on Planora are powered by Anthropic's Claude. AI responses are generated automatically and may contain errors, outdated information, or inaccuracies. Do not rely on AI responses for financial decisions. AI conversations are not stored or reviewed by Planora staff.</p>
        </Section>

        <Section title="Limitation of Liability">
          <p>To the maximum extent permitted by law, Planora Technologies shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of the Platform, including but not limited to investment losses, data inaccuracies, or service interruptions. Your use of the Platform is entirely at your own risk.</p>
        </Section>

        <Section title="Intellectual Property">
          <p>All content, design, code, and branding on Planora is the property of Planora Technologies and is protected by applicable copyright and trademark laws. You may not reproduce, distribute, or create derivative works without our express written permission.</p>
        </Section>

        <Section title="Termination">
          <p>We reserve the right to suspend or terminate access to the Platform at any time, for any reason, without notice. We may also modify or discontinue any features of the Platform at our discretion.</p>
        </Section>

        <Section title="Governing Law">
          <p>These Terms shall be governed by the laws of the United States. Any disputes arising from these Terms or your use of the Platform shall be resolved through binding arbitration in accordance with applicable law.</p>
        </Section>

        <Section title="Contact">
          <p>For questions about these Terms, contact us at <span style={{ color: C.gold }}>legal@planora.com</span>.</p>
        </Section>

        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, marginTop: 48, display: 'flex', gap: 24 }}>
          <span style={{ fontSize: 12, color: C.textMuted, cursor: 'pointer' }} onClick={() => navigate('/privacy')}>Privacy Policy →</span>
          <span style={{ fontSize: 12, color: C.textMuted, cursor: 'pointer' }} onClick={() => navigate('/')}>Back to Planora →</span>
        </div>
      </div>
    </div>
  );
}
