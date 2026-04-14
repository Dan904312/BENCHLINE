import type { Goal, WeeklyPlan, GapAnalysis, QuizAnswers } from "./types";
import { GOALS_CONFIG } from "./utils";

export async function generatePlan(
  goal: Goal,
  quiz: QuizAnswers
): Promise<WeeklyPlan> {
  const config = GOALS_CONFIG[goal.type];
  const gapPercent = Math.round(
    ((goal.targetValue - goal.currentValue) / goal.targetValue) * 100
  );

  const prompt = `You are an elite sports performance coach building a 4-week training plan for an athlete.

GOAL: ${goal.title}
Sport: ${goal.sport}
Current performance: ${goal.currentValue} ${goal.unit}
Target performance: ${goal.targetValue} ${goal.unit}
Gap: ${gapPercent}% improvement needed
Deadline: ${goal.deadline}

ATHLETE PROFILE:
- Training days per week: ${quiz.trainingDaysPerWeek}
- Fitness level: ${quiz.currentFitnessLevel}
- Equipment: ${quiz.availableEquipment.join(", ")}
- Injury history: ${quiz.injuryHistory || "None"}
- Main weakness: ${quiz.mainWeakness}

Create a 4-week progressive training plan. Respond ONLY with valid JSON in this exact format:
{
  "weeks": [
    {
      "weekNumber": 1,
      "theme": "Foundation",
      "sessions": [
        {
          "id": "w1s1",
          "day": "Monday",
          "title": "Session title",
          "description": "What to do and how",
          "targetMetric": "Distance / Reps / Level",
          "targetValue": 5,
          "unit": "km",
          "type": "workout"
        }
      ]
    }
  ],
  "aiNotes": "Brief coaching note about the plan approach"
}

Include 3-4 sessions per week (matching their availability). Session types: "workout", "test", "rest", "recovery".
Make sessions SPECIFIC with real numbers, sets, distances, drills.`;

  const response = await fetch("/api/ai/plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) throw new Error("Failed to generate plan");

  const data = await response.json();
  return {
    goalId: goal.id,
    ...data,
    generatedAt: new Date().toISOString(),
  };
}

export async function generateGapAnalysis(
  goal: Goal,
  quiz: QuizAnswers
): Promise<GapAnalysis> {
  const prompt = `You are an elite sports performance analyst. Analyze this athlete's gaps.

GOAL: ${goal.title}
Current: ${goal.currentValue} ${goal.unit}
Target: ${goal.targetValue} ${goal.unit}
Fitness level: ${quiz.currentFitnessLevel}
Main weakness: ${quiz.mainWeakness}
Injury history: ${quiz.injuryHistory || "None"}

Return ONLY valid JSON:
{
  "currentLevel": "label for current performance",
  "targetLevel": "label for target performance",
  "gaps": [
    {
      "area": "Cardiovascular Endurance",
      "severity": "critical",
      "description": "What is lacking",
      "actionItems": ["Specific action 1", "Specific action 2"]
    }
  ],
  "priorityFocus": "The single most important thing to work on",
  "estimatedWeeks": 6
}

Identify 3-4 gaps. Severities: "critical", "moderate", "minor".`;

  const response = await fetch("/api/ai/gap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) throw new Error("Failed to generate gap analysis");
  return response.json();
}
