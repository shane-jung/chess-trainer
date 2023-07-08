import { useEffect } from "react";
import { useSelector } from "react-redux";

import decodeFEN from "../FENtoBoard";
import { checkGameOver } from "../utils";

import useAction, { setBoardAction, setMoveNumberAction } from "../actions";
import { selectFen, selectHistory, selectMoveNumber, selectStringFEN } from "../slices/game";

import Grid from "@mui/material/Grid";
import Square from "./Square";

const ChessBoard = () => {
  const fen = useSelector(selectFen);
  const stringFEN = useSelector(selectStringFEN);
  const setBoard = useAction(setBoardAction);
  const moveNumber = useSelector(selectMoveNumber)
  const setMoveNumber = useAction(setMoveNumberAction);
  const history = useSelector(selectHistory);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "ArrowLeft") {
        setMoveNumber(moveNumber, moveNumber-1, history);
      } else if (e.key === "ArrowRight") {
        setMoveNumber(moveNumber, moveNumber+1, history);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setMoveNumber, history, moveNumber]);

  useEffect(() => {
    setBoard(decodeFEN(stringFEN));
  }, [setBoard]);

  useEffect(() => {
    if (checkGameOver(fen)) {
      console.log("GAME OVER");
      return;
    }
  }, [fen]);

  return (
    <Grid
      container
      spacing={0}
      id="board"
      draggable="false"
      direction="row-reverse"
    >
      {Array.from(new Array(8)).map((_, rank) => (
        <Grid key={`${rank}`} container item xs={12} spacing={0}>
          {8 - rank}
          {Array.from(new Array(8)).map((_, file) => (
            <Grid key={`${file}`} item xs={1}>
              <Square index={63-(rank*8 + (7-file))} />
              {rank === 7 ? file + 1 : ""}
            </Grid>
          ))}
        </Grid>
      ))}
    </Grid>
  );
};

export default ChessBoard;
