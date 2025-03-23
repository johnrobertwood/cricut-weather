import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Temperature {
  value: number;
  unit: 'C' | 'F';
}

export interface WeatherData {
  temperature: Temperature;
  humidity: number;
  timestamp: Date;
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
  private readonly DEFAULT_LAT = 40.5593081; // South Jordan, Utah
  private readonly DEFAULT_LON = -111.938668;
  private weatherDataSubject = new BehaviorSubject<WeatherData | null>(null);

  constructor(private http: HttpClient) {}

  private validateCoordinates(lat: number, lon: number): boolean {
    return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred while fetching weather data';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getWeatherData(
    lat: number = this.DEFAULT_LAT,
    lon: number = this.DEFAULT_LON
  ): Observable<WeatherData> {
    if (!this.validateCoordinates(lat, lon)) {
      return throwError(() => new Error('Invalid coordinates provided'));
    }

    const url = `${this.API_URL}?lat=${lat}&lon=${lon}`;

    return this.http.get<WeatherResponse>(url).pipe(
      map((data) => {
        // API returns temperature in Kelvin
        const weatherData: WeatherData = {
          temperature: {
            value: this.kelvinToFahrenheit(data.main.temp),
            unit: 'F',
          },
          humidity: data.main.humidity,
          timestamp: new Date(data.dt * 1000),
        };
        this.weatherDataSubject.next(weatherData);
        return weatherData;
      }),
      catchError(this.handleError)
    );
  }

  getCombinedWeather(unit: 'C' | 'F' = 'F'): Observable<WeatherData | null> {
    return this.weatherDataSubject.pipe(
      map((data) => {
        if (!data) return null;
        return {
          ...data,
          temperature: {
            value:
              unit === 'C'
                ? this.fahrenheitToCelsius(data.temperature.value)
                : data.temperature.value,
            unit,
          },
        };
      })
    );
  }

  private kelvinToFahrenheit(kelvin: number): number {
    // First convert Kelvin to Celsius, then to Fahrenheit
    const celsius = kelvin - 273.15;
    return (celsius * 9) / 5 + 32;
  }

  private celsiusToFahrenheit(celsius: number): number {
    return (celsius * 9) / 5 + 32;
  }

  private fahrenheitToCelsius(fahrenheit: number): number {
    return ((fahrenheit - 32) * 5) / 9;
  }
}
