import React, { useState } from 'react';

function Header({ onSearch }) {
  const [city, setCity] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
      setCity('');
    }
  };

  return (
    <header className='bg-blue-500 text-white py-4 px-4 md:px-6 shadow-md'>
      <div className='flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto'>
        <h1 className='text-xl md:text-2xl font-bold mb-4 md:mb-0'>Weather App</h1>
        <form onSubmit={handleSearch} className='flex flex-col md:flex-row items-center w-full md:w-auto'>
          <input
            type='text'
            placeholder='Search City'
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className='py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-black w-full md:w-auto mb-2 md:mb-0'
          />
          <button
            type='submit'
            className='w-full md:w-auto bg-white px-4 py-2 text-blue-500 rounded-lg md:ml-2'>
            Search
          </button>
        </form>
      </div>
    </header>
  );
}

export default Header;
