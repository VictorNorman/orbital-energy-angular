import { totalOrbitalEnergy, energyComponents } from "../orbitalEnergies";
import type { EnergyComponents, Orbital } from "../types";

export function computeEnergiesForDyn23OrFauss(
  matName: string,
  matrix: number[][],
  orbs: Orbital[],
  atomicNumber: number,
): EnergyComponents {
  const totalEnergies = totalOrbitalEnergy(atomicNumber, orbs, matrix);
  const energyComps = energyComponents(atomicNumber, orbs, matrix);
  return {
    matrix: matName,
    t_i: energyComps.t_i,
    v_i: energyComps.v_i,
    v_ij: energyComps.v_ij,
    capV_ij: energyComps.capV_ij,
    totalEnergies,
  };
}
