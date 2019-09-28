import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, ButtonGroup } from 'reactstrap';
import { Badge } from 'reactstrap';
import { UncontrolledAlert } from 'reactstrap';
import './index.css';
// import App from './App';
import * as serviceWorker from './serviceWorker';

const boardSize = 20;
let gameOver = false;

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick} >
            {props.value}
        </button>
    )
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        )
    }

    render() {
        let gameBoard = [];
        for (let i = 0; i < boardSize; i++) {
            let row = [];
            for (let j = 0; j < boardSize; j++) {
                row.push(this.renderSquare(i * boardSize + j));
            }
            gameBoard.push(<div className="board-row">{row}</div>)
        }

        return (
            <div>{gameBoard}</div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = { history: [{ squares: Array(boardSize * boardSize).fill(null), latestMoveSqr: null }], isXNext: true, stepNum: 0, isAsc: true, };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNum + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (squares[i]) return;
        if (gameOver) return;
        squares[i] = this.state.isXNext ? 'X' : 'O';

        this.setState({ history: history.concat([{ squares: squares, latestMoveSqr: i }]), isXNext: !this.state.isXNext, stepNum: history.length, });
    }

    handleSort() {
        const history = this.state.history.slice(0, this.state.stepNum + 1);
        if (history.length == 1) return;
        this.setState({ isAsc: !this.state.isAsc });
    }

    goTo(step) {
        this.setState({ stepNum: step, isXNext: (step % 2) === 0, });
    }

    render() {
        const isAsc = this.state.isAsc;
        const history = this.state.history;
        const current = history[this.state.stepNum];
        let winner = gameWon(current.latestMoveSqr, current.squares);

        let moves = history.map((step, move) => {
            const row = Math.floor(step.latestMoveSqr / boardSize);
            const col = step.latestMoveSqr - row;
            const desc = move ? "Go to move #" + move + " (" + row + ", " + col + ")" : "Go to game start";
            return (
                <Button key={move} className={move === this.state.stepNum ? 'move-list-item-selected' : ''} onClick={() => { this.goTo(move) }} outline color="primary">{desc}</Button>
            );
        });

        if (!isAsc) {
            moves.reverse();
        }

        let status;
        let statusAlert;

        if (current.squares.includes(null)) {
            if (winner) {
                status = <Badge className="status-badge" color="primary">Winner: {winner}</Badge>;
                gameOver = true;
                statusAlert = <UncontrolledAlert color="success">The winner is player {winner}!</UncontrolledAlert>
            } else {
                status = <Badge className="status-badge" color="primary">Next player: {(this.state.isXNext ? 'X' : 'O')}</Badge>;
            }
        } else {
            status = <Badge className="status-badge" color="primary">Game draw!</Badge>;
            statusAlert = <UncontrolledAlert color="danger">Out of moves, please restart!</UncontrolledAlert>
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <br/>
                    <div>{statusAlert}</div>
                    <div> <Button color="success" onClick={() => this.handleSort()}>Sort {isAsc ? 'descending' : 'ascending'}</Button></div><br/>
                    <ButtonGroup vertical className="list">{moves}</ButtonGroup>
                </div>
            </div>
        )
    }
}

function checkVertically(square, squares) {
    var rowId = Math.floor(square / boardSize);
    var colId = square - rowId * boardSize;
    var track1 = []; var track2 = [];
    var curSqr = squares[square];
    var temp = (curSqr === 'X') ? 'O' : 'X';

    if (rowId === 0) track1.push(temp);
    for (var i = rowId - 1; i >= 0; i--) {
        if (squares[i * boardSize + colId] === null) { break; }
        else if (squares[i * boardSize + colId] === curSqr) {
            track1.push(squares[i * boardSize + colId]);
            if (track1.length === 5) { return curSqr; }
            if (i === 0) { track1.push(temp); }
        }
        else {
            track1.push(squares[i * boardSize + colId]);
            break;
        }
    }
    if (rowId === boardSize - 1) track2.push(temp);
    for (var i = rowId + 1; i < boardSize; i++) {
        if (squares[i * boardSize + colId] === null) { break; }
        else if (squares[i * boardSize + colId] === curSqr) {
            track2.push(squares[i * boardSize + colId]);
            if (track2.length === 5) { return curSqr; }
            if (i === boardSize - 1) { track2.push(temp); }
        }
        else {
            track2.push(squares[i * boardSize + colId]);
            break;
        }
    }
    if (countElement(track1, track2, curSqr) >= 5) {
        if (!isCleared(track1, curSqr) && !isCleared(track2, curSqr)) {
            return null;
        }
        return curSqr;
    }
}

function checkHorizontally(square, squares) {
    var rowId = Math.floor(square / boardSize);
    var colId = square - rowId * boardSize;
    var track1 = []; var track2 = [];
    var curSqr = squares[square];
    var temp = (curSqr === 'X') ? 'O' : 'X';

    if (colId === 0) track1.push(temp);
    for (var i = colId - 1; i >= 0; i--) {
        if (squares[rowId * boardSize + i] === null) { break; }
        else if (squares[rowId * boardSize + i] === curSqr) {
            track1.push(squares[rowId * boardSize + i]);
            if (track1.length === 5) { return curSqr; }
            if (i === 0) { track1.push(temp); }
        }
        else {
            track1.push(squares[rowId * boardSize + i]);
            break;
        }
    }
    if (colId === boardSize - 1) track2.push(temp);
    for (var i = colId + 1; i < boardSize; i++) {
        if (squares[rowId * boardSize + i] === null) { break; }
        else if (squares[rowId * boardSize + i] === curSqr) {
            track2.push(squares[rowId * boardSize + i]);
            if (track2.length === 5) { return curSqr; }
            if (i === boardSize - 1) { track2.push(temp); }
        }
        else {
            track2.push(squares[rowId * boardSize + i]);
            break;
        }
    }
    if (countElement(track1, track2, curSqr) >= 5) {
        if (!isCleared(track1, curSqr) && !isCleared(track2, curSqr)) {
            return null;
        }
        return curSqr;
    }
}

function checkDiagonallyTL_BR(square, squares) {
    var rowId = Math.floor(square / boardSize);
    var colId = square - rowId * boardSize;
    var track1 = []; var track2 = [];
    var curSqr = squares[square];
    var temp = (curSqr === 'X') ? 'O' : 'X';

    if (rowId === 0 || colId === 0) track1.push(temp);
    for (var i = rowId - 1, j = colId - 1; i >= 0, j >= 0; i-- , j--) {
        if (squares[i * boardSize + j] === null) { break; }
        else if (squares[i * boardSize + j] === curSqr) {
            track1.push(squares[i * boardSize + j]);
            if (track1.length === 5) { return curSqr; }
            if (i === 0 || j === 0) { track1.push(temp); }
        }
        else {
            track1.push(squares[i * boardSize + j]);
            break;
        }
    }
    if (rowId === boardSize - 1 || colId === boardSize - 1) track2.push(temp);
    for (var i = rowId + 1, j = colId + 1; i < boardSize, j < boardSize; i++ , j++) {
        if (squares[i * boardSize + j] === null) { break; }
        else if (squares[i * boardSize + j] === curSqr) {
            track2.push(squares[i * boardSize + j]);
            if (track2.length === 5) { return curSqr; }
            if (i === boardSize - 1 || j === boardSize - 1) { track2.push(temp); }
        }
        else {
            track2.push(squares[i * boardSize + j]);
            break;
        }
    }
    if (countElement(track1, track2, curSqr) >= 5) {
        if (!isCleared(track1, curSqr) && !isCleared(track2, curSqr)) {
            return null;
        }
        return curSqr;
    }
}

function checkDiagonallyTR_BL(square, squares) {
    var rowId = Math.floor(square / boardSize);
    var colId = square - rowId * boardSize;
    var track1 = []; var track2 = [];
    var curSqr = squares[square];
    var temp = (curSqr === 'X') ? 'O' : 'X';

    if (rowId === 0 || colId === boardSize - 1) track1.push(temp);
    for (var i = rowId - 1, j = colId + 1; i >= 0, j < boardSize; i-- , j++) {
        if (squares[i * boardSize + j] === null) { break; }
        else if (squares[i * boardSize + j] === curSqr) {
            track1.push(squares[i * boardSize + j]);
            if (track1.length === 5) { return curSqr; }
            if (i === 0 || j === boardSize - 1) { track1.push(temp); }
        }
        else {
            track1.push(squares[i * boardSize + j]);
            break;
        }
    }
    if (rowId === boardSize - 1 || colId === 0) track2.push(temp);
    for (var i = rowId + 1, j = colId - 1; i < boardSize, j >= 0; i++ , j--) {
        if (squares[i * boardSize + j] === null) { break; }
        else if (squares[i * boardSize + j] === curSqr) {
            track2.push(squares[i * boardSize + j]);
            if (track2.length === 5) { return curSqr; }
            if (i === boardSize - 1 || j === 0) { track2.push(temp); }
        }
        else {
            track2.push(squares[i * boardSize + j]);
            break;
        }
    }
    if (countElement(track1, track2, curSqr) >= 5) {
        if (!isCleared(track1, curSqr) && !isCleared(track2, curSqr)) {
            return null;
        }
        return curSqr;
    }
}

function gameWon(square, squares) {
    var vertically = checkVertically(square, squares);
    var horizontally = checkHorizontally(square, squares);
    var diagonallyTL_BR = checkDiagonallyTL_BR(square, squares);
    var diagonallyTR_BL = checkDiagonallyTR_BL(square, squares);

    if (vertically) {
        return vertically;
    }
    if (horizontally) {
        return horizontally;
    }
    if (diagonallyTL_BR) {
        return diagonallyTL_BR;
    }
    if (diagonallyTR_BL) {
        return diagonallyTR_BL;
    }
    return null;
}

function isCleared(arr, val) {
    return arr.every(function (item) {
        return item === val;
    });
}

function countElement(arr1, arr2, val) {
    var count = 1;
    arr1.forEach(function (element) {
        if (element === val) { count++ };
    });
    arr2.forEach(function (element) {
        if (element === val) { count++ };
    });
    return count;
}

ReactDOM.render(<Game />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();