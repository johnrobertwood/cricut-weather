import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService, WeatherData } from '../../services/weather.service';
import { WeatherCardComponent } from '../weather-card/weather-card.component';
import { TemperaturePipe } from '../../pipes/temperature.pipe';

type TemperatureUnit = 'C' | 'F';

@Component({
  selector: 'app-weather-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, WeatherCardComponent, TemperaturePipe],
  templateUrl: './weather-dashboard.component.html',
  styleUrls: ['./weather-dashboard.component.css'],
})
export class WeatherDashboardComponent implements OnInit {
  weatherData: WeatherData | null = null;
  isLoading = false;
  selectedUnit: TemperatureUnit = 'F';

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.fetchWeatherData();
  }

  fetchWeatherData(): void {
    this.isLoading = true;
    this.weatherService.getWeatherData().subscribe({
      next: (data) => {
        if (data) {
          this.weatherData = data;
          // Convert to Fahrenheit since that's our default unit
          this.weatherService.getCombinedWeather('F').subscribe({
            next: (convertedData) => {
              this.weatherData = convertedData;
              this.isLoading = false;
            },
            error: (error) => {
              console.error('Error converting temperature:', error);
              this.isLoading = false;
            },
          });
        } else {
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error fetching weather data:', error);
        this.isLoading = false;
      },
    });
  }

  onUnitChange(unit: TemperatureUnit): void {
    this.selectedUnit = unit;
    this.weatherService.getCombinedWeather(unit).subscribe({
      next: (data) => {
        if (data) {
          this.weatherData = data;
        }
      },
      error: (error) => {
        console.error('Error updating temperature unit:', error);
      },
    });
  }
}
