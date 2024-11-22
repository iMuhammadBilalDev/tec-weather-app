import React, { useState } from "react";
import Header from "./components/Header";
import CurrentWeather from "./components/CurrentWeather";
import ForecastSection from "./components/ForecastSection";
import axios from "axios";

const App = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [fullForecast, setFullForecast] = useState([]); // Add state to store full 3-hour data
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null); // Track the selected day
  const [selectedDayData, setSelectedDayData] = useState([]); // Data for the selected day

  const fetchWeatherData = async (city) => {
    const APIKey = "cc23806e4866d2cff183c6d1907c91a2";
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${APIKey}`;

    setLoading(true);

    try {
      const currentResponse = await axios.get(currentWeatherUrl);
      setCurrentWeather(currentResponse.data);

      const forecastResponse = await axios.get(forecastUrl);
      const forecastData = forecastResponse.data.list;

      setFullForecast(forecastData); // Save the full forecast data

      const uniqueForecast = forecastData.reduce((acc, current) => {
        const date = new Date(current.dt_txt);
        const dayName = date.toLocaleDateString("en-US", { weekday: 'long' }); // Get the day name
        if (!acc.find(item => item.date === dayName)) {
          acc.push({
            date: dayName, // Use dayName instead of date
            temp: Math.round(current.main.temp),
            icon: `http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`,
          });
        }
        return acc;
      }, []);

      setForecast(uniqueForecast.slice(0, 7)); // Only show the next 7 days

    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("Could not fetch weather data. Please try again.");
    }

    setLoading(false);
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    
    // Filter the 3-hour interval data for the selected day
    const filteredData = fullForecast.filter(item => {
      const date = new Date(item.dt_txt);
      const dayName = date.toLocaleDateString("en-US", { weekday: 'long' });
      return dayName === day;
    });

    setSelectedDayData(filteredData); // Set data for the selected day
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header onSearch={fetchWeatherData} />
      <main className="py-6">
        {loading && <p className="text-center text-blue-500">Loading....</p>}
        {currentWeather && <CurrentWeather data={currentWeather} />}
        {forecast.length > 0 && (
          <ForecastSection data={forecast} onDayClick={handleDayClick} />
        )}
        
        {/* Render the 3-hour interval data if a day is selected */}
        {selectedDay && (
          <div className="py-6">
            <h2 className="text-center text-lg font-semibold">
              3-Hour Forecast for {selectedDay}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedDayData.map((item, index) => (
                <div key={index} className="p-4 border rounded-md bg-white">
                  <p>{new Date(item.dt_txt).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}</p>
                  <img src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} alt="weather-icon" />
                  <p>{Math.round(item.main.temp)}°C</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
