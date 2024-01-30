import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState();

  const getGeoLocation = () => {
    return new Promise((resolve, reject) => {
      try {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("Latitude:", position.coords.latitude.toFixed(4));
                console.log("Longitude:", position.coords.longitude.toFixed(4));
                resolve({
                    latitude: position.coords.latitude.toFixed(4),
                    longitude: position.coords.longitude.toFixed(4)
                });
            },
            (error) => {
                reject("Error fetching location: " + error.message);
            }
        );
      } catch (error) {
          reject("Error fetching location: " + error.message);
      }
    });
  };

  getGeoLocation();

  const getWeather = async (latitude, longitude) => {
    try {
      const results = await fetch("http://localhost:3001/", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ lat: latitude, lon: longitude })
      });
      const response = await results.json();
      console.log(response);
      setWeatherData(response);
    } catch (error) {
      console.log("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <div className="App">
      <h1>Weather App</h1>

      {weatherData && (
        <div className="weather-container">
          <h2>Weather Information</h2>
          <h3>Location: {weatherData.resolvedAddress}</h3>
          <h4>{weatherData.description}</h4>
          <h5>Current Conditions</h5>
          <div className="weatherInfo">
            <p>Temperature: {weatherData.currentConditions.temp}</p>
            <p>Humidity: {weatherData.currentConditions.humidity}</p>
            <p>Conditions: {weatherData.currentConditions.conditions}</p>
            <p>Windspeed: {weatherData.currentConditions.windspeed} km/h</p>
            <p>Windgust: {weatherData.currentConditions.windgust} km/h</p>
            <p>Visibility: {weatherData.currentConditions.visibility}</p>
            <p>UV Index: {weatherData.currentConditions.uvindex}</p>
          </div>
          <div className="sunrise-sunset">
              <p>Sunrise: {weatherData.currentConditions.sunrise}</p>
              <p>Sunset: {weatherData.currentConditions.sunset}</p>
            </div>
        </div>
      )}
      <div className="sevenDay-container">
        <table className="weather-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Temperature</th>
              <th>Conditions</th>
              <th>Humidity</th>
              <th>Windspeed</th>
              <th>Sunrise</th>
              <th>Sunset</th>
            </tr>
          </thead>
          <tbody>
            {/* Mapping through the data from the API to pull a 7 day forcast */}
            { weatherData?.days?.map((day)=>
              <tr key={day.datetime}>
                <td>{day.datetime}</td>
                <td>{day.temp}</td>
                <td>{day.conditions}</td>
                <td>{day.humidity}</td>
                <td>{day.windspeed}</td>
                <td>{day.sunrise}</td>
                <td>{day.sunset}</td>           
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="footer">
        <p>&copy; 2024 Weather App. All rights reserved.</p>
      </div>
    </div>
  );
}

export default App;
