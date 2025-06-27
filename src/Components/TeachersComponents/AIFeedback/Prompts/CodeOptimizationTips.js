const CodeOptimizationTips = {
  label: 'Optimization Tips',
  prompt: `Review the following student-submitted code and suggest improvements to enhance:
- Performance
- Readability
- Efficiency

For each improvement:
- Explain why it's useful
- Refer to examples from the code where appropriate

Code: [QUESTIONS]
Submissions: [SUBMISSIONS]
Answers: [ANSWERS]

Return the output in the following JSON format:

{
  "overallSummary": "string",
  "keyStrengths": ["string", "..."],
  "mostMissedQuestions": ["string", "..."],
  "teachingSuggestions": ["string", "..."],
  "nextSteps": ["string", "..."]
}`
};

export default CodeOptimizationTips;
