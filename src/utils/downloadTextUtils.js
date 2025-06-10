export const downloadAsTextFile = (feedback, filename = 'feedback.txt') => {
  let content = '';

  if (feedback.overallSummary) {
    content += `📊 Overall Summary\n${feedback.overallSummary}\n\n`;
  }

  if (feedback.keyStrengths?.length) {
    content += `✅ Key Strengths\n${feedback.keyStrengths.join('\n')}\n\n`;
  }

  if (feedback.mostMissedQuestions?.length) {
    content += `⚠️ Most Missed Questions\n${feedback.mostMissedQuestions.join('\n')}\n\n`;
  }

  if (feedback.teachingSuggestions?.length) {
    content += `💡 Teaching Suggestions\n${feedback.teachingSuggestions.join('\n')}\n\n`;
  }

  if (feedback.nextSteps?.length) {
    content += `🚀 Actionable Next Steps\n${feedback.nextSteps.join('\n')}\n\n`;
  }

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
