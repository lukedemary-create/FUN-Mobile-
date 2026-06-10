import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, BookOpen, ChevronLeft, Trophy } from 'lucide-react';
import { EDUCATION_CONTENT } from '../data/educationContent';

/* ─── localStorage helpers ───────────────────────────────────────── */
function loadProgress(topicId) {
  try {
    return JSON.parse(localStorage.getItem(`planora-edu-${topicId}`) || '{}');
  } catch {
    return {};
  }
}

function saveProgress(topicId, data) {
  try {
    localStorage.setItem(`planora-edu-${topicId}`, JSON.stringify(data));
  } catch {
    /* noop */
  }
}

/* ─── Quiz Component ─────────────────────────────────────────────── */
function QuizPanel({ chapter, onComplete }) {
  const questions = chapter.quiz || [];
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);
  const topRef = useRef(null);

  // Scroll quiz to top whenever question changes
  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentQ]);

  const question = questions[currentQ];
  // Support both {question, correct} and {q, answer} data shapes
  const questionText = question?.question ?? question?.q;
  const correctIdx = question?.correct ?? question?.answer;
  const isAnswered = selected !== null;
  const score = answers.filter(Boolean).length;

  function handleSelect(idx) {
    if (isAnswered) return;
    const correct = idx === correctIdx;
    setSelected(idx);
    setAnswers((prev) => [...prev, correct]);
  }

  function handleNext() {
    if (currentQ + 1 < questions.length) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
    } else {
      setDone(true);
    }
  }

  const finalScore = answers.filter(Boolean).length;

  if (done) {
    const total = questions.length;
    const pct = Math.round((finalScore / total) * 100);
    const passed = pct >= 60;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          padding: '2rem 1rem',
          textAlign: 'center',
        }}
      >
        {/* Trophy */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: passed ? 'rgba(0,184,153,0.12)' : 'rgba(255,59,92,0.12)',
            border: `2px solid ${passed ? 'rgba(0,184,153,0.3)' : 'rgba(255,59,92,0.3)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Trophy size={32} color={passed ? 'var(--up)' : 'var(--down)'} />
        </div>

        <div>
          <div
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: passed ? 'var(--up)' : 'var(--down)',
              fontFamily: 'var(--font-mono, monospace)',
              lineHeight: 1,
              marginBottom: '0.375rem',
            }}
          >
            {pct}%
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '0.25rem' }}>
            {finalScore} of {total} correct
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-2)' }}>
            {passed
              ? 'Great work! You\'ve demonstrated solid understanding.'
              : 'Review the chapter content and try again anytime.'}
          </div>
        </div>

        {/* Answer breakdown */}
        <div
          style={{
            display: 'flex',
            gap: '0.375rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {answers.map((correct, i) => (
            <div
              key={i}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: correct ? 'rgba(0,184,153,0.15)' : 'rgba(255,59,92,0.15)',
                border: `1px solid ${correct ? 'rgba(0,184,153,0.4)' : 'rgba(255,59,92,0.4)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: correct ? 'var(--up)' : 'var(--down)',
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        <button
          className="t-btn t-btn-gold"
          onClick={() => onComplete(finalScore, total)}
          style={{ width: '100%', maxWidth: 280 }}
        >
          COMPLETE CHAPTER
        </button>
      </div>
    );
  }

  return (
    <div ref={topRef} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
          }}
        >
          Question {currentQ + 1} of {questions.length}
        </span>
        <div
          style={{
            height: 3,
            flex: 1,
            margin: '0 0.75rem',
            background: 'var(--border-c)',
            borderRadius: 99,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${((currentQ + (isAnswered ? 1 : 0)) / questions.length) * 100}%`,
              background: 'var(--gold)',
              borderRadius: 99,
              transition: 'width 0.35s ease',
            }}
          />
        </div>
        <span
          style={{
            fontSize: '0.6875rem',
            color: 'var(--text-3)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {score}/{currentQ + (isAnswered ? 1 : 0)}
        </span>
      </div>

      {/* Question */}
      <div
        style={{
          fontSize: '0.9375rem',
          fontWeight: 600,
          color: 'var(--text-1)',
          lineHeight: 1.5,
          padding: '1rem 1.25rem',
          background: 'rgba(255,255,255,0.025)',
          borderRadius: 8,
          border: '1px solid var(--border-c)',
        }}
      >
        {questionText}
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {question.options.map((opt, idx) => {
          const letter = ['A', 'B', 'C', 'D'][idx];
          const isCorrect = idx === correctIdx;
          const isSelected = idx === selected;

          let bg = 'var(--surface)';
          let border = '1px solid var(--border-c)';
          let textColor = 'var(--text-1)';
          let letterBg = 'var(--border-c)';
          let letterColor = 'var(--text-2)';

          if (isAnswered) {
            if (isCorrect) {
              bg = 'rgba(0,184,153,0.08)';
              border = '1px solid rgba(0,184,153,0.4)';
              textColor = 'var(--up)';
              letterBg = 'rgba(0,184,153,0.15)';
              letterColor = 'var(--up)';
            } else if (isSelected && !isCorrect) {
              bg = 'rgba(255,59,92,0.08)';
              border = '1px solid rgba(255,59,92,0.4)';
              textColor = 'var(--down)';
              letterBg = 'rgba(255,59,92,0.15)';
              letterColor = 'var(--down)';
            }
          } else {
            /* hover hint via inline cursor */
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                background: bg,
                border,
                borderRadius: 8,
                cursor: isAnswered ? 'default' : 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                width: '100%',
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: letterBg,
                  color: letterColor,
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  letterSpacing: '0.02em',
                  fontFamily: 'var(--font-mono, monospace)',
                }}
              >
                {letter}
              </span>
              <span
                style={{
                  fontSize: '0.875rem',
                  color: textColor,
                  lineHeight: 1.5,
                  transition: 'color 0.2s',
                }}
              >
                {opt}
              </span>
            </button>
          );
        })}
      </div>

      {/* Next */}
      {isAnswered && (
        <button
          className="t-btn t-btn-gold"
          onClick={handleNext}
          style={{ alignSelf: 'flex-end' }}
        >
          {currentQ + 1 < questions.length ? 'NEXT QUESTION →' : 'SEE RESULTS →'}
        </button>
      )}
    </div>
  );
}

/* ─── Progress Panel (right sidebar) ────────────────────────────── */
function ProgressPanel({ topic, progress, chapters }) {
  const total = chapters.length;
  const completed = Object.values(progress).filter((v) => v?.completed).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div
      style={{
        width: 200,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {/* Overview stats */}
      <div
        className="t-card"
        style={{
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <div
          style={{
            fontSize: '0.625rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
          }}
        >
          TOPIC PROGRESS
        </div>

        {/* Big percentage */}
        <div
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: pct === 100 ? 'var(--up)' : 'var(--gold)',
            fontFamily: 'var(--font-mono, monospace)',
            lineHeight: 1,
          }}
        >
          {pct}%
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: 4,
            borderRadius: 99,
            background: 'var(--border-c)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${pct}%`,
              borderRadius: 99,
              background: pct === 100 ? 'var(--up)' : 'var(--gold)',
              transition: 'width 0.5s ease',
            }}
          />
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-2)' }}>
          {completed} of {total} chapters
        </div>
      </div>

      {/* Chapter checklist */}
      <div
        className="t-card"
        style={{
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <div
          style={{
            fontSize: '0.625rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-3)',
            marginBottom: '0.25rem',
          }}
        >
          CHAPTERS
        </div>
        {chapters.map((ch) => {
          const done = progress[ch.id]?.completed;
          return (
            <div
              key={ch.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
              }}
            >
              <CheckCircle
                size={13}
                color={done ? 'var(--up)' : 'var(--border-c)'}
                style={{ flexShrink: 0, marginTop: 2 }}
              />
              <span
                style={{
                  fontSize: '0.75rem',
                  color: done ? 'var(--text-1)' : 'var(--text-3)',
                  lineHeight: 1.4,
                }}
              >
                {ch.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Book recommendations */}
      {topic.books && topic.books.length > 0 && (
        <div
          className="t-card"
          style={{
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <div
            style={{
              fontSize: '0.625rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-3)',
            }}
          >
            READING LIST
          </div>
          {topic.books.map((book, i) => (
            <div
              key={i}
              style={{
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid var(--border-c)',
                borderRadius: 8,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.375rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <BookOpen size={13} color="var(--gold)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--gold)',
                      lineHeight: 1.3,
                    }}
                  >
                    {book.title}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-2)', marginTop: 2 }}>
                    {book.author}
                  </div>
                </div>
              </div>
              <div
                style={{
                  fontSize: '0.6875rem',
                  color: 'var(--text-3)',
                  lineHeight: 1.5,
                }}
              >
                {book.why}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Chapter Sidebar (left) ─────────────────────────────────────── */
function ChapterSidebar({ chapters, activeId, progress, onSelect }) {
  return (
    <div
      style={{
        width: 240,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
      }}
    >
      <div
        style={{
          fontSize: '0.625rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--text-3)',
          padding: '0 0.5rem',
          marginBottom: '0.375rem',
        }}
      >
        CHAPTERS
      </div>
      {chapters.map((ch) => {
        const isActive = ch.id === activeId;
        const isDone = progress[ch.id]?.completed;

        return (
          <button
            key={ch.id}
            onClick={() => onSelect(ch.id)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.625rem',
              padding: '0.625rem 0.75rem',
              background: isActive ? 'rgba(201,169,110,0.07)' : 'transparent',
              border: 'none',
              borderLeft: isActive
                ? '2px solid var(--gold)'
                : '2px solid transparent',
              borderRadius: '0 6px 6px 0',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'all 0.15s',
            }}
          >
            {/* Check or number */}
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: isDone
                  ? 'rgba(0,184,153,0.12)'
                  : isActive
                  ? 'rgba(201,169,110,0.12)'
                  : 'var(--border-c)',
                border: `1px solid ${
                  isDone
                    ? 'rgba(0,184,153,0.35)'
                    : isActive
                    ? 'rgba(201,169,110,0.4)'
                    : 'var(--border-c)'
                }`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              {isDone ? (
                <CheckCircle size={11} color="var(--up)" />
              ) : (
                <span
                  style={{
                    fontSize: '0.5625rem',
                    fontWeight: 700,
                    color: isActive ? 'var(--gold)' : 'var(--text-3)',
                    fontFamily: 'var(--font-mono, monospace)',
                  }}
                >
                  {ch.number}
                </span>
              )}
            </div>

            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--text-1)' : isDone ? 'var(--text-2)' : 'var(--text-2)',
                lineHeight: 1.4,
              }}
            >
              {ch.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Content Panel (center) ─────────────────────────────────────── */
function ContentPanel({ chapter, progress, onQuizComplete }) {
  const [quizActive, setQuizActive] = useState(false);
  const isDone = progress[chapter.id]?.completed;
  const quizRef = useRef(null);

  // Reset quiz state when chapter changes
  useEffect(() => {
    setQuizActive(false);
  }, [chapter.id]);

  // Scroll quiz into view when it opens
  useEffect(() => {
    if (quizActive && quizRef.current) {
      quizRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [quizActive]);

  function handleComplete(score, total) {
    onQuizComplete(chapter.id, score, total);
    setQuizActive(false);
  }

  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Chapter header */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          background: 'var(--surface)',
          border: '1px solid var(--border-c)',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-3)',
              marginBottom: '0.25rem',
            }}
          >
            Chapter {chapter.number}
          </div>
          <div
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              color: 'var(--text-1)',
              lineHeight: 1.3,
            }}
          >
            {chapter.title}
          </div>
        </div>
        {isDone && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '4px 10px',
              background: 'rgba(0,184,153,0.1)',
              border: '1px solid rgba(0,184,153,0.25)',
              borderRadius: 6,
              flexShrink: 0,
            }}
          >
            <CheckCircle size={12} color="var(--up)" />
            <span
              style={{
                fontSize: '0.625rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--up)',
              }}
            >
              COMPLETE
            </span>
          </div>
        )}
      </div>

      {/* Content or Quiz */}
      <div
        ref={quizRef}
        style={{
          padding: '1.5rem',
          background: 'var(--surface)',
          border: '1px solid var(--border-c)',
          borderRadius: 10,
          flex: 1,
        }}
      >
        {quizActive ? (
          <div>
            <div
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Trophy size={13} />
              CHAPTER QUIZ
            </div>
            <QuizPanel chapter={chapter} onComplete={handleComplete} />
          </div>
        ) : (
          <div>
            {/* Reading content */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              {chapter.content.split('\n\n').map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-2)',
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  {para.trim()}
                </p>
              ))}
            </div>

            {/* Take Quiz button */}
            <div
              style={{
                borderTop: '1px solid var(--border-c)',
                paddingTop: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div>
                {isDone && progress[chapter.id]?.score !== undefined && (
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-2)' }}>
                    Last score:{' '}
                    <span style={{ color: 'var(--up)', fontWeight: 700 }}>
                      {progress[chapter.id].score}/{progress[chapter.id].total}
                    </span>
                  </div>
                )}
              </div>
              <button
                className="t-btn t-btn-gold"
                onClick={() => setQuizActive(true)}
              >
                {isDone ? 'RETAKE QUIZ →' : 'TAKE QUIZ →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Mobile Chapter Pills ───────────────────────────────────────── */
function MobileChapterPills({ chapters, activeId, progress, onSelect }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
        marginBottom: '0.5rem',
        scrollbarWidth: 'none',
      }}
    >
      <style>{`.edu-pills::-webkit-scrollbar { display: none; }`}</style>
      {chapters.map((ch) => {
        const isActive = ch.id === activeId;
        const isDone = progress[ch.id]?.completed;
        return (
          <button
            key={ch.id}
            onClick={() => onSelect(ch.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.375rem 0.75rem',
              borderRadius: 99,
              border: isActive ? '1px solid var(--gold)' : '1px solid var(--border-c)',
              background: isActive ? 'rgba(201,169,110,0.08)' : 'var(--elevated)',
              color: isActive ? 'var(--gold)' : isDone ? 'var(--up)' : 'var(--text-2)',
              fontSize: '0.75rem',
              fontWeight: isActive ? 600 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.15s',
            }}
          >
            {isDone && <CheckCircle size={11} />}
            {ch.title}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function EducationTopic() {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const topic = EDUCATION_CONTENT[topicId];
  const chapters = topic?.chapters ?? [];

  const [progress, setProgress] = useState(() => loadProgress(topicId));
  const [activeChapterId, setActiveChapterId] = useState(chapters[0]?.id ?? null);

  // Persist whenever progress changes
  useEffect(() => {
    saveProgress(topicId, progress);
  }, [topicId, progress]);

  const handleQuizComplete = useCallback((chapterId, score, total) => {
    setProgress((prev) => ({
      ...prev,
      [chapterId]: {
        completed: true,
        score,
        total,
        completedAt: new Date().toISOString(),
      },
    }));
  }, []);

  if (!topic) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '40vh',
          gap: '1rem',
        }}
      >
        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-1)' }}>
          Topic not found
        </div>
        <button className="t-btn" onClick={() => navigate('/fun/learners-library')}>
          <ChevronLeft size={14} /> Back to Education
        </button>
      </div>
    );
  }

  const completedCount = Object.values(progress).filter((v) => v?.completed).length;
  const totalChapters = chapters.length;
  const activeChapter = chapters.find((c) => c.id === activeChapterId) ?? chapters[0];

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* ── Top bar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Back button */}
        <button
          onClick={() => navigate('/fun/learners-library')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-2)',
            cursor: 'pointer',
            fontSize: '0.8125rem',
            fontWeight: 500,
            padding: '4px 0',
            transition: 'color 0.15s',
          }}
        >
          <ChevronLeft size={15} />
          Back to Education
        </button>

        {/* Topic title */}
        <div
          style={{
            fontSize: '0.875rem',
            fontWeight: 800,
            color: 'var(--text-1)',
            letterSpacing: '-0.01em',
            textAlign: 'center',
            flex: 1,
            minWidth: 0,
          }}
        >
          {topic.title}
        </div>

        {/* Completion count */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexShrink: 0,
          }}
        >
          <span
            className="t-mono"
            style={{
              fontSize: '0.75rem',
              color: completedCount === totalChapters ? 'var(--up)' : 'var(--text-2)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {completedCount}/{totalChapters} Complete
          </span>
          {completedCount === totalChapters && totalChapters > 0 && (
            <Trophy size={14} color="var(--up)" />
          )}
        </div>
      </div>

      {/* ── Mobile pills (hidden on desktop) ── */}
      <div className="edu-mobile-pills" style={{ display: 'none' }}>
        <MobileChapterPills
          chapters={chapters}
          activeId={activeChapter.id}
          progress={progress}
          onSelect={setActiveChapterId}
        />
      </div>

      {/* ── Three-column layout ── */}
      <div
        style={{
          display: 'flex',
          gap: '1.25rem',
          alignItems: 'flex-start',
        }}
      >
        {/* Left sidebar — hidden on mobile */}
        <div className="edu-desktop-sidebar">
          <ChapterSidebar
            chapters={chapters}
            activeId={activeChapter.id}
            progress={progress}
            onSelect={setActiveChapterId}
          />
        </div>

        {/* Center content */}
        <ContentPanel
          chapter={activeChapter}
          progress={progress}
          onQuizComplete={handleQuizComplete}
        />

        {/* Right progress panel — hidden on small screens */}
        <div className="edu-desktop-right">
          <ProgressPanel topic={topic} progress={progress} chapters={chapters} />
        </div>
      </div>

      {/* ── Responsive styles ── */}
      <style>{`
        .edu-desktop-sidebar {
          display: flex;
        }
        .edu-desktop-right {
          display: flex;
        }
        .edu-mobile-pills {
          display: none;
        }

        @media (max-width: 768px) {
          .edu-desktop-sidebar { display: none !important; }
          .edu-desktop-right   { display: none !important; }
          .edu-mobile-pills    { display: block !important; }
        }
      `}</style>
    </div>
  );
}
