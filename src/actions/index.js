import { useCallback } from "react";
import { useDispatch } from "react-redux";

const setBoardAction = (board) => {
  return {
    type: "game/setBoard",
    payload: board,
  };
};

const movePieceAction = (from, to) => {
    return {
      type: "game/movePiece",
      payload: {from, to},
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

const setLegalMovesAction = (moves) => {
    return {
        type: "game/setLegalMoves",
        payload: moves,
    };
};


const useAction = (action) => {
  const dispatch = useDispatch();
  return useCallback((...args) => dispatch(action(...args)), [dispatch, action]);
};

export default useAction;

export { setBoardAction, movePieceAction, setActivePieceAction, setTurnAction, setLegalMovesAction};
