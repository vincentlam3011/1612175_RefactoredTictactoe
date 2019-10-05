export const CLICK_SQUARE = 'CLICK_SQUARE';
export const GO_TO_MOVE = 'GO_TO_MOVE';
export const SORT_LIST = 'SORT_LIST';
export const RESTART = 'RESTART';

export function clickSquare(i) {
  return { type: CLICK_SQUARE, i };
}

export function goTo(step) {
  return { type: GO_TO_MOVE, step };
}

export function sortList() {
  return { type: SORT_LIST };
}

export function restart() {
  return { type: RESTART };
}
