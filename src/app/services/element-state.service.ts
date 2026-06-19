import { Injectable, signal } from '@angular/core';
import type { ElementType, Orbital } from '../data/types';

export interface ElementState {
  selectedElementInfo: ElementType | null;
  selectedElemOrbitals: Orbital[] | null;
  selectedGroupClass: string | null;
  rowSelected: number | null;
}

@Injectable({ providedIn: 'root' })
export class ElementStateService {
  readonly state = signal<ElementState>({
    selectedElementInfo: null,
    selectedElemOrbitals: null,
    selectedGroupClass: null,
    rowSelected: null,
  });

  selectElement(info: ElementType, orbitals: Orbital[], groupClass: string) {
    this.state.set({
      selectedElementInfo: info,
      selectedElemOrbitals: orbitals,
      selectedGroupClass: groupClass,
      rowSelected: null,
    });
  }

  selectRow(row: number) {
    this.state.set({
      selectedElementInfo: null,
      selectedElemOrbitals: null,
      selectedGroupClass: null,
      rowSelected: row,
    });
  }

  clear() {
    this.state.set({
      selectedElementInfo: null,
      selectedElemOrbitals: null,
      selectedGroupClass: null,
      rowSelected: null,
    });
  }
}
