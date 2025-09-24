const EssayCustomPrompt = {
  label: 'Custom Prompt',
  prompt: `You are evaluating a student essay based on custom criteria.

Instructions may include:
- Writing style, grammar, or content evaluation
- Suggestions for improvement or praise
- Structure, tone, or argumentation

Assessment guideline:
[GUIDELINES]

Essay Question:
[QUESTIONS]

Student Response:
[SUBMISSIONS]

Provide feedback in **strict JSON format** with these keys:
{
  "overallSummary": "string summarizing overall performance",
  "keyStrengths": ["list of strengths"],
  "mostMissedQuestions": ["list of missing or weak points"],
  "teachingSuggestions": ["suggestions for improvement"],
  "nextSteps": ["actionable steps for student"]
}

Respond only with JSON.`
};

export default EssayCustomPrompt;
