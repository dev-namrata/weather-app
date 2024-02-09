import logo from './logo.svg';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

function App() {
  let timerId = useRef();
  const [cityWeather, setCityWeather] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [data, setData] = useState(responseData);
  console.log(responseData, 'responseData');

  const handleSelectCity = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    // const cityData = {
    //   [name]: value,
    // };
    // console.log(cityData, 'cityData');
    setCityWeather(value);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://api.openweathermap.org/data/2.5/weather',
        // `http://api.openweathermap.org/geo/1.0/direct?q=${cityWeather.trim()}&limit=5&appid=19249a180a908d055e1bac7e68578e04`
        {
          params: {
            q: cityWeather,
            appid: '4f230899c7df4730762731dcefcbb2af',
            units: 'metric',
          },
        }
      );
      setResponseData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
    // setCityWeather('');
  };

  useEffect(() => {
    clearTimeout(timerId.current);
    timerId.current = setTimeout(() => {
      setData(
        responseData?.filter((el) =>
          el?.responseData?.name.includes(cityWeather.toLowerCase())
        )
      );
      fetchData();
    }, 5000);
  }, [cityWeather]);

  return (
    <div className="App">
      <h4>Search Weather for your city</h4>
      <div>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            name="city"
            value={cityWeather}
            onChange={handleSelectCity}
          />
          {/* <button type="submit">Search</button> */}
        </form>
        <div>
          {responseData && (
            <div>
              <button
                style={{
                  borderRadius: '10px',
                  backgroundColor: '#4e4d4a',
                  color: 'white',
                }}
              >
                {responseData?.main?.temp}°C
              </button>
              <span>
                {responseData?.name},{responseData?.sys?.country}{' '}
                {responseData?.weather[0].description} temperature from{' '}
                {responseData.main.temp_min} to {responseData.main.temp_max} °C
                , wind {responseData.wind.speed} m/s. clouds{' '}
                {responseData.clouds.all} % , {responseData.main.pressure} hpa
              </span>
              <br />
              <span>
                Geo coords [
                {[responseData?.coord?.lat, responseData?.coord?.lon].join(',')}
                ]
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
