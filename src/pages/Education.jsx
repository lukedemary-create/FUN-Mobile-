import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EDUCATION_CONTENT } from '../data/educationContent';
import { GraduationCap, BookOpen, PiggyBank, Receipt, BarChart2 } from 'lucide-react';

/* ─── Progress helpers ───────────────────────────────────────────── */
const getProgress = (topicId) => {
  try {
    return JSON.parse(localStorage.getItem(`planora-edu-${topicId}`) || '{}');
  } catch {
    return {};
  }
};

/* ─── Topic Card ─────────────────────────────────────────────────── */
function TopicCard({ topic, onClick }) {
  const progress = getProgress(topic.id);
  const totalChapters = topic.chapters?.length ?? 0;
  const completedCount = Object.values(progress).filter((v) => v?.completed).length;
  const pct = totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0;
  const hasStarted = completedCount > 0;

  return (
    <div
      className="t-card t-card-hover"
      onClick={onClick}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.875rem',
        padding: '1.25rem',
      }}
    >
      {/* Icon circle */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: `${topic.color}26`,
            border: `1px solid ${topic.color}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.375rem',
            flexShrink: 0,
          }}
        >
          {topic.icon}
        </div>
        {completedCount === totalChapters && totalChapters > 0 && (
          <span
            style={{
              fontSize: '0.625rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--up)',
              background: 'rgba(0,184,153,0.1)',
              border: '1px solid rgba(0,184,153,0.2)',
              borderRadius: '4px',
              padding: '2px 7px',
            }}
          >
            COMPLETE
          </span>
        )}
      </div>

      {/* Title + description */}
      <div>
        <div
          style={{
            fontWeight: 700,
            fontSize: '1rem',
            color: 'var(--text-1)',
            marginBottom: '0.375rem',
            lineHeight: 1.3,
          }}
        >
          {topic.title}
        </div>
        <div
          style={{
            fontSize: '0.8125rem',
            color: 'var(--text-2)',
            lineHeight: 1.55,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {topic.description}
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div
          style={{
            height: 3,
            borderRadius: 99,
            background: 'var(--border-c)',
            overflow: 'hidden',
            marginBottom: '0.5rem',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${pct}%`,
              borderRadius: 99,
              background: pct === 100 ? 'var(--up)' : 'var(--gold)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--text-2)' }}>
            {completedCount} of {totalChapters} chapters
          </span>
          <button
            className="t-btn t-btn-gold t-btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            style={{ fontSize: '0.6875rem', letterSpacing: '0.06em' }}
          >
            {hasStarted && completedCount < totalChapters
              ? 'CONTINUE →'
              : completedCount === totalChapters && totalChapters > 0
              ? 'REVIEW →'
              : 'START →'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Stat Card ──────────────────────────────────────────────────── */
function StatCard({ value, label }) {
  return (
    <div className="t-card t-card-p" style={{ textAlign: 'center' }}>
      <div
        className="t-mono"
        style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          color: 'var(--gold)',
          lineHeight: 1.1,
          marginBottom: '0.25rem',
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: '0.6875rem', color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
        {label}
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
export default function Education() {
  const navigate = useNavigate();
  const topics = Object.values(EDUCATION_CONTENT);

  // Force re-render when localStorage changes (e.g., returning from a topic)
  const [, setTick] = useState(0);
  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener('focus', handler);
    return () => window.removeEventListener('focus', handler);
  }, []);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border-c)",
        borderRadius: 16,
        padding: "1.75rem 2rem",
        marginBottom: "1.25rem",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -60, right: -40,
          width: 320, height: 320,
          background: "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", position: "relative" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.625rem" }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <GraduationCap size={14} style={{ color: "var(--gold)" }} />
              </div>
              <h1 className="t-page-title" style={{ margin: 0 }}>FINANCIAL EDUCATION</h1>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.65, maxWidth: 560, margin: "0 0 1rem" }}>
              Build real financial literacy from the ground up. Structured lessons covering investing, retirement, taxes, and market fundamentals — written for clarity, not complexity.
            </p>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              {["Beginner to Advanced", "6 Core Topics", "Structured Learning", "Free Access"].map((label) => (
                <span key={label} style={{
                  fontSize: "0.6875rem", fontWeight: 700, padding: "3px 10px",
                  borderRadius: 99, letterSpacing: "0.04em",
                  background: "rgba(201,168,76,0.10)",
                  border: "1px solid rgba(201,168,76,0.25)",
                  color: "var(--gold)",
                }}>{label}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", flexShrink: 0 }}>
            {[
              { icon: BookOpen, label: "Investing Basics", sub: "Stocks, bonds & funds", color: "#3b82f6" },
              { icon: PiggyBank, label: "Retirement Planning", sub: "401K, IRA & Roth", color: "var(--gold)" },
              { icon: Receipt, label: "Tax Strategy", sub: "Reduce your tax burden", color: "var(--teal)" },
              { icon: BarChart2, label: "Market Fundamentals", sub: "How markets really work", color: "#f59e0b" },
            ].map(({ icon: Icon, label, sub, color }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: "0.625rem",
                padding: "0.625rem 0.875rem",
                background: "var(--bg)", border: "1px solid var(--border-c)",
                borderRadius: 10, minWidth: 170,
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  background: `color-mix(in srgb, ${color} 14%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={14} style={{ color }} />
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-1)", lineHeight: 1 }}>{label}</div>
                  <div style={{ fontSize: "0.625rem", color: "var(--text-3)", marginTop: 2, lineHeight: 1.3 }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.75rem',
          marginBottom: '2rem',
        }}
      >
        <StatCard value="6"   label="Topics" />
        <StatCard value="68"  label="Chapters" />
        <StatCard value="340" label="Quiz Questions" />
        <StatCard value="44"  label="Book Recommendations" />
      </div>

      {/* ── Topic grid ── */}
      <div className="t-section-title" style={{ marginBottom: '1rem' }}>
        CHOOSE A TOPIC
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}
      >
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            onClick={() => navigate(`/education/${topic.id}`)}
          />
        ))}
      </div>

      {/* ── Why Financial Education Matters ── */}
      <div
        className="t-card t-card-p"
        style={{
          borderLeft: '3px solid var(--gold)',
          borderRadius: '8px',
        }}
      >
        <div
          style={{
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: 'var(--gold)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}
        >
          WHY FINANCIAL EDUCATION MATTERS
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.75rem',
          }}
        >
          {[
            {
              icon: '◈',
              title: 'Protect Your Wealth',
              body: 'Understanding taxes, insurance, and estate planning can save you tens of thousands of dollars over a lifetime — money that compounds in your favor instead of going to avoidable costs.',
            },
            {
              icon: '◈',
              title: 'Make Informed Decisions',
              body: 'Financial literacy empowers you to evaluate advisors, products, and strategies on their merits — not marketing. Educated investors avoid the most common and costly mistakes.',
            },
            {
              icon: '◈',
              title: 'Plan with Confidence',
              body: 'From retirement timelines to trust structures, knowing the rules gives you the confidence to act decisively rather than defer decisions that compound over time.',
            },
            {
              icon: '◈',
              title: 'Build Generational Wealth',
              body: 'The families who sustain wealth across generations do so through intentional planning — wills, trusts, tax-efficient transfers, and consistent financial habits taught early.',
            },
          ].map((pt, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.75rem' }}>
              <span style={{ color: 'var(--gold)', fontSize: '0.875rem', marginTop: '1px', flexShrink: 0 }}>
                {pt.icon}
              </span>
              <div>
                <div
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--text-1)',
                    marginBottom: '0.25rem',
                  }}
                >
                  {pt.title}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-2)', lineHeight: 1.55 }}>
                  {pt.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Responsive grid */}
      <style>{`
        @media (max-width: 900px) {
          .edu-topic-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 580px) {
          .edu-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .edu-topic-grid { grid-template-columns: 1fr !important; }
          .edu-why-grid   { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
