import { Component } from '@angular/core';
import { ElementsTable } from './elements-table';

@Component({
  selector: 'app-main-tab',
  imports: [ElementsTable],
  template: `
    <h2>Main</h2>
    <app-elements-table />
  `,
  styles: [`h2 { margin-bottom: 1rem; }`],
})
export class MainTab { }
