document.addEventListener('DOMContentLoaded', function() {
    var searchForm = document.querySelector('#searchForm');
    var weatherContainer = document.querySelector('#weather-container');
    var fiveDayForecast = document.querySelector('#fiveDayForecast');
    var historyContainer = document.querySelector('.past-searches');

    var apiKey = 'd51e3d6f7fd1ae72f7ad89ee634c35f2';

    var loadHistory = function() {
        console.log("Loading history...");
        var city = localStorage.getItem('city');
        if (city) {
            var historyButton = document.createElement('button');
            historyButton.textContent = city;
            historyButton.addEventListener('click', function(event) {
                event.preventDefault();
                getWeather(city);
            }); 
            historyContainer.appendChild(historyButton);
            console.log("History loaded:", city);
        }
    }

    var formSubmission = function(event) {
        event.preventDefault();
        console.log("Form submitted...");
        var city = document.querySelector('#cityInput').value.trim();
        if (city) {
            getWeather(city);
        } else {
            alert('Please enter a city name');
        }
    }

    var getWeather = function(city) {
        console.log("Fetching weather data...");
        fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(weather) {
                    displayWeather(weather);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        });
    }

    var displayWeather = function(weather) {
        // Display current weather
        var temperature = weather.list[0].main.temp;
        var cityName = weather.city.name;
        weatherContainer.innerHTML = `<h2>Current Weather in ${cityName}</h2>`;
        weatherContainer.innerHTML += `<p>Temperature: ${temperature}°F</p>`;

        // Display 5-day forecast
        fiveDayForecast.innerHTML = '<h2>5-Day Forecast:</h2>';
        for (var i = 0; i < 5; i++) { // Adjusted loop to iterate over the next 5 days
            var forecast = weather.list[i * 8]; // Each forecast entry is for 3-hour intervals, so we skip 8 entries to get the next day
            var date = new Date(forecast.dt * 1000); // Convert timestamp to milliseconds
            var dateString = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            var temperature = forecast.main.temp;
            var iconCode = forecast.weather[0].icon;
            var iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

            var forecastCard = document.createElement('div');
            forecastCard.classList.add('forecast-card');

            forecastCard.innerHTML = `
                <p class="date">${dateString}</p>
                <img src="${iconUrl}" alt="Weather icon">
                <p class="temperature">${temperature}°F</p>
            `;

            fiveDayForecast.appendChild(forecastCard);
        }
    }

    searchForm.addEventListener('submit', formSubmission);
    loadHistory();
});
