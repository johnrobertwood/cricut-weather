import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, BehaviorSubject } from 'rxjs';

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
  // Using South Jordan, Utah coordinates as default
  private readonly DEFAULT_LAT = 40.5593081;
  private readonly DEFAULT_LON = -111.938668;
  private readonly API_URL =
    'https://2hcwrualh8.execute-api.us-east-1.amazonaws.com/prod/getWeather';

  private weatherDataSubject = new BehaviorSubject<WeatherResponse | null>(
    null
  );

  constructor(private http: HttpClient) {}

  private getWeatherData(
    lat: number = this.DEFAULT_LAT,
    lon: number = this.DEFAULT_LON
  ): Observable<WeatherResponse> {
    return this.http.get<WeatherResponse>(
      `${this.API_URL}?lat=${lat}&lon=${lon}`
    );
  }

  getTemperature(unit: 'C' | 'F' = 'F'): Observable<Temperature> {
    return this.weatherDataSubject.pipe(
      map((data) => {
        if (!data)
          return {
            value: 0,
            unit: unit === 'C' ? '°C' : '°F',
            timestamp: new Date(),
          };
        return {
          value:
            unit === 'C'
              ? this.kelvinToCelsius(data.main.temp)
              : this.kelvinToFahrenheit(data.main.temp),
          unit: unit === 'C' ? '°C' : '°F',
          timestamp: new Date(data.dt * 1000),
        };
      })
    );
  }

  getHumidity(): Observable<Humidity> {
    return this.weatherDataSubject.pipe(
      map((data) => {
        if (!data) return { value: 0, unit: '%' };
        return {
          value: data.main.humidity,
          unit: '%',
        };
      })
    );
  }

  getCombinedWeather(unit: 'C' | 'F' = 'F'): Observable<{
    temperature: Temperature;
    humidity: Humidity;
    cityName: string;
  }> {
    return this.weatherDataSubject.pipe(
      map((data) => {
        if (!data) {
          return {
            temperature: {
              value: 0,
              unit: unit === 'C' ? '°C' : '°F',
              timestamp: new Date(),
            },
            humidity: { value: 0, unit: '%' },
            cityName: 'Loading...',
          };
        }
        return {
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
        };
      })
    );
  }

  fetchWeatherData(): Observable<WeatherResponse> {
    return this.getWeatherData().pipe(
      map((data) => {
        this.weatherDataSubject.next(data);
        return data;
      })
    );
  }

  private kelvinToCelsius(kelvin: number): number {
    return kelvin - 273.15;
  }

  private kelvinToFahrenheit(kelvin: number): number {
    return (kelvin - 273.15) * (9 / 5) + 32;
  }
}
