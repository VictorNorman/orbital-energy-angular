import { Component, signal } from '@angular/core';
import { MainTab } from './main-tab/main-tab';
import { GraphsTab } from './graphs-tab/graphs-tab';

@Component({
  selector: 'app-root',
  imports: [MainTab, GraphsTab],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly activeTab = signal<'main' | 'graphs'>('main');
}
