import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import GlassCard from "../shared/GlassCard";

export default function LearnTab({ pillar, pillarLabel }) {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chapterNum, setChapterNum] = useState(1);
  const [quizActive, setQuizActive] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const loadChapter = async (num) => {
    setLoading(true);
    setQuizActive(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setChapterNum(num);

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are MoneyTalks financial education AI. Generate Chapter ${num} of a course on "${pillarLabel}" (one of the six pillars of financial planning).

Create a detailed, educational lesson with:
- A clear chapter title
- Well-structured content with headers, bullet points, and examples
- Plain language explanations (define any jargon)
- Real-world examples where appropriate
- Source references (IRS, SEC, SSA, FINRA, etc.)

IMPORTANT: Do NOT include any quiz questions, practice questions, or "test your knowledge" sections inside the lesson content. The quiz is handled separately.

Also create 3 quiz questions to test understanding of the lesson (these will be shown separately after the reading).

Keep it engaging, professional, and educational.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          content: { type: "string" },
          quiz: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string" },
                options: { type: "array", items: { type: "string" } },
                correct_index: { type: "number" },
                explanation: { type: "string" }
              }
            }
          }
        }
      }
    });

    setLesson(res);
    setLoading(false);
  };

  const handleQuizAnswer = (qIdx, aIdx) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: aIdx }));
  };

  const getScore = () => {
    if (!lesson?.quiz) return 0;
    return lesson.quiz.filter((q, i) => quizAnswers[i] === q.correct_index).length;
  };

  if (!lesson && !loading) {
    return (
      <div className="text-center py-16">
        <BookOpen className="w-12 h-12 text-[#00d4aa] mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold text-white mb-2">Start Learning</h3>
        <p className="text-sm text-[#94a3b8] mb-6">Begin your {pillarLabel} education journey</p>
        <Button onClick={() => loadChapter(1)} className="bg-[#00d4aa] hover:bg-[#00d4aa]/80 text-black font-medium">
          Start Chapter 1
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-[#00d4aa] animate-spin mb-3" />
        <p className="text-sm text-[#94a3b8]">Generating Chapter {chapterNum}...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#00d4aa] font-medium px-2 py-1 rounded-full bg-[#00d4aa]/10">Chapter {chapterNum}</span>
          <h2 className="text-xl font-bold text-white">{lesson?.title}</h2>
        </div>
      </div>

      <GlassCard className="mb-6">
        <ReactMarkdown className="prose prose-sm prose-invert max-w-none prose-headings:text-white prose-p:text-[#e2e8f0] prose-li:text-[#e2e8f0] prose-strong:text-[#00d4aa]">
          {lesson?.content}
        </ReactMarkdown>
      </GlassCard>

      {/* Quiz */}
      {lesson?.quiz && lesson.quiz.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Chapter Quiz</h3>
            {quizSubmitted && (
              <span className="text-sm font-medium text-[#00d4aa]">{getScore()}/{lesson.quiz.length} correct</span>
            )}
          </div>
          <div className="space-y-4">
            {lesson.quiz.map((q, qi) => (
              <GlassCard key={qi}>
                <p className="text-sm font-medium text-white mb-3">{qi + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options?.map((opt, oi) => {
                    const selected = quizAnswers[qi] === oi;
                    const isCorrect = q.correct_index === oi;
                    let cls = "border-[#1e293b] hover:border-[#00d4aa]/30";
                    if (quizSubmitted) {
                      if (isCorrect) cls = "border-[#00d4aa] bg-[#00d4aa]/10";
                      else if (selected && !isCorrect) cls = "border-[#ef4444] bg-[#ef4444]/10";
                    } else if (selected) {
                      cls = "border-[#3b82f6] bg-[#3b82f6]/10";
                    }
                    return (
                      <button
                        key={oi}
                        onClick={() => handleQuizAnswer(qi, oi)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-all ${cls} text-[#e2e8f0]`}
                      >
                        <div className="flex items-center gap-2">
                          {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-[#00d4aa] flex-shrink-0" />}
                          {quizSubmitted && selected && !isCorrect && <XCircle className="w-4 h-4 text-[#ef4444] flex-shrink-0" />}
                          <span>{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {quizSubmitted && q.explanation && (
                  <div className="mt-4 p-3 rounded-xl bg-[#00d4aa]/5 border border-[#00d4aa]/20">
                    <p className="text-xs font-semibold text-[#00d4aa] mb-1">Explanation</p>
                    <p className="text-sm text-[#e2e8f0] leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            {!quizSubmitted ? (
              <Button
                onClick={() => setQuizSubmitted(true)}
                disabled={Object.keys(quizAnswers).length < (lesson.quiz?.length || 0)}
                className="bg-[#00d4aa] hover:bg-[#00d4aa]/80 text-black"
              >
                Submit Answers
              </Button>
            ) : (
              <Button onClick={() => loadChapter(chapterNum + 1)} className="bg-[#3b82f6] hover:bg-[#3b82f6]/80 text-white">
                Next Chapter <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}