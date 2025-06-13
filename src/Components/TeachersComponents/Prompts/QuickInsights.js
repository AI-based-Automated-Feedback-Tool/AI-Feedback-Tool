const QuickInsights = {
  label: 'Quick Insights',
  prompt: `Provide concise exam feedback in this JSON format:
{
  "overallSummary": "One paragraph summary",
  "keyStrengths": ["2-3 strengths max"],
  "mostMissedQuestions": ["2-3 weak areas"],
  "teachingSuggestions": ["2 quick recommendations"],
  "nextSteps": ["1-2 action items"]
}`
};

export default QuickInsights;
