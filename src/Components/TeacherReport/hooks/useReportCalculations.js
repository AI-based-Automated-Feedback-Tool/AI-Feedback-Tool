const useReportCalculations = (examSubmissions, mcqQuestions, codeQuestions, selectedExam, exams) => {
    const selectedExamObject = exams.find((exam) => exam.exam_id === selectedExam)
    const examType = selectedExamObject?.type || 'mcq'; 
    const noOfStudentsDoneExam = examSubmissions.length;
    const scores = examSubmissions.map((submission) => submission.total_score)
    let totalScore = 0;
    for(let i=0; i<scores.length; i++){
        totalScore = totalScore+scores[i]
    }
    const avgScore = noOfStudentsDoneExam > 0 ? (totalScore / noOfStudentsDoneExam).toFixed(2) : 0;
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;

    //calculate total score assigned by teacher when creating the exam
    let iniTotalScore = 0;
    if(examType === 'code'){
        const iniScore = codeQuestions.map((q) => q.points)

        for(let i=0; i<iniScore.length; i++){
            iniTotalScore += iniScore[i]
        }
    } else if(examType === 'mcq'){
        const iniScore = mcqQuestions.map((q) => q.points)
        for(let i=0; i<iniScore.length; i++){
            iniTotalScore += iniScore[i]
        }
    }

    //average time taken
    const time = examSubmissions.map((submission) => submission.time_taken);
    let totalTime = 0;
    for(let i=0; i<time.length; i++){
        totalTime += time[i]
    }
    const avgTime = totalTime / noOfStudentsDoneExam;
    const avgTimeInMinutes = (avgTime / 60).toFixed(2); 

    //average focus loss
    const focusLoss = examSubmissions.map((submission) => submission.focus_loss_count);
    let totalFocusLoss = 0;
    for(let i=0; i<focusLoss.length; i++){
        totalFocusLoss += focusLoss[i]
    }
    const avgFocusLoss = (totalFocusLoss / noOfStudentsDoneExam).toFixed(2);
    return{
        scores,
        noOfStudentsDoneExam,
        avgScore,
        highestScore,
        iniTotalScore,
        avgTimeInMinutes,
        avgFocusLoss
    }

}
export default useReportCalculations;