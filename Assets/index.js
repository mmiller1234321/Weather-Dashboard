// JavaScript code for Weather Dashboard

// Function to fetch weather data from OpenWeatherMap API
function getWeatherData(city) {
    // Replace 'YOUR_API_KEY' with your actual API key from OpenWeatherMap
    const apiKey = 'YOUR_API_KEY';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Process data and update the HTML
        renderWeatherData(data);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  }
  
  // Function to render weather data on the page
  function renderWeatherData(data) {
    // Extract relevant information from the API response
    const cityName = data.city.name;
    const weatherList = data.list;
  
    // Display current weather
    const currentWeather = weatherList[0];
    const temperature = currentWeather.main.temp;
    const humidity = currentWeather.main.humidity;
    const windSpeed = currentWeather.wind.speed;
    // Additional data such as weather icon, date, etc. can be extracted similarly
  
    // Update the HTML with current weather information
    document.getElementById('currentWeather').innerHTML = `
      <h2>Current Weather in ${cityName}</h2>
      <p>Temperature: ${temperature} °C</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${windSpeed} m/s</p>
      <!-- Add additional information as needed -->
    `;
  
    // Display 5-day forecast
    const forecastWeather = weatherList.slice(1, 6); // Extract next 5 days
    const forecastContainer = document.getElementById('fiveDayForecast');
    forecastContainer.innerHTML = '<h2>5-Day Forecast</h2>';
    forecastWeather.forEach((dayWeather) => {
      const date = dayWeather.dt_txt.split(' ')[0];
      const temperature = dayWeather.main.temp;
      // Additional data can be extracted similarly
  
      // Create HTML elements for each day's forecast
      const forecastDay = document.createElement('div');
      forecastDay.classList.add('forecastDay');
      forecastDay.innerHTML = `
        <h3>${date}</h3>
        <p>Temperature: ${temperature} °C</p>
        <!-- Add additional forecast information as needed -->
      `;
  
      // Append forecast day to the forecast container
      forecastContainer.appendChild(forecastDay);
    });
  }
  
  // Event listener for the search button
  document.getElementById('searchBtn').addEventListener('click', function () {
    const city = document.getElementById('searchForm').value.trim();
    if (city !== '') {
      getWeatherData(city);
    } else {
      alert('Please enter a city name');
    }
  });
  
  // Call getWeatherData function with a default city on page load
  getWeatherData('San Diego');
  