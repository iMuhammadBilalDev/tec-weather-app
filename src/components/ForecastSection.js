import React from "react";

const ForecastSection = ({ data, onDayClick }) => (
  <div className="flex justify-center">
    {data.map((item, index) => (
      <div
        key={index}
        className="cursor-pointer p-4 m-2 border rounded-md bg-white hover:bg-gray-200"
        onClick={() => onDayClick(item.date)} // Click to show 3-hour data
      >
        <p className="font-semibold">{item.date}</p>
        <img src={item.icon} alt="weather-icon" />
        <p>{item.temp}°C</p>
      </div>
    ))}
  </div>
);

export default ForecastSection;
