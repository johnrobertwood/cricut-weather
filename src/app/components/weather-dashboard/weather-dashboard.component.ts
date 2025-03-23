import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  WeatherService,
  Temperature,
  Humidity,
} from '../../services/weather.service';
import { WeatherCardComponent } from '../weather-card/weather-card.component';
import { TemperaturePipe } from '../../pipes/temperature.pipe';
import { Subject, Observable } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

@Component({
  selector: 'app-weather-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, WeatherCardComponent, TemperaturePipe],
  template: `
    <div class="dashboard">
      <h1>Weather Dashboard</h1>

      <!-- Two-way binding example -->
      <div class="unit-selector">
        <label>
          Temperature Unit:
          <select [(ngModel)]="selectedUnit" (ngModelChange)="onUnitChange()">
            <option value="F">Fahrenheit</option>
            <option value="C">Celsius</option>
          </select>
        </label>
      </div>

      <div class="cards-container">
        <!-- RxJS stream combination example -->
        <app-weather-card>
          <div header>
            {{ (weatherData$ | async)?.cityName || 'Loading...' }}
          </div>
          <div class="combined-data">
            <div class="temperature-section">
              <div class="section-label">Temperature:</div>
              <div class="content-wrapper">
                <div *ngIf="isLoading" class="loading-container">
                  <div class="spinner"></div>
                </div>
                <div *ngIf="!isLoading" class="temperature-value">
                  {{ (weatherData$ | async)?.temperature | temperature }}
                </div>
              </div>
            </div>
            <div class="humidity-section">
              <div class="section-label">Humidity:</div>
              <div class="humidity-value">
                {{
                  (weatherData$ | async)?.humidity?.value
                    ? ((weatherData$ | async)?.humidity?.value
                      | number : '1.0-1')
                    : '--'
                }}{{ (weatherData$ | async)?.humidity?.unit || '%' }}
              </div>
            </div>
          </div>
          <div footer>
            Last updated:
            {{
              (weatherData$ | async)?.temperature?.timestamp
                ? ((weatherData$ | async)?.temperature?.timestamp
                  | date : 'medium')
                : 'Loading...'
            }}
          </div>
        </app-weather-card>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      .unit-selector {
        margin: 20px 0;
        padding: 10px;
        background: #f5f5f5;
        border-radius: 4px;
        font-size: 1.1em;
      }
      .cards-container {
        display: flex;
        justify-content: center;
        gap: 20px;
        flex-wrap: wrap;
      }
      .content-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .temperature-value {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5em;
      }
      .combined-data {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 40px;
        margin: 20px 0;
        height: 220px;
      }
      .temperature-section,
      .humidity-section {
        height: 120px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
      }
      .section-label {
        font-size: 1.3em;
        color: #666;
      }
      .humidity-value {
        font-size: 2em;
        font-weight: bold;
      }
      .loading-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .spinner {
        width: 45px;
        height: 45px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class WeatherDashboardComponent implements OnInit, OnDestroy {
  selectedUnit: 'C' | 'F' = 'F';
  weatherData$: Observable<{
    temperature: Temperature;
    humidity: Humidity;
    cityName: string;
  } | null>;
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(private weatherService: WeatherService) {
    this.weatherData$ = this.weatherService.getCombinedWeather(
      this.selectedUnit
    );
  }

  ngOnInit() {
    this.fetchWeatherData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private fetchWeatherData() {
    this.isLoading = true;
    this.weatherService
      .fetchWeatherData()
      .pipe(
        takeUntil(this.destroy$),
        map((data) => {
          this.isLoading = false;
          return data;
        })
      )
      .subscribe();
  }

  onUnitChange() {
    // No need to fetch new data, just update the display
    this.weatherData$ = this.weatherService.getCombinedWeather(
      this.selectedUnit
    );
  }
}
