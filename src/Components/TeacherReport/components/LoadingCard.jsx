import '../../../css/Reports/LoadingCard.css';
const LoadingCard = () => {
  return (
    <div className="loading-card-modern">
      <div className="loading-content">
        <div className="spinner-orbit">
          <div className="spinner-core"></div>
        </div>
        <div className="loading-text">
          <h3>Loading info...</h3>
          <p>Please wait while we retrieve your data.</p>
        </div>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingCard;