import {asScoord, Scoord} from "../23/scoord";

export type BlizzardChar = '<' | '>' | 'v' | '^'

export class Blizzard {

  private increment: number;

  constructor(readonly initialRow,
              readonly initialColumn,
              readonly width,
              readonly height,
              readonly blizzardChar: BlizzardChar) {
    // '#....>.#'
    // the first '#' is at zero
    // the last '#' is at 7
    // width = 6 (does not count edges)
    // initial position is 5
    this.increment = blizzardChar == '<' || blizzardChar == '^' ? -1 : 1
  }

  isUpOrDown() {
    return this.blizzardChar == '^' || this.blizzardChar == 'v'
  }

  positionAtMinute(minute: number): { column: number, row: number } {
    if (this.isUpOrDown()) {
      return {
        row: (this.initialRow + this.increment * minute + this.height) % this.height,
        column: this.initialColumn
      }
    } else {
      return {
        row: this.initialRow,
        column: (this.initialColumn + minute * this.increment + this.width) % this.width
      }
    }
  }
}
