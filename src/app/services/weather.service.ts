import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Temperature {
  value: number;
  unit: string;
  timestamp: Date;
}

export interface Humidity {
  value: number;
  unit: string;
}

interface WeatherResponse {
  main: {
    temp: number;
    humidity: number;
  };
  dt: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly API_URL =
    'https://2hcwrualh8.execute-api.us-east-1.amazonaws.com/prod/getWeather';

  constructor(private http: HttpClient) {}

  private getWeatherData(): Observable<WeatherResponse> {
    return this.http.get<WeatherResponse>(this.API_URL);
  }

  getTemperature(unit: 'C' | 'F' = 'F'): Observable<Temperature> {
    return this.getWeatherData().pipe(
      map((data) => ({
        value:
          unit === 'C'
            ? this.kelvinToCelsius(data.main.temp)
            : this.kelvinToFahrenheit(data.main.temp),
        unit: unit === 'C' ? '°C' : '°F',
        timestamp: new Date(data.dt * 1000),
      }))
    );
  }

  getHumidity(): Observable<Humidity> {
    return this.getWeatherData().pipe(
      map((data) => ({
        value: data.main.humidity,
        unit: '%',
      }))
    );
  }

  getCombinedWeather(unit: 'C' | 'F' = 'F'): Observable<{
    temperature: Temperature;
    humidity: Humidity;
    cityName: string;
  }> {
    return this.getWeatherData().pipe(
      map((data) => ({
        temperature: {
          value:
            unit === 'C'
              ? this.kelvinToCelsius(data.main.temp)
              : this.kelvinToFahrenheit(data.main.temp),
          unit: unit === 'C' ? '°C' : '°F',
          timestamp: new Date(data.dt * 1000),
        },
        humidity: {
          value: data.main.humidity,
          unit: '%',
        },
        cityName: data.name,
      }))
    );
  }

  private kelvinToCelsius(kelvin: number): number {
    return kelvin - 273.15;
  }

  private kelvinToFahrenheit(kelvin: number): number {
    return (kelvin - 273.15) * (9 / 5) + 32;
  }
}
