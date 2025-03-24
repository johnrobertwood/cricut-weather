import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, combineLatest, throwError } from 'rxjs';
import { map, catchError, tap, shareReplay } from 'rxjs/operators';

export interface Temperature {
  value: number;
  unit: 'C' | 'F';
}

export interface WeatherData {
  temperature: Temperature;
  humidity: number;
  timestamp: Date;
  forecast?: {
    description: string;
    icon: string;
  };
}

interface WeatherResponse {
  main: {
    temp: number;
    humidity: number;
  };
  dt: number;
  name: string;
}

interface OverviewResponse {
  list: {
    dt: number;
    weather: {
      description: string;
      icon: string;
    }[];
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly API_URL =
    'https://2hcwrualh8.execute-api.us-east-1.amazonaws.com/prod';
  private readonly DEFAULT_LAT = 40.5593081; // South Jordan, Utah
  private readonly DEFAULT_LON = -111.938668;
  private weatherDataSubject = new BehaviorSubject<WeatherData | null>(null);
  private weatherData$: Observable<WeatherData>;

  constructor(private http: HttpClient) {
    // Initialize the weather data stream
    this.weatherData$ = this.getWeatherData().pipe(
      shareReplay(1),
      catchError((error) => {
        console.error('Error in weather data stream:', error);
        return throwError(() => error);
      })
    );
  }

  private validateCoordinates(lat: number, lon: number): boolean {
    return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
  }

  getWeatherData(
    lat: number = this.DEFAULT_LAT,
    lon: number = this.DEFAULT_LON
  ): Observable<WeatherData> {
    if (!this.validateCoordinates(lat, lon)) {
      return throwError(() => new Error('Invalid coordinates provided'));
    }

    const weatherUrl = `${this.API_URL}/getWeather?lat=${lat}&lon=${lon}`;
    const overviewUrl = `${this.API_URL}/getOverview?lat=${lat}&lon=${lon}`;

    console.log('Making API calls to:', { weatherUrl, overviewUrl });

    return combineLatest({
      weather: this.http
        .get<WeatherResponse>(weatherUrl)
        .pipe(
          tap((response) => console.log('Weather API response:', response))
        ),
      overview: this.http
        .get<OverviewResponse>(overviewUrl)
        .pipe(
          tap((response) => console.log('Overview API response:', response))
        ),
    }).pipe(
      tap(({ weather, overview }) => {
        console.log('Combined API responses:', { weather, overview });
      }),
      map(({ weather, overview }) => {
        console.log('Processing weather data:', weather);
        console.log('Processing overview data:', overview);

        const weatherData: WeatherData = {
          temperature: {
            value: this.kelvinToFahrenheit(weather.main.temp),
            unit: 'F',
          },
          humidity: weather.main.humidity,
          timestamp: new Date(weather.dt * 1000),
        };

        // Add forecast data if available
        if (overview.list && overview.list.length > 0) {
          console.log('Adding forecast data from overview');
          const tomorrow = overview.list[0];
          weatherData.forecast = {
            description: tomorrow.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${tomorrow.weather[0].icon}@2x.png`,
          };
        } else {
          console.warn('No forecast data available in overview response');
        }

        console.log('Final weather data:', weatherData);
        this.weatherDataSubject.next(weatherData);
        return weatherData;
      }),
      catchError((error) => {
        console.error('Error in getWeatherData:', error);
        return throwError(() => error);
      })
    );
  }

  getCombinedWeather(unit: 'C' | 'F' = 'F'): Observable<WeatherData | null> {
    return this.weatherData$.pipe(
      map((data) => {
        if (!data) {
          return null;
        }
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
      }),
      catchError((error) => {
        console.error('Error in getCombinedWeather:', error);
        return throwError(() => error);
      })
    );
  }

  private kelvinToFahrenheit(kelvin: number): number {
    // First convert Kelvin to Celsius, then to Fahrenheit
    const celsius = kelvin - 273.15;
    return (celsius * 9) / 5 + 32;
  }

  private fahrenheitToCelsius(fahrenheit: number): number {
    return ((fahrenheit - 32) * 5) / 9;
  }
}
