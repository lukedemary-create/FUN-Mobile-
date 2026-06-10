import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EDUCATION_CONTENT } from '../data/educationContent';
import {
  GraduationCap, BookOpen, PiggyBank, Receipt, BarChart2,
  ShieldCheck, ScrollText, Landmark, Sunrise, Diamond,
} from 'lucide-react';

const TOPIC_ICON_MAP = {
  Receipt:    Receipt,
  ShieldCheck: ShieldCheck,
  ScrollText:  ScrollText,
  Landmark:    Landmark,
  Sunrise:     Sunrise,
  BarChart2:   BarChart2,
};

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
        gap: '0.625rem',
        padding: '0.875rem',
      }}
    >
      {/* Icon circle */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: `${topic.color}20`,
            border: `1px solid ${topic.color}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {(() => {
            const Icon = TOPIC_ICON_MAP[topic.icon];
            return Icon ? <Icon size={15} color={topic.color} /> : null;
          })()}
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
          fontSize: '1.35rem',
          fontWeight: 700,
          color: 'var(--gold)',
          lineHeight: 1.1,
          marginBottom: '0.2rem',
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
    <div style={{ maxWidth: 1100, padding: '0 1.5rem 2rem' }}>
      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border-c)",
        borderRadius: 20,
        padding: "1.25rem 1.75rem",
        marginBottom: "1rem",
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 var(--border-c)",
      }}>
        <div style={{
          position: "absolute", top: -60, right: -40,
          width: 320, height: 320,
          background: "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", position: "relative" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.625rem" }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <GraduationCap size={14} style={{ color: "var(--gold)" }} />
              </div>
              <h1 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--text-1)", letterSpacing: "-0.01em", fontFamily: "'Inter', system-ui, sans-serif" }}>
                FINANCIAL{" "}
                <em style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", color: "var(--gold)", fontWeight: 400, fontSize: "1.2rem" }}>Education</em>
              </h1>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-2)", lineHeight: 1.6, maxWidth: 560, margin: "0 0 0.75rem" }}>
              Build real financial literacy from the ground up. Structured lessons covering investing, retirement, taxes, and market fundamentals — written for clarity, not complexity.
            </p>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              {["Beginner to Advanced", "6 Core Topics", "Structured Learning", "Free Access"].map((label) => (
                <span key={label} style={{
                  fontSize: "0.6875rem", fontWeight: 700, padding: "3px 10px",
                  borderRadius: 99, letterSpacing: "0.04em",
                  background: "rgba(201,169,110,0.10)",
                  border: "1px solid rgba(201,169,110,0.25)",
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
                padding: "0.5rem 0.75rem",
                background: "var(--bg)", border: "1px solid var(--border-c)",
                borderRadius: 10, minWidth: 150,
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  background: "rgba(201,169,110,0.1)",
                  border: "1px solid rgba(201,169,110,0.2)",
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
          gap: '0.5rem',
          marginBottom: '1.25rem',
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
          gap: '0.75rem',
          marginBottom: '1.75rem',
        }}
      >
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            onClick={() => navigate(`/fun/learners-library/${topic.id}`)}
          />
        ))}
      </div>

      {/* ── Why Financial Education Matters ── */}
      <div
        className="t-card t-card-p"
        style={{
          border: '1px solid rgba(201,169,110,0.25)',
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
              title: 'Protect Your Wealth',
              body: 'Understanding taxes, insurance, and estate planning can save you tens of thousands of dollars over a lifetime — money that compounds in your favor instead of going to avoidable costs.',
            },
            {
              title: 'Make Informed Decisions',
              body: 'Financial literacy empowers you to evaluate advisors, products, and strategies on their merits — not marketing. Educated investors avoid the most common and costly mistakes.',
            },
            {
              title: 'Plan with Confidence',
              body: 'From retirement timelines to trust structures, knowing the rules gives you the confidence to act decisively rather than defer decisions that compound over time.',
            },
            {
              title: 'Build Generational Wealth',
              body: 'The families who sustain wealth across generations do so through intentional planning — wills, trusts, tax-efficient transfers, and consistent financial habits taught early.',
            },
          ].map((pt, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ color: 'var(--gold)', marginTop: '2px', flexShrink: 0 }}>
                <Diamond size={12} fill="var(--gold)" />
              </div>
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
