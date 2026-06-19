import { Component, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MainTab } from './main-tab/main-tab';
import { GraphsTab } from './graphs-tab/graphs-tab';

@Component({
  selector: 'app-root',
  imports: [MatTabsModule, MainTab, GraphsTab],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly activeTab = signal<'main' | 'graphs'>('main');
}
