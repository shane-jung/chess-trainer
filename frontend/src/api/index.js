import axios from "axios";

async function getGame(id) {
  return await axios.get(`api/games/${id}`);
}

async function getEngineEvaluation(position) {
  return await axios.get(`api/engine/?fen=${position}`);
}
async function postMoves(moves) {
console.log(moves);
  return await axios.post(`api/engine`, ["e2e4", "e7e5"]);
}

export { getGame, getEngineEvaluation, postMoves };
