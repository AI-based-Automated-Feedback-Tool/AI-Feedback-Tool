/**
 * Service for generating dynamic prompt options using AI
 */

export class DynamicPromptService {
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  }

  /**
   * Generates dynamic prompt options based on exam data
   * @param {Object} examData - Contains questions, submissions, and answers
   * @param {string} provider - AI provider ('cohere' or 'openrouter')
   * @returns {Promise<Array>} Array of dynamic prompt options
   */
  async generateDynamicOptions(examData, provider = 'cohere') {
    const { questions, submissions, answers, examTitle } = examData;

    // Create a prompt specifically for generating dynamic options
    const systemPrompt = `You are an educational AI assistant that analyzes exam data to generate relevant feedback focus areas. 

        Based on the provided exam data, generate 4-6 dynamic prompt options that would be most valuable for teachers to focus on when analyzing student performance. Each option should be specific to the actual exam content and student performance patterns.

        Exam Title: ${examTitle}
        Questions: ${JSON.stringify(questions)}
        Submissions: ${JSON.stringify(submissions)}
        Answers: ${JSON.stringify(answers)}

        Please analyze the data and generate relevant prompt options in the following JSON format:
        {
        "options": [
            {
            "id": "unique-id",
            "label": "Brief descriptive title",
            "description": "Detailed explanation of what this option analyzes"
            }
        ]
        }

        Focus on areas like:
        - Performance patterns specific to question types in this exam
        - Difficulty analysis based on actual success rates
        - Learning gaps identified from incorrect answers
        - Strengths demonstrated by high-performing areas
        - Time management insights from submission data
        - Specific content areas that need attention

        Make sure each option is:
        1. Specific to the actual exam content
        2. Actionable for teachers
        3. Based on observable patterns in the data
        4. Unique from other options

        Return only the JSON response, no additional text.`;

    try {
      const response = await fetch(`${this.apiUrl}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: systemPrompt,
          provider: provider
        })
      });

      if (!response.ok) {
        let errorMsg = `API error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData?.error) errorMsg = `API error: ${errorData.error}`;
        } catch { }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      
      // Parse the AI response
      let parsedOptions;
      try {
        // Clean result to remove markdown code fences if present
        let cleanResult = data.result
          .replace(/```json\s*/g, '')  // remove ```json
          .replace(/```/g, '')         // remove closing ```
          .trim();

        const parsed = JSON.parse(cleanResult);
        parsedOptions = parsed.options || [];
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        // Fallback to default options if parsing fails
        parsedOptions = this.getFallbackOptions();
      }

      // Validate and ensure we have at least some options
      if (!Array.isArray(parsedOptions) || parsedOptions.length === 0) {
        return this.getFallbackOptions();
      }

      // Ensure each option has required fields
      return parsedOptions.filter(option => 
        option.id && option.label && option.description
      ).map((option, index) => ({
        ...option,
        id: option.id || `dynamic-${index + 1}` // Ensure unique ID
      }));

    } catch (error) {
      console.error('Error generating dynamic options:', error);
      throw error;
    }
  }

  

export default new DynamicPromptService();