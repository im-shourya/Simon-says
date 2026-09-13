import React from "react";

const ScoreBoard = ({ round, bestScore }) => {
  return (
    <div className="scoreboard">
      <div>
        <span className="score-label">ROUND</span>
        <span>{round}</span>
      </div>
      <div>
        <span className="score-label">BEST</span>
        <span>{bestScore}</span>
      </div>
    </div>
  );
};

export default ScoreBoard;
