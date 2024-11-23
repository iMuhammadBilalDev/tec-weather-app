import React, { useState } from "react";
import Header from "./components/Header";
import CurrentWeather from "./components/CurrentWeather";
import axios from "axios";

const App = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [fullForecast, setFullForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedDayData, setSelectedDayData] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const APIKey = "cc23806e4866d2cff183c6d1907c91a2";

  // Function to fetch weather by city name
  const fetchWeatherData = async (city) => {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${APIKey}`;

    setLoading(true);

    try {
      const currentResponse = await axios.get(currentWeatherUrl);
      setCurrentWeather(currentResponse.data);

      const forecastResponse = await axios.get(forecastUrl);
      const forecastData = forecastResponse.data.list;

      setFullForecast(forecastData);

      const uniqueForecast = forecastData.reduce((acc, current) => {
        const date = new Date(current.dt_txt);
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
        if (!acc.find((item) => item.date === dayName)) {
          acc.push({
            date: dayName,
            temp: Math.round(current.main.temp),
            icon: `http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`,
          });
        }
        return acc;
      }, []);
      setForecast(uniqueForecast.slice(0, 7));
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("Could not fetch weather data. Please try again.");
    }

    setLoading(false);
  };

  // Function to fetch weather by current location
  const fetchWeatherByLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIKey}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIKey}`;

        setLoading(true);

        try {
          const currentResponse = await axios.get(currentWeatherUrl);
          setCurrentWeather(currentResponse.data);

          const forecastResponse = await axios.get(forecastUrl);
          const forecastData = forecastResponse.data.list;

          setFullForecast(forecastData);

          const uniqueForecast = forecastData.reduce((acc, current) => {
            const date = new Date(current.dt_txt);
            const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
            if (!acc.find((item) => item.date === dayName)) {
              acc.push({
                date: dayName,
                temp: Math.round(current.main.temp),
                icon: `http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`,
              });
            }
            return acc;
          }, []);
          setForecast(uniqueForecast.slice(0, 7));
        } catch (error) {
          console.error("Error fetching weather data by location:", error);
          alert("Could not fetch weather data for your location. Please try again.");
        }

        setLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Failed to get your location. Please enable location services and try again.");
      }
    );
  };

  const handleDaySelection = (day) => {
    setSelectedDays((prevSelected) =>
      prevSelected.includes(day)
        ? prevSelected.filter((d) => d !== day)
        : [...prevSelected, day]
    );
  };

  const fetchSelectedDayData = () => {
    const groupedData = selectedDays.reduce((acc, day) => {
      const dayData = fullForecast.filter((item) => {
        const date = new Date(item.dt_txt);
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
        return dayName === day;
      });

      if (dayData.length > 0) {
        acc[day] = dayData;
      }

      return acc;
    }, {});

    setSelectedDayData(groupedData);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header onSearch={fetchWeatherData} />
      <main className="py-6">
        <div className="text-center">
          <button
            className="mb-4 py-2 px-4 bg-green-500 text-white rounded-md"
            onClick={fetchWeatherByLocation}
          >
            Use Current Location
          </button>
        </div>
        {loading && <p className="text-center text-blue-500">Loading....</p>}
        {currentWeather && <CurrentWeather data={currentWeather} />}
        {forecast.length > 0 && (
          <div className="text-center py-6 relative">
            <label htmlFor="forecast-dropdown" className="block mb-2 font-bold">
              Select days for detailed forecast
            </label>
            <div
              className="py-2 px-4 border rounded-md bg-white text-gray-800 cursor-pointer relative"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              {selectedDays.length > 0
                ? selectedDays.join(", ")
                : "Select Days"}
              <div
                className={`absolute left-0 top-full mt-2 w-full border bg-white shadow-lg rounded-md ${
                  dropdownOpen ? "block" : "hidden"
                }`}
              >
                {forecast.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center px-4 py-2 hover:bg-gray-100"
                  >
                    <input
                      type="checkbox"
                      id={`day-${index}`}
                      className="mr-2"
                      checked={selectedDays.includes(item.date)}
                      onChange={() => handleDaySelection(item.date)}
                    />
                    <label htmlFor={`day-${index}`} className="cursor-pointer">
                      {item.date} - {item.temp}°C
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md"
              onClick={fetchSelectedDayData}
            >
              Show Selected Day Data
            </button>
          </div>
        )}
        {Object.keys(selectedDayData).length > 0 && (
          <div className="py-6">
            <h2 className="text-center text-lg font-semibold">
              3-Hour Forecast for Selected Days
            </h2>
            {Object.keys(selectedDayData).map((day) => (
              <div key={day} className="mb-6">
                <h3 className="text-xl font-bold text-center mb-4">{day}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedDayData[day].map((item, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-md bg-white text-center"
                    >
                      <p>
                        {new Date(item.dt_txt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <img
                        src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                        alt="weather-icon"
                      />
                      <p>{Math.round(item.main.temp)}°C</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
