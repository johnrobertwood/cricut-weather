import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="weather-card">
      <div class="weather-card-header">
        <ng-content select="[header]"></ng-content>
      </div>
      <div class="weather-card-content">
        <ng-content></ng-content>
      </div>
      <div class="weather-card-footer">
        <ng-content select="[footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .weather-card {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 24px;
        margin: 16px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        background: white;
        width: 350px;
        min-height: 300px;
        display: flex;
        flex-direction: column;
      }
      .weather-card-header {
        font-weight: bold;
        font-size: 1.5em;
        margin-bottom: 16px;
        min-height: 32px;
      }
      .weather-card-content {
        margin: 24px 0;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 180px;
      }
      .weather-card-footer {
        font-size: 1em;
        color: #666;
        min-height: 24px;
      }
    `,
  ],
})
export class WeatherCardComponent {
  @Input() title: string = '';
}
