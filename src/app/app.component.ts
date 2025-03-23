import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherDashboardComponent } from './components/weather-dashboard/weather-dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, WeatherDashboardComponent],
  template: ` <app-weather-dashboard></app-weather-dashboard> `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background-color: #f0f2f5;
      }
    `,
  ],
})
export class AppComponent {
  title = 'Weather Dashboard';
}
