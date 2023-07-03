import { useState, useEffect } from "react";

import pieces from "./pieces";


import { useSelector } from "react-redux";
import { selectBoard, selectActivePiece, selectLegalMoves } from "./slices/game";
import useAction, { setActivePieceAction, movePieceAction, setLegalMovesAction } from "./actions";
import calculateLegalMovesForPiece, {calculateLegalMoves, calculateKingMoves} from "./calculateMoves";

export default function Piece({ piece: initial, index }) {
  const board = useSelector(selectBoard);

  const activePiece = useSelector(selectActivePiece);
  const setActivePiece = useAction(setActivePieceAction);

  const movePiece = useAction(movePieceAction);

  const legalMoves = useSelector(selectLegalMoves);
  const setLegalMoves = useAction(setLegalMovesAction);

  const [color, setColor] = useState(0b10000 & initial ? "w" : "b");
  const [type, setType] = useState(
    Object.keys(pieces).find((key) => pieces[key] === initial)
  );
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setColor(0b10000 & initial ? "w" : "b");
    setType(Object.keys(pieces).find((key) => pieces[key] === initial));
  }, [initial]);

  const handleMouseDown = (event) => {
    event.preventDefault();
    setActivePiece(index);
    setIsDragging(true);
    const piece = event.target.getBoundingClientRect();
    setOffset({
      x: piece.left + piece.width / 2,
      y: piece.top + piece.height / 2,
    });
    setPosition({
      x: event.clientX - piece.left - piece.width / 2,
      y: event.clientY - piece.top - piece.height / 2,
    });
    setLegalMoves(calculateLegalMovesForPiece(board, index));
    calculateLegalMoves(board, "w");
    calculateKingMoves(board, index);
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;

    setPosition({
      x: -offset.x + event.clientX,
      y: -offset.y + event.clientY,
    });
    const x = event.clientX;
    const y = event.clientY;
    const board = document.getElementById("board").getBoundingClientRect();
    const rank = Math.floor((y - board.top) / 70);
    const file = Math.floor((x - board.left) / 70);
    if (rank < 0 || rank > 7 || file < 0 || file > 7) {
      return;
    }
    // const squares = document.getElementsByClassName("square");

    // squares[rank * 8 + file].classList.add("dragover");
  };

  const handleMouseUp = (event) => {
    setIsDragging(false);

    const x = event.clientX;
    const y = event.clientY;
    const boardRect = document.getElementById("board").getBoundingClientRect();
    const rank = Math.floor((y - boardRect.top) / 70);
    const file = Math.floor((x - boardRect.left) / 70);

    if (!legalMoves.includes(rank * 8 + file)) {
      setPosition({ x: 0, y: 0 });
      return;
    }
    movePiece(index, rank*8+file);

    // setBoard((prev) => {
    //   return prev.map((element, i) => {
    //     if (index === i) return 0;
    //     if (i === rank * 8 + file) {
    //       return newElement;
    //     }
    //     return element;
    //   });
    // });
  };

  return (
    <img
      style={{ left: position.x, top: position.y }}
      className={"piece" + (activePiece === index ? " active" : "")}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      src={`pieces/${color.toLowerCase()}${type.toUpperCase()}.svg`}
      alt="Chess Piece"
    />
  );
}
