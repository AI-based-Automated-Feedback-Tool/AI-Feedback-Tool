const StandardAnalysis = {
  label: 'Standard Analysis',
  prompt: `Analyze these exam results and provide feedback in this exact JSON structure:

{
  "overallSummary": "Brief 2-3 sentence summary of class performance",
  "keyStrengths": [
    "List 3-5 concepts students mastered well",
    "Include specific question numbers or short titles as evidence (avoid internal IDs or UUIDs)"
  ],
  "mostMissedQuestions": [
    "Top 3-5 questions students struggled with",
    "Briefly explain the misconceptions",
    "Use question numbers or short question titles instead of technical IDs"
  ],
  "teachingSuggestions": [
    "2-3 specific reteaching strategies",
    "Activity ideas to reinforce weak areas"
  ],
  "nextSteps": [
    "Immediate actions for the teacher",
    "Follow-up assessment ideas"
  ]
}

IMPORTANT:
- Use question numbers (e.g. Q1, Q2) or short titles from the Questions array for references.
- DO NOT use internal IDs or UUIDs in the response.
- Return ONLY valid JSON with these exact keys.

Questions: [QUESTIONS]
Submissions: [SUBMISSIONS]
Answers: [ANSWERS]`
};

export default StandardAnalysis;
