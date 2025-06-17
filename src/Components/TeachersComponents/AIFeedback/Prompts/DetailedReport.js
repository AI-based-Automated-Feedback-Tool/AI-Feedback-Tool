const DetailedReport = {
  label: 'Detailed Report',
  prompt: `Create comprehensive feedback in this structure:

{
  "overallSummary": "Detailed performance analysis (3-4 sentences)",
  "keyStrengths": [
    "3-5 mastered concepts with question examples",
    "Mention specific question numbers (e.g., Q1, Q2) or short titles for clarity (avoid internal IDs or UUIDs)",
    "Include performance patterns observed"
  ],
  "mostMissedQuestions": [
    "Top 5 difficult questions",
    "Use question numbers or short titles (not internal IDs)",
    "Provide detailed misconception analysis for each",
    "Highlight prerequisite knowledge gaps"
  ],
  "teachingSuggestions": [
    "Differentiated instruction strategies",
    "Reteaching methods for each weak area",
    "Recommended practice activities"
  ],
  "nextSteps": [
    "Short-term remediation plan",
    "Long-term instructional adjustments",
    "Suggested resources"
  ]
}

IMPORTANT:
- Use only human-readable references: question numbers (e.g., Q1, Q2) or short question titles.
- DO NOT use internal IDs or UUIDs.
- Return ONLY valid JSON using the exact structure and keys above.

Questions: [QUESTIONS]
Submissions: [SUBMISSIONS]
Answers: [ANSWERS]`
};

export default DetailedReport;
