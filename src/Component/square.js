import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import '../index.css';

function Square(props) {
  return (
    <button type="button" className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

export default Square;
