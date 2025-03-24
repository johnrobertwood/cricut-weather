import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService, WeatherData } from '../../services/weather.service';
import { WeatherCardComponent } from '../weather-card/weather-card.component';
import { TemperaturePipe } from '../../pipes/temperature.pipe';
import { BehaviorSubject, Observable, switchMap, catchError, of } from 'rxjs';

type TemperatureUnit = 'C' | 'F';

@Component({
  selector: 'app-weather-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, WeatherCardComponent, TemperaturePipe],
  templateUrl: './weather-dashboard.component.html',
  styleUrls: ['./weather-dashboard.component.scss'],
})
export class WeatherDashboardComponent implements OnInit {
  private unitSubject = new BehaviorSubject<TemperatureUnit>('F');
  weatherData$: Observable<WeatherData | null>;

  constructor(private weatherService: WeatherService) {
    // Initialize the weather data stream
    this.weatherData$ = this.unitSubject.pipe(
      switchMap((unit) => this.weatherService.getCombinedWeather(unit)),
      catchError((error) => {
        console.error('Error fetching weather data:', error);
        return of(null);
      })
    );
  }

  ngOnInit(): void {
    // Trigger initial data fetch by emitting the current unit value
    this.unitSubject.next(this.unitSubject.value);
  }

  // Getter for template binding
  get selectedUnit(): TemperatureUnit {
    return this.unitSubject.value;
  }

  // Setter for template binding
  set selectedUnit(value: TemperatureUnit) {
    this.unitSubject.next(value);
  }

  // Helper method to safely get forecast data
  getForecastData(
    weatherData: WeatherData | null
  ): { icon: string; description: string } | null {
    if (!weatherData?.forecast) {
      return null;
    }
    return {
      icon: weatherData.forecast.icon || '',
      description: weatherData.forecast.description || 'No forecast available',
    };
  }
}
