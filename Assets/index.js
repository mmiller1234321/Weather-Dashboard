var searchformEl = document.querySelector('#searchForm');
var currentDay = document.querySelector('#weather-container');
var historyEl = document.querySelector('.pastSearches');

var loadHistory = function() {
    var city = localStorage.getItem('city');
    if (city) {
        var cityEl = document.createElement('button');
        cityEl.textContent = city;
        cityEl.addEventListener('click', prevSearchLoad); 
        historyEl.appendChild(cityEl);
    }
}

var prevSearchLoad = function(event) {
    event.preventDefault();
    var pastCity = event.target.textContent;
    getWeather(pastCity);
}

var formSubmission = function(event) {
    event.preventDefault();
    var city = document.querySelector('#cityInput').value.trim();
    if (city) {
        getWeather(city);
    } else {
        alert('Please enter a city name');
    }
}

var getWeather = function(city) {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d51e3d6f7fd1ae72f7ad89ee634c35f2&units=imperial`)
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
    // Your display logic here
}

searchformEl.addEventListener('submit', formSubmission);
loadHistory();
