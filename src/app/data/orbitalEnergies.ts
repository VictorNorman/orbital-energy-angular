import { type Orbital } from "./types";

export function computeOrbitals(eConfigStr: string): Orbital[] {
  const res: Orbital[] = [];
  const groups = eConfigStr.split(" ");
  for (const group of groups) {
    const re = /(\d+)([spdf])(\d+)|(predicted)/;
    const matches = group.match(re)!;
    // This check is for when the eConfig contains (predicted): skip over it.
    if (!matches[1]) {
      continue;
    }
    res.push({
      level: Number(matches[1]),
      sOrP: matches[2],
      numElectrons: Number(matches[3]),
    });
  }
  return res;
}

// compute the orbital energies and the total. The result is an array of numbers:
// total energy, followed by energies for each orbital.
export function totalOrbitalEnergy(atomicNumber: number, orbitalList: Orbital[], mx: number[][]) {
  let energy = 0;
  let energyArray = [];
  for (let i = 0; i < orbitalList.length; i++) {
    let n_i = orbitalList[i].level;
    let N_i = orbitalList[i].numElectrons;
    let Z_i = atomicNumber;
    for (let j = 0; j < orbitalList.length; j++) {
      Z_i -= (orbitalList[j].numElectrons - (i === j ? 1 : 0)) * mx[i][j];
    }
    energyArray.push(0 - (Z_i * Z_i) / (2 * n_i * n_i));
    energy -= N_i * ((Z_i * Z_i) / (2 * n_i * n_i));
  }
  energyArray = [energy, ...energyArray];
  return energyArray;
}

interface EnergyComponentsReturnType {
  t_i: number[];
  v_i: number[];
  v_ij: number[][];
  capV_ij: number[][];
}

export function energyComponents(atomicNumber: number, orbs: Orbital[], mx: number[][]) {
  let result: EnergyComponentsReturnType = {
    t_i: [],
    v_i: [],
    v_ij: [],
    capV_ij: [],
  };

  const Zlst = computeZis(atomicNumber, orbs, mx);

  for (let i = 0; i < orbs.length; i++) {
    let n_i = orbs[i].level;
    result.t_i.push((Zlst[i] * Zlst[i]) / (2 * n_i * n_i));
    result.v_i.push(0 - (atomicNumber * Zlst[i]) / (n_i * n_i));
  }

  for (let i in Zlst) {
    const n_i = orbs[i].level;
    const capV_js: number[] = [];
    const v_js: number[] = [];
    for (let j in Zlst) {
      const n_j = orbs[j].level;
      v_js.push((Zlst[i] * mx[i][j]) / (n_i * n_i));
      capV_js.push(
        (Zlst[i] * mx[i][j]) / (n_i * n_i) + (Zlst[j] * mx[j][i]) / (n_j * n_j)
      );
    }
    result.v_ij.push(v_js);
    result.capV_ij.push(capV_js);
  }
  return result;
}

export function computeZis(atomicNumber: number, orbsList: Orbital[], mx: number[][]) {
  let Zlst = [];
  for (let i = 0; i < orbsList.length; i++) {
    let Z_i = atomicNumber;
    for (let j = 0; j < orbsList.length; j++) {
      Z_i -= (orbsList[j].numElectrons - (i === j ? 1 : 0)) * mx[i][j];
    }
    Zlst.push(Z_i);
  }
  return Zlst;
}
