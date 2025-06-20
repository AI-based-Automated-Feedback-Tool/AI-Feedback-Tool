const calculateQuestionStats = (submittedAnswers, mcqQuestions, codeQuestions, essayQuestions, examType, noOfStudentsDoneExam) => {

    // take submitted answers to get question id and is it correct or wrong
    const filteredSubmittedAnswers = submittedAnswers.map((answer) => {
        return {
            questionId: answer.question_id,
            isCorrect: answer.is_correct
        };
    });
    // Group answers by question ID 
    let questionBank = mcqQuestions
    if (examType === 'code') {
        questionBank = codeQuestions
    } else if (examType === 'essay') {
        questionBank = essayQuestions
    }
    const questionStats = questionBank.map((question, index) => {
        let correct = 0;
        let incorrect = 0;
        filteredSubmittedAnswers.forEach((answer) => {
            if (answer.questionId === question.question_id) {
                if (answer.isCorrect === true) {
                    correct++;
                } else {
                    incorrect++;
                }
            }
        })

        return {
            questionId: question.question_id,
            id: `Question ${index + 1}`,
            full: question.question_text,
            correct: noOfStudentsDoneExam > 0 
                ? parseFloat(((correct / noOfStudentsDoneExam) * 100).toFixed(2)) 
                : 0, 
            incorrect: noOfStudentsDoneExam > 0 
                ? parseFloat(((incorrect / noOfStudentsDoneExam) * 100).toFixed(2)) 
                : 0
        };
    })
    return questionStats;
}
export default calculateQuestionStats;