import "./App.css";

import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function TurnInfo({ turn, isActive }) {
  return (
    <div className={`turn-indicator ${isActive ? `active` : ""}`}>{turn}</div>
  );
}

function Board({ squares, xIsNext, onPlay }) {
  function handleClick(i) {
    if (winnerIs(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = winnerIs(squares);
  const boardFull = squares.every((Square) => Square !== null);
  let status;
  if (winner) {
    status = winner;
  } else if (boardFull) {
    status = "Empate";
  } else {
    status = "Siguiente turno " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="title">TIC TAC TOE</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
      <div className="turn">
        <TurnInfo turn={"X"} isActive={xIsNext} />
        <TurnInfo turn={"O"} isActive={!xIsNext} />
      </div>

      {(winner || boardFull) && (
        <div className="winner">
          <div className="text">
            <h2>{winner ? "Ganó" : "Empate"}</h2>
            <div className="win">{winner && <Square value={winner} />}</div>
            <footer>
              <button onClick={() => onPlay(Array(9).fill(null), true)}>
                Empezar de nuevo
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function historyPlay(nextSquares, reset = false) {
    if (reset) {
      setHistory([nextSquares]);
      setCurrentMove(0);
    } else {
      const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1);
    }
  }

  function returnTo(nextMove) {
    setCurrentMove(nextMove);
  }
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Ir a movimiento " + move;
    } else {
      description = "Ir al inicio del juego";
    }
    return (
      <li key={move}>
        <button className="historial" onClick={() => returnTo(move)}>
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={historyPlay}
        />
      </div>
      <div className="game-info">
        <ol>Historial{moves}</ol>
      </div>
    </div>
  );
}

function winnerIs(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
