import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { postMoves } from "../api";
import { moveToUCI } from "../utils";

const setBoardAction = (board) => {
  return {
    type: "game/setBoard",
    payload: board,
  };
};

const movePieceAction = ({ from, to }) => {
  return {
    type: "game/movePiece",
    payload: { from, to },
  };
};

const setActivePieceAction = (piece) => {
  return {
    type: "game/setActivePiece",
    payload: piece,
  };
};

const setTurnAction = (turn) => {
  return {
    type: "game/setTurn",
    payload: turn,
  };
};

const rotateTurnAction = () => {
  return {
    type: "game/rotateTurn",
  };
};

const setLegalMovesAction = (moves) => {
  return {
    type: "game/setLegalMoves",
    payload: moves,
  };
};

const setFenAction = (fen) => {
  return {
    type: "game/setFen",
    payload: fen,
  };
};

const recordMoveAction = (move, notation, capturedPiece) => {
  return {
    type: "game/recordMove",
    payload: { move, notation, capturedPiece },
  };
};

const setMoveNumberAction = (oldMoveNumber, newMoveNumber, history) => {
  const moveNumber = Math.max(0, Math.min(newMoveNumber, history.length));
  return {
    type: "game/setMoveNumber",
    payload: moveNumber,
  };
};

const handleMoveAction = ({from, to}) => {
  return {
    type: "game/handleMove",
    payload: { from, to },
  };
};

const loadGameAction = (moves) => {
  return {
    type: "game/loadGame",
    payload: moves,
  };
};

const useAction = (action) => {
  const dispatch = useDispatch();
  return useCallback(
    (...args) => dispatch(action(...args)),
    [dispatch, action]
  );
};

export default useAction;

export {
  setBoardAction,
  movePieceAction,
  setActivePieceAction,
  setTurnAction,
  setLegalMovesAction,
  rotateTurnAction,
  setFenAction,
  recordMoveAction,
  setMoveNumberAction,
  handleMoveAction,
  loadGameAction,
};
