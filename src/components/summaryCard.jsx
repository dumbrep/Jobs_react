import './summaryCard.css';

const SummaryCard = (props) => {
    const formatDate = (isoString)=> {
        const date = new Date(isoString);
        return date.toLocaleString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          
        });
    }

    return (
        <div className="summary-card">
            <div className="summary-header">
                <div className="interview-time">Interview Time : {formatDate(props.interviewTime)}</div>
                <div className="overall-performance">Overall Performance : {props.overall_performance}</div>
            </div>

            <div className="question-highlights-title">Questions Response Highlights</div>
            <div className="question-highlights">
                {props.question_response_highlights.map((res, index) => (
                    <div className="question-item" key={index}>
                        <div className="question-text">Question : {res.question}</div>
                        <div className="key-points">Key Points : {res.candidate_key_points}</div>
                        <div className="assessment">Assessments : {res.assessment}</div>
                    </div>
                ))}
            </div>

            <div className="strengths-section">
                Strengths : <span className="strengths">{props.strengths}</span>
            </div>

            <div className="improvements-section">
                Areas of Improvement : 
                <div className="improvement-list">
                    {props.areas_of_improvement.map((res, index) => <div className="improvement-item" key={index}>{res}</div>)}
                </div>
            </div>
        </div>
    )
}

export default SummaryCard;
