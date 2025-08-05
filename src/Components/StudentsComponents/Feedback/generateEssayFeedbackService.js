/**
 *  Function to request AI-generated feedback for a given essay submission
 * 
 * @param {string} submissionId - The ID of the submitted essay answers
 * @returns {Promise<Object>} - Response JSON containing feedback (if successful)
 * @throws {Error} - If the request fails, throws an error with the message
 */

export async function generateEssayFeedback(submissionId) {
  //  Send POST request to the backend API with the submissionId
  const response = await fetch('/api/essay-feedback/generate-essay-feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ submissionId }),
  });


  // If the request failed (non-2xx response), parse and throw error
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate feedback');
  }

   //  Parse and return the success response JSON (includes AI feedback)
  return await response.json();
}
