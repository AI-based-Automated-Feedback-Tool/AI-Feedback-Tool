const useReportCalculations = (examSubmissions, mcqQuestions) => {
    const noOfStudentsDoneExam = examSubmissions.length;
    const scores = examSubmissions.map((submission) => submission.total_score)
    let totalScore = 0;
    for(let i=0; i<scores.length; i++){
        totalScore = totalScore+scores[i]
    }
    const avgScore = noOfStudentsDoneExam > 0 ? (totalScore / noOfStudentsDoneExam).toFixed(2) : 0;
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;

    //calculate total score assigned by teacher when creating the exam
    const iniScore = mcqQuestions.map((q) => q.points)
    let iniTotalScore = 0
    for(let i=0; i<iniScore.length; i++){
        iniTotalScore += iniScore[i]
    }
    return{
        scores,
        noOfStudentsDoneExam,
        avgScore,
        highestScore,
        iniTotalScore
    }

}
export default useReportCalculations;