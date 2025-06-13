const DetailedReport = {
  label: 'Detailed Report',
  prompt: `Create comprehensive feedback in this structure:
{
  "overallSummary": "Detailed performance analysis (3-4 sentences)",
  "keyStrengths": [
    "3-5 mastered concepts with question examples",
    "Performance patterns observed"
  ],
  "mostMissedQuestions": [
    "Top 5 difficult questions",
    "Detailed misconception analysis for each",
    "Prerequisite knowledge gaps"
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
}`
};

export default DetailedReport;
