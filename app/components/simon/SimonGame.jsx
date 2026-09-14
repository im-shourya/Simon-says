"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  COLORS,
  GAME_STATES,
  getRandomColor,
  getPlaybackSpeed,
  playTone,
} from "./game";
import SimonButton from "./SimonButton";
import ScoreBoard from "./ScoreBoard";

const SimonGame = () => {
  const [gameState, setGameState] = useState(GAME_STATES.IDLE);
  const [sequence, setSequence] = useState([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [round, setRound] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [activeColor, setActiveColor] = useState(null);
  
  const timeoutsRef = useRef([]);

  useEffect(() => {
    const savedBest = Number(localStorage.getItem("simon-best")) || 0;
    setBestScore(savedBest);
    
    return () => clearAllTimeouts();
  }, []);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setActiveColor(null);
  };

  const addTimeout = (callback, delay) => {
    const id = setTimeout(callback, delay);
    timeoutsRef.current.push(id);
    return id;
  };

  const playSequence = useCallback((currentSequence, currentRound) => {
    setGameState(GAME_STATES.SHOWING_SEQUENCE);
    setPlayerIndex(0);
    clearAllTimeouts();

    const speed = getPlaybackSpeed(currentRound);

    currentSequence.forEach((color, index) => {
      addTimeout(() => {
        setActiveColor(color);
        playTone(color, speed - 100);
      }, index * speed);

      addTimeout(() => {
        setActiveColor(null);
      }, index * speed + (speed - 100));
    });

    addTimeout(() => {
      setGameState(GAME_STATES.PLAYER_TURN);
    }, currentSequence.length * speed + 200);
  }, []);

  const startGame = () => {
    clearAllTimeouts();
    const newColor = getRandomColor();
    const initialSequence = [newColor];
    
    setSequence(initialSequence);
    setRound(1);
    setGameState(GAME_STATES.SHOWING_SEQUENCE);
    
    addTimeout(() => {
      playSequence(initialSequence, 1);
    }, 500);
  };

  const endGame = () => {
    setGameState(GAME_STATES.GAME_OVER);
    clearAllTimeouts();
    playTone(COLORS[1], 500);
    
    setTimeout(() => playTone(COLORS[2], 500), 50);

    const newBest = Math.max(bestScore, round - 1);
    if (newBest > bestScore) {
      setBestScore(newBest);
      localStorage.setItem("simon-best", newBest.toString());
    }
  };

  const handlePlayerClick = (color) => {
    if (gameState !== GAME_STATES.PLAYER_TURN) return;

    setActiveColor(color);
    playTone(color, 200);
    addTimeout(() => setActiveColor(null), 200);

    if (color !== sequence[playerIndex]) {
      endGame();
      return;
    }

    const nextIndex = playerIndex + 1;
    setPlayerIndex(nextIndex);

    if (nextIndex === sequence.length) {
      setGameState(GAME_STATES.SHOWING_SEQUENCE);
      const nextRound = round + 1;
      setRound(nextRound);
      
      const newSequence = [...sequence, getRandomColor()];
      setSequence(newSequence);

      addTimeout(() => {
        playSequence(newSequence, nextRound);
      }, 1000);
    }
  };

  const getStatusMessage = () => {
    switch (gameState) {
      case GAME_STATES.IDLE:
        return "Press Start to play";
      case GAME_STATES.SHOWING_SEQUENCE:
        return "Watch the sequence...";
      case GAME_STATES.PLAYER_TURN:
        return <span className="highlight">Your turn!</span>;
      case GAME_STATES.GAME_OVER:
        return <span className="error">Game Over!</span>;
      default:
        return "";
    }
  };

  const isInputDisabled = gameState !== GAME_STATES.PLAYER_TURN;

  return (
    <div className="game-board">
      <h1 className="game-title">SIMON SAYS</h1>
      
      <ScoreBoard round={round} bestScore={bestScore} />

      <div className="simon-grid">
        {COLORS.map((color) => (
          <SimonButton
            key={color}
            color={color}
            isActive={activeColor === color}
            disabled={isInputDisabled && gameState !== GAME_STATES.IDLE}
            onClick={handlePlayerClick}
          />
        ))}
      </div>

      <div className="controls">
        <div className="status-message">
          {getStatusMessage()}
        </div>
        
        {(gameState === GAME_STATES.IDLE || gameState === GAME_STATES.GAME_OVER) && (
          <button className="start-btn" onClick={startGame}>
            {gameState === GAME_STATES.GAME_OVER ? "Try Again" : "Start Game"}
          </button>
        )}
      </div>
    </div>
  );
};

export default SimonGame;
