import {Blizzard} from "./Blizzard";

class RowOrColumn {
  readonly blizzards: Array<Blizzard> = []

  addBlizzard(b: Blizzard) {
    this.blizzards.push(b)
  }

  blizzardsDuring(minute) {
    return new Set(this.blizzards.map(b => b.positionAtMinute(minute)))
  }
}

class Row extends RowOrColumn {

  constructor() {
    super();
  }

  isBlizzardy({column, minute}: { column: number, minute: number }) {
    return this.blizzards
      .some(b => b.positionAtMinute(minute).column === column)
  }
}

class Column  extends RowOrColumn {

  constructor() {
    super();
  }

  isBlizzardy({row, minute}: { row: number, minute: number }) {
    return this.blizzards
      .some(b => b.positionAtMinute(minute).row === row)
  }
}

export class Grid {
  rows: Array<Row>
  columns: Array<Column>

  constructor(readonly width, readonly height) {
    this.rows = []
    for (let r = 0; r < height; r++)
      this.rows.push(new Row())

    this.columns = []
    for (let c = 0; c < width; c++)
      this.columns.push(new Column())
  }

  addBlizzard({row, column, blizzardChar}) {
    const b = new Blizzard(row, column, this.width, this.height, blizzardChar)
    if (b.isUpOrDown())
      this.columns[column].addBlizzard(b)
    else
      this.rows[row].addBlizzard(b)
  }

  draw(minute = 0) {
    let s = `Minute #${minute}\n`
    for (let c = 0; c < this.width + 2; c++) s += '#'
    s += '\n'

    for (let r = 0; r < this.height; r++) {
      s += '#'
      for (let c = 0; c < this.width; c++) {
        if (this.columns[c].isBlizzardy({row: r, minute}))
          s += '|'
        else if (this.rows[r].isBlizzardy({column: c, minute}))
          s += '-'
        else
          s += '.'
      }
      s += '#'
      s += '\n'
    }
    for (let c = 0; c < this.width + 2; c++) s += '#'
    s += '\n'

    return s
  }

}
