import "./styles/App.css";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import ChessBoard from "./components/ChessBoard";

import { selectHistory, selectMoveNumber, selectStringFEN } from "./slices/game";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { getGame, getEngineEvaluation, postMoves } from "./api";

import { parsePGN } from "./utils";
import useAction, { loadGameAction } from "./actions";
import { Grid } from "@mui/material";

function App() {
  const history = useSelector(selectHistory);
  // const loadGame = useAction(loadGameAction);

  const stringFEN = useSelector(selectStringFEN);
  const moveNumber = useSelector(selectMoveNumber);

  const [evaluation, setEvaluation] = useState(0);

  // useEffect(() => {
  //   getGame(2).then((response) => {
  //     const moves = parsePGN(response.data.PGN);
  //     loadGame(moves);
  //     console.log(response.data.PGN);
  //   });
  // }, [loadGame]);

  useEffect(() => {
    console.log("stringFEN", stringFEN);
    getEngineEvaluation(stringFEN).then((response) => {
      setEvaluation(response.data?.value);
    });
  }, [stringFEN]);

  return (
    <Container>
      <CssBaseline />
      <h1>Move Number: {moveNumber} </h1>
      <h3>Evaluation: {evaluation / 100.0}</h3>

      <Grid container spacing={2}>
        <Grid item xs={10}>
          <ChessBoard />
        </Grid>
        <Grid item xs={2}>
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
