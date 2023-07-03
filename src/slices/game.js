import {createSlice} from '@reduxjs/toolkit';


const gameReducer = createSlice({
    name: 'game',
    initialState : {
        turn: 'w',
        board: Array(64).fill(0),
        selected: null,
        legalMoves: [],
        history: [],
        moveNumber: 0,
        FEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
        activePiece: null,
    },
    reducers: {
        setBoard: (state, action) => {
            state.board = action.payload;
        },
        movePiece: (state, action) => {
            console.log(action.payload);
            state.board[action.payload.to] = state.board[action.payload.from];
            state.board[action.payload.from] = 0;
            state.turn = state.turn === 'w' ? 'b' : 'w';
            state.selected = null;
            state.legalMoves = [];
        },
        setTurn: (state, action) => {
            state.turn = action.payload;
        },
        setSelected: (state, action) => {
            state.selected = action.payload;
        },
        setActivePiece: (state, action) => {
            state.activePiece = action.payload;
        },
        setLegalMoves: (state, action) => {
            state.legalMoves = action.payload;
        }

    }
});


export const selectBoard = state => state.game.board;
export const selectTurn = state => state.game.turn;
export const selectSelected = state => state.game.selected;
export const selectLegalMoves = state => state.game.legalMoves;
export const selectHistory = state => state.game.history;
export const selectMoveNumber = state => state.game.moveNumber;
export const selectFEN = state => state.game.FEN;
export const selectActivePiece = state => state.game.activePiece;


export const {setBoard, setTurn, setSelected, setLegalMoves} = gameReducer.actions;

export default gameReducer.reducer;
