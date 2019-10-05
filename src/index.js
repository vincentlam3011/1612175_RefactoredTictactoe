import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import ticTacToeApp from './Reducer/reducer';
import GameBoard from './Container/container';

// import Game from './Component/game';
import './index.css';
import * as serviceWorker from './serviceWorker';

const store = createStore(ticTacToeApp);

render(
  <Provider store={store}>
    <GameBoard />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
