const EssayContentPrompt = {
  label: 'Content & Relevance Focus',
  prompt: `You are an educator evaluating the content quality of a student essay.

Check:
- Relevance to the essay question
- Coverage of key points
- Logical flow of ideas

Assessment guideline:
[GUIDELINES]

Essay Question:
[QUESTIONS]

Student Response:
[SUBMISSIONS]

Provide feedback on content strength, missing points, and logical organization.`,
};

export default EssayContentPrompt;
