import axios from 'axios';

const API_URL = 'http://localhost:3000/api/configureExam';

export const saveExamConfig = async (examData) => {
  const response = await axios.post(API_URL, {
    ...examData,
    teacher_id: 'c0a80100-0000-4000-a000-000000000001' // Replace with real auth later
  });
  return response.data;
};