import { Component, computed, inject } from '@angular/core';
import { ElementStateService } from '../services/element-state.service';
import { elements, startElemInPeriodicTableRows } from '../data/elements';

@Component({
  selector: 'app-detailed-elem-box',
  templateUrl: './detailed-elem-box.html',
  styleUrl: './detailed-elem-box.css',
})
export class DetailedElemBox {
  private elementState = inject(ElementStateService);
  readonly state = this.elementState.state;

  readonly showBox = computed(() => !!this.state().selectedElementInfo || !!this.state().rowSelected);
  readonly selectedEl = computed(() => this.state().selectedElementInfo);
  readonly rowSelected = computed(() => this.state().rowSelected);
  readonly groupClass = computed(() => this.state().selectedGroupClass ?? '');

  readonly eConfigHtml = computed(() => {
    const info = this.state().selectedElementInfo;
    const orbs = this.state().selectedElemOrbitals;
    if (!info || !orbs) {
      return '';
    }
    const aNumber = info.number;
    let i = 0;
    for (; i < startElemInPeriodicTableRows.length; i++) {
      if (startElemInPeriodicTableRows[i] >= aNumber) {
        break;
      }
    }
    i--;
    let numOrbitalsInLastElem = 0;
    let html = '';
    if (i > 0) {
      const lastElem = elements[startElemInPeriodicTableRows[i] - 1];
      numOrbitalsInLastElem = lastElem.eConfig.split(' ').length;
      html = `[${lastElem.symbol}] `;
    }
    for (const orb of orbs.slice(numOrbitalsInLastElem)) {
      html += `${orb.level}${orb.sOrP}<sup>${orb.numElectrons}</sup> `;
    }
    return html;
  });

  readonly crystallineImg = computed(() => {
    const info = this.state().selectedElementInfo;
    if (!info || info.crystallineStructure === 'N/A') {
      return '';
    }
    return info.crystallineStructure;
  });
}
