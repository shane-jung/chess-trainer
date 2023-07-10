import "./styles/App.css";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";

import {
  selectFen,
  selectHistory,
  selectMoveNumber,
  selectStringFen,
} from "./slices/game";

import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";

import { getEngineEvaluation } from "./api";

import fenToPosition from "./fenToPosition";
import useAction, {
  handleMoveAction,
  setFenAction,
  setMoveNumberAction,
} from "./actions";
import { Grid } from "@mui/material";

import "chessboard-element";
import calculateLegalMovesForPiece from "./calculateMoves";

function App() {
  const boardRef = useRef(null);
  const fen = useSelector(selectFen);
  const history = useSelector(selectHistory);
  const moveNumber = useSelector(selectMoveNumber);

  const [evaluation, setEvaluation] = useState(0);

  const stringFen = useSelector(selectStringFen);
  const setFen = useAction(setFenAction);

  const handleMove = useAction(handleMoveAction);
  const setMoveNumber = useAction(setMoveNumberAction);

  const [legalMoves, setLegalMoves] = useState([]);


  useEffect(()=>{
    const element = boardRef.current;
    element.position = fen.position;
  }, [fen])

  useEffect(() => {
    getEngineEvaluation(stringFen).then((response) => {
      // setEvaluation(response.data?.value);
      console.log(response.data);
    });
    setFen(fenToPosition(stringFen));
  }, [setFen, stringFen]);

  useEffect(() => {
    const element = boardRef.current;

    const handleDrop = (e) => {
      const { source, target, piece, newPosition, orientation, setAction } =
        e.detail;
      if (!legalMoves.includes(target)) return setAction("snapback");
      handleMove({ from: source, to: target });
    };

    const handleDragStart = (e) => {
      const { source, piece, position, orientation } = e.detail;
      setLegalMoves(calculateLegalMovesForPiece(fen, source));
    };

    element.addEventListener("drop", handleDrop);
    element.addEventListener("drag-start", handleDragStart);

    return () => {
      element.removeEventListener("drag-start", handleDragStart);
      element.removeEventListener("drop", handleDrop);
    };
  }, [fen, setLegalMoves, handleMove, legalMoves]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "ArrowLeft") setMoveNumber(moveNumber, moveNumber - 1, history);
      else if (e.key === "ArrowRight") setMoveNumber(moveNumber, moveNumber + 1, history)
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setMoveNumber, history, moveNumber]);

  return (
    <Container>
      <CssBaseline />
      <h1>Move Number: {moveNumber} </h1>
      <h3>Evaluation: {evaluation / 100.0}</h3>

      <Grid container spacing={2}>
        <Grid item xs={7}>
          <chess-board
            id="chessboard"
            position="start"
            orientation={"white"}
            draggable-pieces
            ref={boardRef}
          />
        </Grid>

        <Grid item xs={5}>
          <ol>
            {history.map((move, index) =>
              index % 2 === 0 ? (
                <li key={index}>
                  <span>{move.notation}</span>
                </li>
              ) : (
                <span key={index}>{move.notation}</span>
              )
            )}
          </ol>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
