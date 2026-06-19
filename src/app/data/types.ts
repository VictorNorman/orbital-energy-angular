export interface ElementType {
  name: string;
  symbol: string;
  number: number;
  aMass: number; // its units are amu or g/mol (These two units are equal)
  amassunc: string; // These values should be added right next to the "aMass"above (on the same line)
  eConfig: string; // e.g., "1s2 2s2 2p1"
  density: string; // its units are either g/mL or g/L (Elements 1,2,7,8,9,10,17,18,36,54 and 86 are g/L, all others are g/mL)
  meltingPoint: string; // its unit is K
  boilingPoint: string; // its unit is K
  oxidationStates: string;
  electronegativityPauling: string;
  electronegativityTandO: string;
  firstIonizationEnergy: string; // its unit is eV
  valenceAtomicRadiusRDK: string; // its unit is ...
  valenceAtomicRadiusClement: string; // its unit is pm
  R001AtomicRadius: string; // its unit is pm
  vanderWallRadius: string; // its unit is pm
  metallicRadius: string; // its unit is pm
  covalentRadius: string; // its unit is pm
  valenceEffectiveNuclearChargeRDK: string;
  valenceEffectiveNuclearChargeGuerra: string;
  electricalConductivity: string; // its unit is S/m
  thermalConductivity: string; // its unit is W/(mK)
  crystallineStructure: string; 
}

// Holds information calculated from element, matrix,
// values in matrix (if custom). Units are in hartrees.
export interface EnergyComponents {
  matrix: string;
  v_i: number[];
  t_i: number[];
  v_ij: number[][];
  capV_ij: number[][];
  totalEnergies: number[];
}

export interface Orbital {
  level: number;
  sOrP: string;
  numElectrons: number;
}

export const eLevels = ["1s", "2s", "2p", "3s", "3p", "4s"];
// max # of electrons in each orbital.
export const FULL_ORBITAL_CTS = [2, 2, 6, 2, 6, 2];
// just the first digits from the orbitals.
export const LEVELS = [1, 2, 2, 3, 3, 4];
