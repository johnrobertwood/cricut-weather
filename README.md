# Cricut Weather Dashboard

A modern Angular application that displays weather information with a focus on temperature data. The application demonstrates various Angular features including two-way binding, content projection, custom pipes, and RxJS data stream management.

## Features

- Real-time weather data display
- Temperature unit conversion (Fahrenheit/Celsius)
- Custom temperature formatting pipe
- Cached weather data using RxJS BehaviorSubject
- Modern, responsive card-based UI
- Loading state indicators

## Prerequisites

- Node.js (v14 or higher)
- Angular CLI (v16 or higher)
- Modern web browser

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd cricut-weather
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

## Project Structure

- `src/app/components/` - Angular components
  - `weather-card/` - Reusable card component with content projection
  - `weather-dashboard/` - Main dashboard component
- `src/app/services/` - Angular services
  - `weather.service.ts` - Weather data fetching and caching
- `src/app/pipes/` - Custom pipes
  - `temperature.pipe.ts` - Temperature formatting pipe

## Features in Detail

### Weather Service
- Fetches real-time weather data
- Implements caching using RxJS BehaviorSubject
- Handles temperature unit conversion

### Temperature Pipe
- Custom pipe for formatting temperature values
- Supports both Fahrenheit and Celsius
- Handles null/undefined values gracefully

### Weather Card Component
- Reusable card component
- Implements content projection for flexible content display
- Modern, responsive design

### Weather Dashboard Component
- Main application component
- Implements two-way binding for temperature unit selection
- Displays combined weather data
- Includes loading state indicators

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
