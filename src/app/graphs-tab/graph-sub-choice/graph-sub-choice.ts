import { Component, computed, input, model } from '@angular/core';

export const GUERRA_ORBITALS = ['1s','2s','2p','3s','3p','3d','4s','4p','4d','4f','5s','5p','5d','5f','6s','6p','6d','7s','7p'];
export const SLATER_ORBITALS = ['1s','2s','2p','3s','3p'];
export const RDK_ORBITALS = ['1s','2s','2p','3s','3p','4s'];
export const ALL_ORBITALS = GUERRA_ORBITALS;

export const ATOMIC_RAD_METHODS = [
  'Guerra (valence)','RDK (valence)','R0.001/Rahm','Van der Waals','Metallic','Covalent','Clementi','Ghosh'
];

const IONIZATION_ORDERS = ['1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th'];

type Method = 'guerra' | 'slater' | 'rdk';
const METHODS: Method[] = ['guerra', 'slater', 'rdk'];

function hasOrbital(method: Method, orbital: string): boolean {
  if (method === 'guerra') {
    return GUERRA_ORBITALS.includes(orbital);
  }
  if (method === 'slater') {
    return SLATER_ORBITALS.includes(orbital);
  }
  return RDK_ORBITALS.includes(orbital);
}

@Component({
  selector: 'app-graph-sub-choice',
  templateUrl: './graph-sub-choice.html',
  styleUrl: './graph-sub-choice.css',
})
export class GraphSubChoice {
  readonly xOrY = input.required<'x' | 'y'>();
  readonly graphChoice = input<string>('');

  // Values stored in sets: methodOrbChecked = Set<"method|orbital">
  //                        ionizationChecked = Set<"1st"|"2nd"|...>
  //                        electroNegChecked = Set<"to"|"pauling">
  //                        atomicRadChecked  = Set<method-name-string>
  readonly methodOrbChecked = model<Set<string>>(new Set());
  readonly ionizationChecked = model<Set<string>>(new Set());
  readonly electroNegChecked = model<Set<string>>(new Set());
  readonly atomicRadChecked = model<Set<string>>(new Set());

  readonly orbitals = ALL_ORBITALS;
  readonly methods = METHODS;
  readonly ionizationOrders = IONIZATION_ORDERS;
  readonly atomicRadMethods = ATOMIC_RAD_METHODS;

  readonly showMethodOrb = computed(() => {
    const c = this.graphChoice();
    return c === 'effnuccharge' || c === 'orbrad' || c === 'ke' || c === 'pe' || c === 'te';
  });
  readonly showSlater = computed(() => this.graphChoice() === 'effnuccharge');
  readonly showIonization = computed(() => this.graphChoice() === 'ie');
  readonly showElectroNeg = computed(() => this.graphChoice() === 'electroneg');
  readonly showAtomicRad = computed(() => this.graphChoice() === 'atomrad');

  readonly isCheckbox = computed(() => this.xOrY() === 'y');

  hasOrbital(method: Method, orbital: string): boolean {
    return hasOrbital(method, orbital) && (method !== 'slater' || this.showSlater());
  }

  methodOrbKey(method: string, orbital: string): string {
    return `${method}|${orbital}`;
  }

  domId(prefix: string, ...parts: string[]): string {
    return `${this.xOrY()}-${prefix}-${parts.join('-')}`;
  }

  isMethodOrbChecked(method: string, orbital: string): boolean {
    return this.methodOrbChecked().has(this.methodOrbKey(method, orbital));
  }

  isIonizationChecked(order: string): boolean {
    return this.ionizationChecked().has(order);
  }

  isElectroNegChecked(type: string): boolean {
    return this.electroNegChecked().has(type);
  }

  isAtomicRadChecked(method: string): boolean {
    return this.atomicRadChecked().has(method);
  }

  onMethodOrbChange(method: string, orbital: string, checked: boolean) {
    const key = this.methodOrbKey(method, orbital);
    const set = new Set(this.methodOrbChecked());
    if (!this.isCheckbox()) {
      set.clear();
    }
    checked ? set.add(key) : set.delete(key);
    this.methodOrbChecked.set(set);
  }

  onIonizationChange(order: string, checked: boolean) {
    const set = new Set(this.ionizationChecked());
    if (!this.isCheckbox()) {
      set.clear();
    }
    checked ? set.add(order) : set.delete(order);
    this.ionizationChecked.set(set);
  }

  onElectroNegChange(type: string, checked: boolean) {
    const set = new Set(this.electroNegChecked());
    if (!this.isCheckbox()) {
      set.clear();
    }
    checked ? set.add(type) : set.delete(type);
    this.electroNegChecked.set(set);
  }

  onAtomicRadChange(method: string, checked: boolean) {
    const set = new Set(this.atomicRadChecked());
    if (!this.isCheckbox()) {
      set.clear();
    }
    checked ? set.add(method) : set.delete(method);
    this.atomicRadChecked.set(set);
  }
}
