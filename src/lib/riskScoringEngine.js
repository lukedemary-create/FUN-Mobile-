/**
 * Planora Risk Scoring Engine
 * Implements weighted questionnaire scoring with override rules
 */

import questionnaireData from '../data/questionnaire.json';
import portfoliosData from '../data/portfolios.json';

export function calculateRiskScore(answers) {
  const questions = questionnaireData.questions;
  
  // Calculate weighted score
  let totalWeightedScore = 0;
  let totalMaxWeightedScore = 0;
  
  questions.forEach(question => {
    const answer = answers[question.id];
    if (answer) {
      const score = answer.score;
      const weight = question.weight;
      totalWeightedScore += score * weight;
      totalMaxWeightedScore += 5 * weight; // Max score per question is 5
    }
  });
  
  // Convert to 0-100 scale
  let finalScore = (totalWeightedScore / totalMaxWeightedScore) * 100;
  
  // Apply override rules
  finalScore = applyOverrideRules(finalScore, answers);
  
  return Math.round(finalScore);
}

function applyOverrideRules(score, answers) {
  const rules = questionnaireData.scoringLogic.overrideRules;
  
  rules.forEach(rule => {
    if (evaluateCondition(rule.condition, answers)) {
      if (rule.action === "cap_final_score_at") {
        score = Math.min(score, rule.value);
      } else if (rule.action === "floor_final_score_at") {
        score = Math.max(score, rule.value);
      }
    }
  });
  
  return score;
}

function evaluateCondition(condition, answers) {
  // Parse simple conditions like "q4.selectedScore == 1"
  // or "q5.selectedScore == 1 AND q10.selectedTag == 'high_loss_aversion'"
  
  if (condition.includes(" AND ")) {
    const parts = condition.split(" AND ");
    return parts.every(part => evaluateSingleCondition(part.trim(), answers));
  }
  
  return evaluateSingleCondition(condition, answers);
}

function evaluateSingleCondition(condition, answers) {
  // Extract question ID, property, and value
  const match = condition.match(/(q\d+)\.(selectedScore|selectedTag)\s*==\s*['"]?([^'"]+)['"]?/);
  if (!match) return false;
  
  const [, questionId, property, value] = match;
  const answer = answers[questionId];
  
  if (!answer) return false;
  
  if (property === "selectedScore") {
    return answer.score === parseInt(value);
  } else if (property === "selectedTag") {
    return answer.tag === value;
  }
  
  return false;
}

export function getArchetypeForScore(score) {
  const archetypeMap = questionnaireData.scoringLogic.archetypeMap;
  
  for (const mapping of archetypeMap) {
    if (score >= mapping.min && score <= mapping.max) {
      return portfoliosData.archetypes.find(a => a.id === mapping.archetypeId);
    }
  }
  
  // Fallback to first archetype if no match
  return portfoliosData.archetypes[0];
}