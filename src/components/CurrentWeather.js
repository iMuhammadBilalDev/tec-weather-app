import React from 'react';

function CurrentWeather({data}) {
  const { name, main, weather } = data;

  return (
    <div className='bg-white rounded-lg p-6 shadow max-w-6xl mx-auto'>
      <h1 className='text-xl font-bold mb-4'>Today's Weather</h1>
      <div className='flex justify-between items-center'>
        <div>
          <h3 className='text-2xl font-bold'>{name}</h3>
          <p className='text-gray-600'>{weather[0].description}</p> 
          <p className='text-4xl font-bold'>{Math.round(main.temp)}°C</p>
        </div>
        <img
          src={`http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
          alt="Weather icon"
          className="w-20 h-20"
        />
      </div>
    </div>
  );
}

export default CurrentWeather;
