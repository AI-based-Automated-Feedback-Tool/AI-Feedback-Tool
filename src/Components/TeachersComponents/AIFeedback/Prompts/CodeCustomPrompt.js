const CodeCustomPrompt = {
  label: 'Custom Prompt',
  prompt: `You can create your own custom prompt for code-related exams here.

You may include instructions like:
- Analyze the logic of student-submitted code and suggest improvements
- Compare the student's code to the ideal solution and rate its efficiency
- Identify errors, bad practices, or optimization opportunities

Use the following placeholders in your prompt:
- [QUESTIONS] – array of code questions
- [SUBMISSIONS] – array of student code submissions
- [ANSWERS] – array of expected solutions

IMPORTANT:
- Avoid referencing internal IDs; use question numbers or titles
- Return structured feedback in the following JSON format:

{
  "overallSummary": "string",
  "keyStrengths": ["string", "..."],
  "mostMissedQuestions": ["string", "..."],
  "teachingSuggestions": ["string", "..."],
  "nextSteps": ["string", "..."]
}`
};

export default CodeCustomPrompt;
