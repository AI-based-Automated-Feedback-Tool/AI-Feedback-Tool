const CustomPrompt = {
  label: 'Custom Prompt',
  prompt: `Create your own custom prompt structure. You can use these placeholders if needed:
[QUESTIONS] - Will be replaced with exam questions
[SUBMISSIONS] - Will be replaced with student submissions
[ANSWERS] - Will be replaced with correct answers

Suggested structure:
{
  "analysis": "Your custom analysis requirements",
  "strengths": ["What to look for"],
  "weaknesses": ["What to analyze"],
  "recommendations": ["What to suggest"]
}`
};

export default CustomPrompt;
