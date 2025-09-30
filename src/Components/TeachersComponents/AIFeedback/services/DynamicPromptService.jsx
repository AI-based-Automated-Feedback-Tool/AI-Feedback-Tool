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

    

export default new DynamicPromptService();