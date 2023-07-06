import Paper from "@mui/material/Paper";
import Piece from "./Piece";

import { useSelector } from "react-redux";
import { selectFen, selectLegalMoves } from "./slices/game";

const Square = ({ index }) => {
  const {board} = useSelector(selectFen);
  const legalMoves = useSelector(selectLegalMoves);

  return (
    <Paper
      draggable="false"
      className= {"square" + (legalMoves.includes(index) ? " legal" : "")}
      style={{
        position: "relative",
        height: "70px",
        width: "70px",
        backgroundColor: ((index % 8) + (Math.floor(index/8))) % 2 ? "#eeeed2" : "#769656",
      }}
    >
      {board[index] !== 0 && (
        <Piece piece={board[index]} index={index} />
      )}  
    </Paper>
  );
};

export default Square;
