import { connect } from 'react-redux';
import { clickSquare, goTo, sortList, restart } from '../Action/action';
import Game from '../Component/game';

const mapStateToProps = state => {
  console.log(state);
  return state;
};

const mapDispatchToProps = dispatch => {
  return {
    onSqrClick: i => {
      dispatch(clickSquare(i));
    },
    goTo: step => {
      dispatch(goTo(step));
    },
    sort: () => {
      dispatch(sortList());
    },
    restart: () => {
      dispatch(restart());
    }
  };
};

const GameBoard = connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);

export default GameBoard;
