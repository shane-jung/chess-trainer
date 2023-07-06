import "./styles/App.css";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import ChessBoard from "./ChessBoard";

import { selectHistory } from "./slices/game";
import { useSelector } from "react-redux";

function App() {
  const history = useSelector(selectHistory);
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
