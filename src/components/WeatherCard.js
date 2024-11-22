import React from 'react'

function WeatherCard({day,temp,icon}) {
  return (
    <div className='flex flex-col items-center bg-white rounded-lg p-4 shadow-md'>
        <h4 className='font-bold'>{day}</h4>
        <img src={icon} alt="Weather icon" className="w-12 h-12 my-2" />
        <p className='text-lg font-semibold'>{temp}</p>
    </div>
  )
}

export default WeatherCard;