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

  /**
   * Fallback options in case AI generation fails
   * @returns {Array} Default prompt options
   */
  getFallbackOptions() {
    return [
      {
        id: 'easy-questions-analysis',
        label: 'Easy Questions Performance Analysis',
        description: 'Analyze questions that students consistently answer correctly to understand their strengths and mastered concepts'
      },
      {
        id: 'difficult-questions-insights',
        label: 'Difficult Questions Insights',
        description: 'Identify questions with low success rates to highlight learning gaps and common misconceptions'
      },
      {
        id: 'teaching-focus-recommendations',
        label: 'Teaching Focus Recommendations',
        description: 'Provide specific recommendations for curriculum emphasis and areas to focus on in future lessons'
      },
      {
        id: 'performance-patterns-analysis',
        label: 'Student Performance Patterns',
        description: 'Analyze overall performance trends and patterns to guide teaching strategies and student support'
      }
    ];
  }

  /**
   * Fetches exam data needed for analysis
   * @param {string} examId - The exam ID
   * @param {Object} supabase - Supabase client instance
   * @returns {Promise<Object>} Exam data object
   */
  async fetchExamData(examId, supabase) {
    try {
      // Fetch exam title
      const { data: examData, error: examError } = await supabase
        .from('exams')
        .select('title')
        .eq('exam_id', examId)
        .single();

      if (examError) throw new Error('Failed to fetch exam title');

      // Fetch exam questions
      const { data: questions, error: questionsError } = await supabase
        .from('mcq_questions')
        .select('question_id, question_text, options, answers')
        .eq('exam_id', examId);

      if (questionsError) throw new Error('Failed to fetch questions');

      // Fetch exam submissions
      const { data: submissions, error: submissionsError } = await supabase
        .from('exam_submissions')
        .select('student_id, exam_id, total_score, time_taken, id')
        .eq('exam_id', examId);

      if (submissionsError) throw new Error('Failed to fetch submissions');

      // Fetch submission answers
      const submissionIds = submissions.map((sub) => sub.id);
      let answers = [];
      
      if (submissionIds.length > 0) {
        const { data: answersData, error: answersError } = await supabase
          .from('exam_submissions_answers')
          .select('student_answer, is_correct, score, question_id')
          .in('submission_id', submissionIds);

        if (answersError) throw new Error('Failed to fetch submission answers');
        answers = answersData;
      }

      return {
        examTitle: examData?.title || 'Unknown Exam',
        questions: questions || [],
        submissions: submissions || [],
        answers: answers || []
      };

    } catch (error) {
      console.error('Error fetching exam data:', error);
      throw error;
    }
  }
}

export default new DynamicPromptService();