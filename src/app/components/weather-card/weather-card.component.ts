import {
  Component,
  ContentChild,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-header">
        <ng-content select="[header]"></ng-content>
      </div>
      <div class="card-content">
        <ng-content></ng-content>
      </div>
      <div class="card-footer">
        <ng-content select="[footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        padding: 20px;
        width: 300px;
        min-height: 400px;
        display: flex;
        flex-direction: column;
      }
      .card-header {
        font-size: 1.5em;
        font-weight: bold;
        margin-bottom: 20px;
        color: #333;
      }
      .card-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .card-footer {
        margin-top: 20px;
        font-size: 0.9em;
        color: #666;
      }
    `,
  ],
})
export class WeatherCardComponent {}
