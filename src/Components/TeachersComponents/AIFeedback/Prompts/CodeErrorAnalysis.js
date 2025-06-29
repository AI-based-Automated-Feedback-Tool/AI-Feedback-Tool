const CodeErrorAnalysis = {
  label: 'Error Analysis',
  prompt: `Analyze the following student-submitted code and identify:
- Syntax errors
- Runtime issues
- Logical mistakes

For each issue:
- Clearly explain what the error is and why it occurs
- Suggest a correction or better approach

Then provide:
1. A summary of the overall code accuracy
2. A list of major error patterns
3. Teaching suggestions to help avoid such mistakes

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

export default CodeErrorAnalysis;
