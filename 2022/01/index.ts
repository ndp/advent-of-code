import * as fs from 'fs';

const totals = fs
  .readFileSync('./data.txt')
  .toString()
  .split('\n\n')
  .map(lines => lines.split('\n'))
  .map(a => a.reduce((a,x) => (Number(x)+a),0))
  .sort((a,b) => b-a)

console.log(totals[0] + totals[1] + totals[2])
