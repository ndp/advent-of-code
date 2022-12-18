// Copyright (c) 2022
import {readFileSync} from 'fs'

const cubes =
  readFileSync('./data.txt')
    .toString()
    .split('\n')
    .filter(line => !!line)

const cubesHash = cubes
  .reduce((acc, cube) => {
    acc[cube] = true
    return acc
  }, {} as Record<string, boolean>)


const exposedSides =
  cubes
    .map(cube => {
      return adjacentCubes(cube)
        .filter( a => !cubesHash[a])
        .length
    })
    .reduce((a,c) => a + c)

console.log({exposedSides})


function adjacentCubes(cube): Array<string> {
  const cubeDims = cube.split(',').map(v => Number(v))

  const transforms =[
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
  ]

  return transforms
    .map(tr =>
      tr.map((tt, i) => String(tt + cubeDims[i]))
        .join(','))
}
