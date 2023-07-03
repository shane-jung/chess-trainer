import Grid from "@mui/material/Grid";

import { useEffect, useState } from "react";

import FENtoBoard from "./FENtoBoard";
import Square from "./Square";

import useAction, { setBoardAction, setActivePieceAction } from "./actions";
import { selectBoard, selectActivePiece } from "./slices/game";
import { useSelector } from "react-redux";

const ChessBoard = () => {
  const [FEN] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");

  const board = useSelector(selectBoard);
  const setBoard = useAction(setBoardAction);

  const activePiece = useSelector(selectActivePiece);
  const setActivePiece = useAction(setActivePieceAction);

  useEffect(() => {
    setBoard([...FENtoBoard(FEN)]);
  }, [FEN, setBoard]);

  return (
    <Grid container spacing={0} id="board" draggable="false">
      {Array.from(new Array(8)).map((_, rank) => (
        <Grid key={`${rank}`} container item xs={12} spacing={0}>
          {Array.from(new Array(8)).map((_, file) => (
            <Grid key={`${file}`} item xs={1}>
              <Square index={rank * 8 + file} />
            </Grid>
          ))}
        </Grid>
      ))}
    </Grid>
  );
};

export default ChessBoard;
