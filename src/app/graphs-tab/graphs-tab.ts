import { Component, ElementRef, OnDestroy, effect, signal, viewChild } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { Chart, type ScatterDataPoint } from 'chart.js/auto';
import { elements } from '../data/elements';
import { GraphSubChoice } from './graph-sub-choice/graph-sub-choice';

const GRAPH_CHOICES = [
  {
    value: 'z',
    label: 'Atomic number',
  },
  {
    value: 'amass',
    label: 'Atomic mass',
  },
  {
    value: 'effnuccharge',
    label: 'Eff. Nuclear Charge (Zₑₒₓ)',
  },
  {
    value: 'orbrad',
    label: 'Orbital Radius',
  },
  {
    value: 'atomrad',
    label: 'Atomic Radius',
  },
  {
    value: 'ke',
    label: 'Kinetic Energy',
  },
  {
    value: 'pe',
    label: 'Potential Energy',
  },
  {
    value: 'te',
    label: 'Total Energy',
  },
  {
    value: 'ie',
    label: 'Ionization Energy',
  },
  {
    value: 'electroneg',
    label: 'Electronegativity',
  },
  {
    value: 'density',
    label: 'Density',
  },
  {
    value: 'melting',
    label: 'Melting Point',
  },
  {
    value: 'boiling',
    label: 'Boiling Point',
  },
];

interface ExcelRow {
  [key: string]: number | string | undefined;
}

function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as T;
}

@Component({
  selector: 'app-graphs-tab',
  imports: [
    GraphSubChoice,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatCardModule,
    FormsModule,
  ],
  templateUrl: './graphs-tab.html',
  styleUrl: './graphs-tab.css',
})
export class GraphsTab implements OnDestroy {
  readonly chartCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('chartCanvas');

  private chart: Chart | null = null;

  readonly graphChoices = GRAPH_CHOICES;

  // Axis main selections
  readonly xChoice = signal('');
  readonly yChoice = signal('');

  // Range slider
  readonly fromVal = signal(1);
  readonly toVal = signal(18);

  // Subchoice sets for Y axis
  readonly yMethodOrb = signal<Set<string>>(new Set());
  readonly yIonization = signal<Set<string>>(new Set());
  readonly yElectroNeg = signal<Set<string>>(new Set());
  readonly yAtomicRad = signal<Set<string>>(new Set());

  // Subchoice sets for X axis
  readonly xMethodOrb = signal<Set<string>>(new Set());
  readonly xIonization = signal<Set<string>>(new Set());
  readonly xElectroNeg = signal<Set<string>>(new Set());
  readonly xAtomicRad = signal<Set<string>>(new Set());

  private readonly excelData = httpResource<ExcelRow[]>(() => 'element-data.json');

  private readonly elemLabels = elements.map(e => e.symbol);

  private debouncedDraw = debounce(() => this.drawGraph(), 300);

  constructor() {
    effect(() => {
      this.excelData.value();
      this.xChoice();
      this.yChoice();
      this.fromVal();
      this.toVal();
      this.yMethodOrb();
      this.yIonization();
      this.yElectroNeg();
      this.yAtomicRad();
      this.xMethodOrb();
      this.xIonization();
      this.xElectroNeg();
      this.xAtomicRad();
      this.debouncedDraw();
    });
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }

  onFromSlider(value: string) {
    const from = +value;
    const to = this.toVal();
    this.fromVal.set(from > to ? to : from);
  }

  onToSlider(value: string) {
    const to = +value;
    const from = this.fromVal();
    this.toVal.set(to < from ? from : to);
  }

  onFromInput(value: string) {
    const from = Math.max(1, Math.min(+value, 118));
    const to = this.toVal();
    this.fromVal.set(from > to ? to : from);
  }

  onToInput(value: string) {
    const to = Math.max(1, Math.min(+value, 118));
    const from = this.fromVal();
    this.toVal.set(to < from ? from : to);
  }

  sliderBackground(): string {
    const from = this.fromVal();
    const to = this.toVal();
    const pFrom = ((from - 1) / 117) * 100;
    const pTo = ((to - 1) / 117) * 100;
    return `linear-gradient(to right, #C6C6C6 0%, #C6C6C6 ${pFrom}%, #25daa5 ${pFrom}%, #25daa5 ${pTo}%, #C6C6C6 ${pTo}%, #C6C6C6 100%)`;
  }

  private getValuesAndLabel(
    axis: 'x' | 'y',
    choice: string,
    startIdx: number,
    count: number
  ): { data: (number | undefined)[], label: string }[] {
    const data = this.excelData.value() ?? [];
    const methodOrb = axis === 'y' ? this.yMethodOrb() : this.xMethodOrb();
    const ionization = axis === 'y' ? this.yIonization() : this.xIonization();
    const electroNeg = axis === 'y' ? this.yElectroNeg() : this.xElectroNeg();
    const atomicRad = axis === 'y' ? this.yAtomicRad() : this.xAtomicRad();

    const slice = <T>(arr: T[]) => arr.slice(startIdx, startIdx + count);

    const fromExcel = (field: string) =>
      slice(data.map(row => {
        const v = row[field];
        return v !== undefined && v !== '' && v !== null ? +v : undefined;
      }));

    const methodOrbFields = (prefix: string): { data: (number | undefined)[], label: string }[] => {
      if (methodOrb.size === 0) {
        return [];
      }
      return [...methodOrb].map(key => {
        const [method, orbital] = key.split('|');
        const fieldname = `${prefix} - ${method} ${orbital}`;
        const label = `${prefix} for ${orbital} - ${method === 'guerra' ? 'Guerra' : method === 'slater' ? 'Slater' : 'DeKock'}`;
        return {
          data: fromExcel(fieldname),
          label,
        };
      });
    };

    switch (choice) {
      case 'z':
        return [{
          data: slice(Array.from({ length: 118 }, (_, i) => i + 1)),
          label: 'Nuclear Charge',
        }];
      case 'amass':
        return [{
          data: slice(elements.map(e => e.aMass)),
          label: 'Atomic mass',
        }];
      case 'effnuccharge':
        return methodOrbFields('Zeff');
      case 'orbrad':
        return methodOrbFields('Rp');
      case 'ke':
        return methodOrbFields('KE');
      case 'pe':
        return methodOrbFields('PE');
      case 'te':
        return methodOrbFields('TE');
      case 'atomrad':
        if (atomicRad.size === 0) {
          return [];
        }
        return [...atomicRad].map(method => ({
          data: fromExcel(`Rp - ${method}`),
          label: `Atomic Radius: ${method} (pm)`,
        }));
      case 'ie':
        if (ionization.size === 0) {
          return [];
        }
        return [...ionization].map(order => ({
          data: fromExcel(`Ionization Energy: ${order}`),
          label: `${order} Ionization (eV)`,
        }));
      case 'electroneg':
        if (electroNeg.size === 0) {
          return [];
        }
        return [...electroNeg].map(type => {
          const fieldname = type === 'to'
            ? "Tantardini and Oganov Electronegativity"
            : "Pauling's Electronegativity";
          return {
            data: fromExcel(fieldname),
            label: fieldname,
          };
        });
      case 'density':
        return [{
          data: slice(elements.map(e => +e.density || undefined as unknown as number)),
          label: 'Density',
        }];
      case 'melting':
        return [{
          data: slice(elements.map(e => +e.meltingPoint || undefined as unknown as number)),
          label: 'Melting Point',
        }];
      case 'boiling':
        return [{
          data: slice(elements.map(e => +e.boilingPoint || undefined as unknown as number)),
          label: 'Boiling Point',
        }];
      default:
        return [];
    }
  }

  private yChoiceToLabel(): string {
    const m: Record<string, string> = {
      z: 'Nuclear Charge',
      amass: 'Atomic mass',
      effnuccharge: 'Effective Nuclear Charge',
      orbrad: 'Orbital Radius',
      atomrad: 'Atomic Radius',
      ke: 'Kinetic Energy',
      pe: 'Potential Energy',
      te: 'Total Energy',
      ie: 'Ionization Energy',
      electroneg: 'Electronegativity',
      density: 'Density',
      melting: 'Melting Point',
      boiling: 'Boiling Point',
    };
    return m[this.yChoice()] ?? '';
  }

  drawGraph() {
    if (!this.excelData.value()?.length) {
      return;
    }
    const xc = this.xChoice();
    const yc = this.yChoice();
    if (!xc || !yc) {
      this.chart?.destroy();
      this.chart = null;
      return;
    }

    const startIdx = this.fromVal() - 1;
    const count = this.toVal() - startIdx;
    const xResults = this.getValuesAndLabel('x', xc, startIdx, count);
    const yResults = this.getValuesAndLabel('y', yc, startIdx, count);
    if (xResults.length === 0 || yResults.length === 0) {
      return;
    }

    const xData = xResults[0].data;
    const xLabel = xResults[0].label;
    const labels = this.elemLabels.slice(startIdx, startIdx + count);

    const dataLabelsPlugin = {
      id: 'dataLabels',
      afterDatasetsDraw: (chart: Chart) => {
        const { ctx } = chart;
        ctx.save();
        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#333';
        for (let ds = 0; ds < chart.getVisibleDatasetCount(); ds++) {
          const meta = chart.getDatasetMeta(ds);
          meta.data.forEach((point, i) => {
            ctx.fillText(labels[i], point.x, point.y - 10);
          });
        }
        ctx.restore();
      },
    };

    const datasets = yResults.map((yr, idx) => ({
      label: `${yr.label} vs ${xLabel}`,
      borderWidth: 1,
      data: yr.data.map((y, i) => ({
        x: xData[i],
        y,
      })) as ScatterDataPoint[],
    }));

    this.chart?.destroy();
    this.chart = new Chart(this.chartCanvas().nativeElement, {
      type: 'scatter',
      data: {
        labels,
        datasets,
      },
      options: {
        scales: {
          x: {
            title: {
              text: xLabel,
              display: true,
            },
          },
          y: {
            title: {
              text: this.yChoiceToLabel(),
              display: true,
            },
          },
        },
        plugins: {
          title: {
            display: false,
          },
        },
      },
      plugins: [dataLabelsPlugin],
    });
  }
}
