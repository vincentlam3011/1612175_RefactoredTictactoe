import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import '../index.css';
import Square from './square';

const boardSize = 20;

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onSqrClick(i)}
      />
    );
  }

  render() {
    const gameBoard = [];
    for (let i = 0; i < boardSize; i += 1) {
      const row = [];
      for (let j = 0; j < boardSize; j += 1) {
        row.push(this.renderSquare(i * boardSize + j));
      }
      gameBoard.push(<div className="board-row">{row}</div>);
    }

    return <div>{gameBoard}</div>;
  }
}

export default Board;
