import { useState } from 'react';
import { saveExamConfig } from './examService';

export const useConfigureExam = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitExamConfig = async (formData) => {
    setLoading(true);
    try {
      const result = await saveExamConfig(formData);
      return result;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitExamConfig, loading, error };
};