export const WMO_CODES = {
  0: { desc: 'Clear sky', icon: '☀️' },
  1: { desc: 'Mainly clear', icon: '🌤️' },
  2: { desc: 'Partly cloudy', icon: '⛅' },
  3: { desc: 'Overcast', icon: '☁️' },
  45: { desc: 'Fog', icon: '🌫️' },
  48: { desc: 'Depositing rime fog', icon: '🌫️' },
  51: { desc: 'Light drizzle', icon: '🌧️' },
  53: { desc: 'Moderate drizzle', icon: '🌧️' },
  55: { desc: 'Dense drizzle', icon: '🌧️' },
  56: { desc: 'Light freezing drizzle', icon: '🌧️' },
  57: { desc: 'Dense freezing drizzle', icon: '🌧️' },
  61: { desc: 'Slight rain', icon: '🌦️' },
  63: { desc: 'Moderate rain', icon: '🌧️' },
  65: { desc: 'Heavy rain', icon: '⛈️' },
  66: { desc: 'Light freezing rain', icon: '🌧️' },
  67: { desc: 'Heavy freezing rain', icon: '⛈️' },
  71: { desc: 'Slight snow', icon: '🌨️' },
  73: { desc: 'Moderate snow', icon: '❄️' },
  75: { desc: 'Heavy snow', icon: '❄️' },
  77: { desc: 'Snow grains', icon: '❄️' },
  80: { desc: 'Slight rain showers', icon: '🌧️' },
  81: { desc: 'Moderate rain showers', icon: '🌧️' },
  82: { desc: 'Violent rain showers', icon: '⛈️' },
  85: { desc: 'Slight snow showers', icon: '🌨️' },
  86: { desc: 'Heavy snow showers', icon: '❄️' },
  95: { desc: 'Thunderstorm', icon: '🌩️' },
  96: { desc: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { desc: 'Thunderstorm with heavy hail', icon: '⛈️' },
};

export const getWeatherInfo = (code) => {
    return WMO_CODES[code] || { desc: 'Unknown', icon: '❓' };
}

export async function fetchWeatherData(lat = 31.1048, lon = 77.1734) {
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

export async function fetchRainViewerTime() {
  try {
    const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
    const data = await res.json();
    if (data && data.radar && data.radar.past && data.radar.past.length > 0) {
      return data.radar.past[data.radar.past.length - 1].time;
    }
    return null;
  } catch (error) {
    console.error("Error fetching RainViewer data:", error);
    return null;
  }
}
