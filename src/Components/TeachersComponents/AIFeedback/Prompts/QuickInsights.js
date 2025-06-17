const QuickInsights = {
  label: 'Quick Insights',
  prompt: `Provide concise exam feedback in this JSON format:

{
  "overallSummary": "One paragraph summary of student performance",
  "keyStrengths": [
    "2-3 strengths max, based on clearly understood concepts",
    "Reference specific question numbers or short titles as evidence (avoid internal IDs or UUIDs)"
  ],
  "mostMissedQuestions": [
    "2-3 weak areas where students struggled",
    "Refer to question numbers (e.g., Q1, Q2) or short question titles, not internal IDs"
  ],
  "teachingSuggestions": [
    "2 quick recommendations for reteaching or reinforcement",
    "Can include strategy or activity suggestions"
  ],
  "nextSteps": [
    "1-2 action items for the teacher to address weak areas or improve understanding"
  ]
}

IMPORTANT:
- Use human-readable references like question numbers (e.g., Q1, Q2) or short question titles.
- DO NOT include internal question IDs or UUIDs.
- Return ONLY valid JSON with these exact keys.

Questions: [QUESTIONS]
Submissions: [SUBMISSIONS]
Answers: [ANSWERS]`
};

export default QuickInsights;
