import React, { useState, useEffect } from 'react';
import "./weather.css";
import { FaSearch } from "react-icons/fa";

const api = {
  key: '4eb244be78fd9ff419092fde1a50261d',
  base: 'https://api.openweathermap.org/data/2.5/'
};

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState({});
  const [error, setError] = useState('');
  const [backgroundClass, setBackgroundClass] = useState('');

  useEffect(() => {
    if (weather.main) {
      const currentHour = new Date().getHours();
      determineBackgroundClass(weather, currentHour);
    }
  }, [weather]);

  const search = (evt) => {
    if (evt.key === 'Enter') {
      fetchWeather();
    }
  };

  const fetchWeather = () => {
    fetch(`${api.base}weather?q=${city}&units=metric&appid=${api.key}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`City not found`);
        }
        return response.json();
      })
      .then((result) => {
        setWeather(result);
        setCity('');
        setError('');
      })
      .catch((error) => {
        setError('You have entered a wrong city. Please try again.');
      });
  };

  const searchButton = () => {
    fetchWeather();
  };

  const determineBackgroundClass = (weather, hour) => {
    let bgClass = '';

    if (weather.weather[0].main === 'Clear') {
      bgClass = 'clear';
    } else if (weather.weather[0].main === 'Clouds') {
      bgClass = 'cloudy';
    } else if (weather.weather[0].main === 'Rain') {
      bgClass = 'rainy';
    }

    if (hour >= 5 && hour < 12) {
      bgClass += '-morning';
    } else if (hour >= 12 && hour < 18) {
      bgClass += '-afternoon';
    } else if (hour >= 18 && hour < 21) {
      bgClass += '-evening';
    } else {
      bgClass += '-night';
    }

    setBackgroundClass(bgClass);
  };

  const buildDate = (d) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const dayName = days[d.getDay()];
    const day = d.getDate();
    const monthName = months[d.getMonth()];
    const year = d.getFullYear();

    const fullDate = `${dayName}, ${day} ${monthName} ${year}`;
    return fullDate;
  };

  return (
    <div className={`bg ${backgroundClass}`}>
      <main>
        <div className='search-box'>
          <input
            type='text'
            className='search-bar'
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={search}
            placeholder='Search....'
          />
          <button className='icon' onClick={searchButton}>
            <FaSearch />
          </button>
        </div>

        <div>
          {error && <div>{error}</div>}
        </div>

        {weather.name && (
          <div>
            <div className='location'>
              {weather.name}, {weather.sys.country}
            </div>
            <div className='date'>{buildDate(new Date())}</div>
            <div className='tempe'>
              <div className='tempe1'>
                <h1>{weather.main.temp}&deg;C</h1>
              </div>
            </div>
            <div className='type'>
              <h4>{weather.weather[0].main}</h4>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
