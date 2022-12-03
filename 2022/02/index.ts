import * as fs from 'fs'

const OpponentPlay = {
  'A': 'Rock' as const,
  'B': 'Paper' as const,
  'C': 'Scissors' as const
}

const MyPlay = {
  'X': 'Rock' as const,
  'Y': 'Paper' as const,
  'Z': 'Scissors' as const
}

const ShapeScore = {
  'Rock': 1,
  'Paper': 2,
  'Scissors': 3
}

type RPS = keyof typeof ShapeScore;

type Game = [keyof typeof OpponentPlay, keyof typeof MyPlay];

const games = fs
  .readFileSync('./games.txt')
  .toString()
  .split('\n')
  .map(line => line.split(/\s+/)) as Array<Game>;


const totalScore =
  games
    .map(g => score(g))
    .reduce((a, s) => a + s, 0)

console.log({ totalScore })

function score(game: Game) {
  const my = calcMyMove(game)
  const shapeScore = ShapeScore[my]
  const outcome = outcomeScore(OpponentPlay[game[0]], my)
  return shapeScore + outcome
}

function outcomeScore(opp: RPS, my: RPS) {
  if (opp === my)
    return 3;
  if (my === 'Rock' && opp === 'Scissors' ||
    my === 'Paper' && opp === 'Rock' ||
    my === 'Scissors' && opp == 'Paper')
    return 6
  return 0
}

function calcMyMove(game: Game): RPS {
  const opp = OpponentPlay[game[0]]

  const desiredOutcome = game[1]

  if (desiredOutcome === 'Y') // tie?
    return opp

  if (desiredOutcome === 'Z')  // win!
    if (opp === 'Rock') return 'Paper'
    else if (opp === 'Paper') return 'Scissors'
    else return 'Rock' // if (opp === 'Scissors')

  // Lose!
  if (opp === 'Rock') return 'Scissors'
  else if (opp === 'Paper') return 'Rock'
  else return 'Paper'
}
