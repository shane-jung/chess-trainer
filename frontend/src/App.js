import "./styles/App.css";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import ChessBoard from "./ChessBoard";

import { selectHistory } from "./slices/game";
import { useSelector } from "react-redux";
import { useEffect } from "react";

import axios from "axios";
import { parsePGN } from "./utils";
import useAction, {loadGameAction} from "./actions";

function App() {
  const history = useSelector(selectHistory);
  const loadGame = useAction(loadGameAction);


  useEffect( ()=>{
    async function getGame() {
      const id = 2;
      const response = await axios.get(`api/games/${id}`);
      return response.data;
    }
    getGame().then((data) => {
      const moves = parsePGN(data.PGN);
      loadGame(moves);
      console.log(data.PGN)
    });
  }, [])
  return (
    <Container>
      <CssBaseline />
      <ChessBoard />
      <ol>
        {history.map((move, index) =>
          (index % 2 ==0) ? (
            <li key={index}>
              <span>{move.notation}</span>
            </li>
          ) : (
            <span key={index}>{move.notation}</span>
          )
        )}
      </ol>
    </Container>
  );
}

export default App;


