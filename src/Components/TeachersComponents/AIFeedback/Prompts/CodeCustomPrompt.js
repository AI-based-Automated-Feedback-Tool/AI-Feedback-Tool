const CodeCustomPrompt = {
  label: 'Custom Prompt',
  prompt: `You can create your own custom prompt for code-related exams here.

You may include instructions like:
- Analyze the logic of student-submitted code and suggest improvements.
- Compare the student's code to the ideal solution and rate its efficiency.
- Identify errors, bad practices, or optimization opportunities.

Data placeholders:
- [QUESTIONS] – array of code questions
- [SUBMISSIONS] – array of student code submissions
- [ANSWERS] – array of expected solutions

IMPORTANT:
- Use the placeholders above in your prompt where necessary.
- Avoid referencing internal IDs; use question numbers or titles when needed.
- Return structured feedback if possible (JSON format is encouraged).`
};

export default CodeCustomPrompt;
