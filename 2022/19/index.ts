import {readFileSync} from 'fs'
import {Blueprint} from "./Blueprint";
import {Simulation} from "./Simulation";

const blueprints =
  readFileSync('./input-sample.txt')
    .toString()
    .split('\n')
    .filter(line => !!line)
    .map(line => new Blueprint(line))


const sim = new Simulation(blueprints[0])

sim.start()

