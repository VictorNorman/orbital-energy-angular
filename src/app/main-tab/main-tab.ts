import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ElementsTable } from './elements-table';

@Component({
  selector: 'app-main-tab',
  imports: [ElementsTable, MatCardModule, MatButtonModule],
  templateUrl: './main-tab.html',
  styleUrl: './main-tab.css',
})
export class MainTab { }
