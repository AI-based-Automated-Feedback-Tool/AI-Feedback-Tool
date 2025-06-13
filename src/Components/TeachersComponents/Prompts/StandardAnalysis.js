const StandardAnalysis = {
  label: 'Standard Analysis',
  prompt: `Analyze these exam results and provide feedback in this exact JSON structure:

{
  "overallSummary": "Brief 2-3 sentence summary of class performance",
  "keyStrengths": [
    "List 3-5 concepts students mastered well",
    "Include specific question numbers as evidence"
  ],
  "mostMissedQuestions": [
    "Top 3-5 questions students struggled with",
    "Briefly explain the misconceptions"
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

Questions: [QUESTIONS]
Submissions: [SUBMISSIONS]
Answers: [ANSWERS]

Return ONLY valid JSON with these exact keys.`


};

export default StandardAnalysis;
