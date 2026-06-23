import { Component, inject, signal } from '@angular/core';
import { ElementStateService } from '../services/element-state.service';
import { elements } from '../data/elements';
import { computeOrbitals } from '../data/orbitalEnergies';
import { DetailedElemBox } from './detailed-elem-box';

interface PCell {
  kind: 'elem' | 'empty';
  symbol?: string;
  number?: number;
  group?: string;
  rowCls?: string;
}

function elem(symbol: string, number: number, group: string, rowCls?: string): PCell {
  return {
    kind: 'elem',
    symbol,
    number,
    group,
    rowCls,
  };
}
const E: PCell = { kind: 'empty' };

const PTABLE_ROWS: PCell[][] = [
  [ elem('H',1,'group-col1','row1'), E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E, elem('He',2,'group-noble','row1') ],
  [ elem('Li',3,'group-col1','row2'), elem('Be',4,'group-12','row2'), E,E,E,E,E,E,E,E,E,E,
    elem('B',5,'group-nm','row2'), elem('C',6,'group-nm','row2'), elem('N',7,'group-nm','row2'),
    elem('O',8,'group-nm','row2'), elem('F',9,'group-nm','row2'), elem('Ne',10,'group-noble','row2') ],
  [ elem('Na',11,'group-col1','row3'), elem('Mg',12,'group-12','row3'), E,E,E,E,E,E,E,E,E,E,
    elem('Al',13,'group-nm','row3'), elem('Si',14,'group-nm','row3'), elem('P',15,'group-nm','row3'),
    elem('S',16,'group-nm','row3'), elem('Cl',17,'group-nm','row3'), elem('Ar',18,'group-noble','row3') ],
  [ elem('K',19,'group-col1'), elem('Ca',20,'group-12'),
    elem('Sc',21,'group-transition'), elem('Ti',22,'group-transition'), elem('V',23,'group-transition'),
    elem('Cr',24,'group-transition'), elem('Mn',25,'group-transition'), elem('Fe',26,'group-transition'),
    elem('Co',27,'group-transition'), elem('Ni',28,'group-transition'), elem('Cu',29,'group-transition'),
    elem('Zn',30,'group-transition'), elem('Ga',31,'group-nm'), elem('Ge',32,'group-nm'),
    elem('As',33,'group-nm'), elem('Se',34,'group-nm'), elem('Br',35,'group-nm'), elem('Kr',36,'group-noble') ],
  [ elem('Rb',37,'group-col1'), elem('Sr',38,'group-12'),
    elem('Y',39,'group-transition'), elem('Zr',40,'group-transition'), elem('Nb',41,'group-transition'),
    elem('Mo',42,'group-transition'), elem('Tc',43,'group-transition'), elem('Ru',44,'group-transition'),
    elem('Rh',45,'group-transition'), elem('Pd',46,'group-transition'), elem('Ag',47,'group-transition'),
    elem('Cd',48,'group-transition'), elem('In',49,'group-nm'), elem('Sn',50,'group-nm'),
    elem('Sb',51,'group-nm'), elem('Te',52,'group-nm'), elem('I',53,'group-nm'), elem('Xe',54,'group-noble') ],
  [ elem('Cs',55,'group-col1'), elem('Ba',56,'group-12'), elem('La',57,'group-transition'),
    elem('Hf',72,'group-transition'), elem('Ta',73,'group-transition'), elem('W',74,'group-transition'),
    elem('Re',75,'group-transition'), elem('Os',76,'group-transition'), elem('Ir',77,'group-transition'),
    elem('Pt',78,'group-transition'), elem('Au',79,'group-transition'), elem('Hg',80,'group-transition'),
    elem('Tl',81,'group-nm'), elem('Pb',82,'group-nm'), elem('Bi',83,'group-nm'),
    elem('Po',84,'group-nm'), elem('At',85,'group-nm'), elem('Rn',86,'group-noble') ],
  [ elem('Fr',87,'group-col1'), elem('Ra',88,'group-12'), elem('Ac',89,'group-transition'),
    elem('Rf',104,'group-transition'), elem('Db',105,'group-transition'), elem('Sg',106,'group-transition'),
    elem('Bh',107,'group-transition'), elem('Hs',108,'group-transition'), elem('Mt',109,'group-transition'),
    elem('Ds',110,'group-transition'), elem('Rg',111,'group-transition'), elem('Cn',112,'group-transition'),
    elem('Nh',113,'group-nm'), elem('Fl',114,'group-nm'), elem('Mc',115,'group-nm'),
    elem('Lv',116,'group-nm'), elem('Ts',117,'group-nm'), elem('Og',118,'group-noble') ],
  [E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E],
  [ E,E,E,
    elem('Ce',58,'group-la'), elem('Pr',59,'group-la'), elem('Nd',60,'group-la'), elem('Pm',61,'group-la'),
    elem('Sm',62,'group-la'), elem('Eu',63,'group-la'), elem('Gd',64,'group-la'), elem('Tb',65,'group-la'),
    elem('Dy',66,'group-la'), elem('Ho',67,'group-la'), elem('Er',68,'group-la'), elem('Tm',69,'group-la'),
    elem('Yb',70,'group-la'), elem('Lu',71,'group-la'), E ],
  [ E,E,E,
    elem('Th',90,'group-la'), elem('Pa',91,'group-la'), elem('U',92,'group-la'), elem('Np',93,'group-la'),
    elem('Pu',94,'group-la'), elem('Am',95,'group-la'), elem('Cm',96,'group-la'), elem('Bk',97,'group-la'),
    elem('Cf',98,'group-la'), elem('Es',99,'group-la'), elem('Fm',100,'group-la'), elem('Md',101,'group-la'),
    elem('No',102,'group-la'), elem('Lr',103,'group-la'), E ],
];

@Component({
  selector: 'app-elements-table',
  imports: [DetailedElemBox],
  templateUrl: './elements-table.html',
  styleUrl: './elements-table.css',
})
export class ElementsTable {
  private elementState = inject(ElementStateService);
  readonly rows = PTABLE_ROWS;
  readonly selectedNumber = signal<number | null>(null);

  onElementClick(cell: PCell) {
    if (!cell.number) {
      return;
    }
    if (this.selectedNumber() === cell.number) {
      this.selectedNumber.set(null);
      this.elementState.clear();
    } else {
      this.selectedNumber.set(cell.number);
      const info = elements.find(e => e.number === cell.number)!;
      const orbs = computeOrbitals(info.eConfig);
      this.elementState.selectElement(info, orbs, cell.group ?? '');
    }
  }

  isSelected(cell: PCell): boolean {
    return cell.number !== undefined && this.selectedNumber() === cell.number;
  }
}
