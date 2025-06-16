const CustomPrompt = {
  label: 'Custom Prompt',
  prompt: `Create your own custom prompt structure. You can use these placeholders if needed:
[QUESTIONS] - Will be replaced with exam questions
[SUBMISSIONS] - Will be replaced with student submissions
[ANSWERS] - Will be replaced with correct answers

⚠️ GUIDELINES:
- When referencing specific questions, use question numbers (e.g., Q1, Q2) or short, clear titles.
- Avoid internal database IDs or UUIDs in your analysis.
- Focus on clarity and usefulness for teachers and students.

✅ Suggested structure:
{
  "analysis": "Your custom analysis requirements",
  "strengths": ["Key concepts students performed well in"],
  "weaknesses": ["Areas or questions students struggled with (use Q1, Q2, etc.)"],
  "recommendations": ["Your actionable suggestions for improvement"]
}

Make sure to return a valid JSON object only, using keys appropriate to your structure.`
};

export default CustomPrompt;
