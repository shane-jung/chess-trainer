import { useCallback } from "react";
import { useDispatch } from "react-redux";

const setBoardAction = (board) => {
  return {
    type: "game/setBoard",
    payload: board,
  };
};

const movePieceAction = ({from, to}) => {
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

const setFenAction = (FEN) => {
  return {
    type: "game/setFen",
    payload: FEN,
  };
};

const recordMoveAction = (move, notation, capturedPiece) => {
  return {
    type: "game/recordMove",
    payload: {move, notation, capturedPiece},
  };
};

const setMoveNumberAction = (moveNumber) => {
  return {
    type: "game/setMoveNumber",
    payload: moveNumber,
  };
}

const handleMoveAction = (from, to) => {
  return {
    type: "game/handleMove",
    payload: {from, to},
  };
}

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
