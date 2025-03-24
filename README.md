# Cricut Weather Dashboard

A modern Angular application that displays weather information with a focus on temperature data. The application demonstrates various Angular features including two-way binding, content projection, custom pipes, and RxJS data stream management.

🌐 **Live Demo**: [View the application](https://johnrobertwood.github.io/cricut-weather/)

## Features

- Real-time weather data display
- Temperature unit conversion (Fahrenheit/Celsius)
- Custom temperature formatting pipe
- Cached weather data using RxJS BehaviorSubject
- Modern, responsive card-based UI with SCSS styling
- Loading state indicators
- Stable layout with smooth transitions
- Forecast data integration
- Robust error handling and data loading states

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
  - `weather-dashboard/` - Main dashboard component with SCSS styling
- `src/app/services/` - Angular services
  - `weather.service.ts` - Weather data fetching and caching
- `src/app/pipes/` - Custom pipes
  - `temperature.pipe.ts` - Temperature formatting pipe

## Features in Detail

### Weather Service
- Fetches real-time weather data
- Implements caching using RxJS BehaviorSubject
- Handles temperature unit conversion
- Integrates forecast data with current weather
- Optimized data loading with shareReplay for efficient caching
- Comprehensive error handling with detailed logging
- Automatic data refresh on unit changes
- Graceful handling of missing or invalid data

### Temperature Pipe
- Custom pipe for formatting temperature values
- Supports both Fahrenheit and Celsius
- Handles null/undefined values gracefully

### Weather Card Component
- Reusable card component
- Implements content projection for flexible content display
- Modern, responsive design

### Weather Dashboard Component
- Main application component with SCSS styling
- Implements two-way binding for temperature unit selection
- Displays combined weather data with forecast information
- Features smooth transitions between unit changes
- Responsive grid layout with fixed dimensions
- Stable layout preventing shifts during data updates
- Optimized for various screen sizes
- Improved loading states and error handling

### Styling Features
- Modern SCSS-based styling architecture
- Responsive grid system for optimal layout
- Fixed dimensions to prevent layout shifts
- Smooth transitions for all interactive elements
- Mobile-first design approach
- Consistent spacing and typography
- Optimized for readability and user experience
- Clean, minimalist aesthetic with proper visual hierarchy

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
