import React, { useState } from 'react';

function Header({onSearch}) {
  const [city, setCity] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
      setCity(''); 
    }
  };

  return (
    <header className='bg-blue-500 text-white py-4 px-6 shadow-md'>
      <div className='flex items-center justify-between max-w-6xl mx-auto'>
        <h1 className='text-2xl font-bold'>Weather App</h1>
        <form onSubmit={handleSearch}>
          <input
            type='text'
            placeholder='Search City'
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className='py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-black'
          />
          <button type='submit' className='ml-2 bg-white px-4 py-2 text-blue-500 rounded-lg'>Search</button>
        </form>
      </div>
    </header>
  );
}

export default Header;
