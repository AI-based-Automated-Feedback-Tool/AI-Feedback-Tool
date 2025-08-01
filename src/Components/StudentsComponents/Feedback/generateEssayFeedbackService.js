export async function generateEssayFeedback(submissionId) {
  const response = await fetch('/api/essay-feedback/generate-essay-feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ submissionId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate feedback');
  }

  return await response.json();
}
