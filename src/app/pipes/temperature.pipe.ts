import { Pipe, PipeTransform } from '@angular/core';
import { Temperature } from '../services/weather.service';

@Pipe({
  name: 'temperature',
  standalone: true,
})
export class TemperaturePipe implements PipeTransform {
  transform(temperature: Temperature | null | undefined): string {
    if (!temperature?.value) {
      return 'Loading...';
    }
    return `${temperature.value.toFixed(1)}${temperature.unit}`;
  }
}
