const calculateScoreDistribution = (scores, iniTotalScore) => {
    //Graph data
    const noOfContainers = 7;
    const containerSize = Math.ceil(iniTotalScore / noOfContainers) //round up to the next whole number
    const scoreContainers = new Array(7).fill(0)
    scores.forEach(score => {
        let containerIndex = Math.min(Math.floor(score / containerSize), noOfContainers - 1)
        scoreContainers[containerIndex]++
    })

    //score distribution data
    const scoreDistributionData = scoreContainers.map((count, index) => {
        const start = index * containerSize
        const end = (index === noOfContainers - 1) ? iniTotalScore : (start + containerSize - 1)
        return {
            scoreRange: `${start} - ${end}`,
            students: count
        }
    })
    return scoreDistributionData;
}
export default calculateScoreDistribution;