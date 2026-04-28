import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import GlassCard from "../shared/GlassCard";
import questionnaireData from "../../data/questionnaire.json";
import { calculateRiskScore } from "../../lib/riskScoringEngine";

const questions = questionnaireData.questions;

export default function InvestorQuestionnaire({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleAnswer = (questionId, value, score, tag) => {
    setAnswers({ ...answers, [questionId]: { value, score, tag } });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const finalScore = calculateRiskScore(answers);
      onComplete({ score: finalScore, answers });
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const currentQ = questions[currentQuestion];
  const currentAnswer = answers[currentQ.id];
  const progress = currentAnswer ? ((currentQuestion + 1) / questions.length) * 100 : (currentQuestion / questions.length) * 100;

  return (
    <GlassCard className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#64748b]">Question {currentQuestion + 1} of {questions.length}</span>
          <span className="text-xs font-semibold text-[#00d4aa]">{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-2 bg-[#1e293b] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#00d4aa] to-[#3b82f6] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">{currentQ.text}</h3>
      {currentQ.helperText && (
        <p className="text-sm text-[#64748b] mb-6">{currentQ.helperText}</p>
      )}

      <RadioGroup 
        value={currentAnswer?.value} 
        onValueChange={(value) => {
          const option = currentQ.options.find(o => o.label === value);
          handleAnswer(currentQ.id, value, option.score, option.tag);
        }}
        className="space-y-3 mb-8"
      >
        {currentQ.options.map((option, idx) => (
          <div 
            key={idx}
            className={`flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer touch-manipulation active:scale-95 min-h-[44px] ${
              currentAnswer?.value === option.label
                ? "bg-[#00d4aa]/10 border-[#00d4aa]/40"
                : "border-[#1e293b] hover:border-[#00d4aa]/20 hover:bg-[#1e293b]/50"
            }`}
            role="radio"
            aria-checked={currentAnswer?.value === option.label}
          >
            <RadioGroupItem value={option.label} id={`${currentQ.id}-${idx}`} className="border-[#64748b]" />
            <Label 
              htmlFor={`${currentQ.id}-${idx}`}
              className={`flex-1 cursor-pointer text-sm ${
                currentAnswer?.value === option.label ? "text-white font-medium" : "text-[#94a3b8]"
              }`}
            >
              {option.label}
            </Label>
            {currentAnswer?.value === option.label && (
              <CheckCircle2 className="w-5 h-5 text-[#00d4aa]" />
            )}
          </div>
        ))}
      </RadioGroup>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentQuestion === 0}
          className="text-[#94a3b8] hover:text-white"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!currentAnswer}
          className="bg-[#00d4aa] hover:bg-[#00d4aa]/80 text-white"
        >
          {currentQuestion === questions.length - 1 ? "Get My Portfolio" : "Next"}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </GlassCard>
  );
}