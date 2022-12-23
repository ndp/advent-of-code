//Facing is 0 for right (>), 1 for down (v), 2 for left (<), and 3 for up (^).
export enum Facing {
  right,
  down,
  left,
  up
}


export type State = {
  row: number
  column: number
  facing: Facing
}

