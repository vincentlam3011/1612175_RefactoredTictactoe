import { CLICK_SQUARE, RESTART, GO_TO_MOVE, SORT_LIST } from '../Action/action';
import { gameWon } from '../Component/game';

const boardSize = 20;
let gameOver = false;
const initState = {
  history: [
    {
      squares: Array(boardSize * boardSize).fill(null),
      latestMoveSqr: null
    }
  ],
  isXNext: true,
  stepNum: 0,
  isAsc: true
};

function ticTacToeApp(state = initState, action) {
  switch (action.type) {
    case SORT_LIST: {
      const history = state.history.slice(0, state.stepNum + 1);
      if (history.length === 1) {
        return state;
      }
      return { ...state, isAsc: !state.isAsc };
    }
    case GO_TO_MOVE: {
      if (action.step !== state.history.length) {
        gameOver = false;
      }
      return {
        ...state,
        history: state.history.slice(0, action.step + 1),
        stepNum: action.step,
        isXNext: !(action.step % 2)
      };
    }
    case CLICK_SQUARE: {
      const history = state.history.slice(0, state.stepNum + 1);
      const current = history[state.stepNum];
      const squares = current.squares.slice();
      if (squares[action.i]) return state;
      console.log(gameWon(current.latestMoveSqr, current.squares));
      if (gameWon(current.latestMoveSqr, current.squares)) gameOver = true;
      if (gameOver) return state;
      squares[action.i] = state.isXNext ? 'X' : 'O';
      return {
        ...state, // history: [...state.history, { squares: squares, latestMoveSqr: action.i }],
        history: history.concat([{ squares, latestMoveSqr: action.i }]),
        isXNext: !state.isXNext,
        stepNum: history.length
      };
    }
    case RESTART: {
      return {
        ...state,
        history: [
          {
            squares: Array(boardSize * boardSize).fill(null),
            latestMoveSqr: null
          }
        ],
        isXNext: true,
        stepNum: 0,
        isAsc: true
      };
    }
    default: {
      return state;
    }
  }
}

export default ticTacToeApp;
