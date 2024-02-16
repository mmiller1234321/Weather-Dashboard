// Points to input form
var searchformEl = document.querySelector('#searchForm');
// Points to the blue search button
var searchButton = document.querySelector('#searchBtn');
// Points to weather container
var currentDay = document.querySelector('#weather-container');
// Points to five-day forecast container
var fiveDay = document.querySelector('#fiveDayForecast');
// Points to area for search history
var historyEl = document.querySelector('.pastSearches');
// Points to all dynamically created buttons under search button
var pastSearchButtons = document.querySelectorAll('.pastSearches button');

// Function that takes items out of local storage to display on page
var loadHistory = function() {
    var city = localStorage.getItem('city');
    if (!city) {
        return false;
    }
    var cityEl = document.createElement('button');
    cityEl.setAttribute('data-city', city);
    cityEl.textContent = city;
    cityEl.addEventListener('click', prevSearchLoad); 
    historyEl.appendChild(cityEl);
}

// Function for loading previously searched data
var prevSearchLoad = function(event) {
    event.preventDefault();
    var pastCity = event.target.getAttribute('data-city');
    getGeoCode(pastCity);
}

// Function that works on search button being clicked
var formSubmission = function(event) {
    event.preventDefault();
    var city = document.querySelector('#searchForm').value.trim();
    searchformEl.value = "";
    if (city) {
        getGeoCode(city);
    } else {
        alert('Please enter a city name');
    }
}

// Function that takes the name of a city and turns it into coordinates that the weather API can use
var getGeoCode = function(city) {
    var geoUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=d5d879a5a7dac48b5c30575d2453e07b";
    fetch(geoUrl).then(function (response){
        if (response.ok) {
            response.json().then(function (cords) {
                if (cords[0].name !== localStorage.getItem('city')) {
                    loadHistory();
                    localStorage.setItem('city', cords[0].name);
                    getWeather(cords[0].lat, cords[0].lon);
                } else{
                    getWeather(cords[0].lat, cords[0].lon);
                }
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    });
}

// Function that takes in coordinates and gets weather data for the location
var getWeather = function(lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?&lat=" + lat + "&lon=" + lon + "&units=imperial&appid=d5d879a5a7dac48b5c30575d2453e07b";
    fetch(apiUrl).then(function (response){
        if (response.ok) {
            response.json().then(function (weather) {
                displayWeather(weather)
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    });
}

// Function that takes in weather data and renders it to the page
var displayWeather = function(weather){
    currentDay.textContent = "";

    var currentWeather = weather.list[0];
    var currentTemp = currentWeather.main.temp;
    var currentHumidity = currentWeather.main.humidity;
    var currentWind = currentWeather.wind.speed;
    var currentIcon = currentWeather.weather[0].icon;
    var currentIconUrl = "http://openweathermap.org/img/w/" + currentIcon + ".png";
    var currentCity = weather.city.name;
    var currentCountry = weather.city.country;
    var currentDate = dayjs().format('MMMM D YYYY');

    var currentWeatherEl = document.createElement('div');
    currentWeatherEl.classList = 'card bg-light text-dark';

    var currentHeaderEl = document.createElement('h3');
    currentHeaderEl.classList = 'card-header';
    currentHeaderEl.textContent = currentCity + ", " + currentCountry + " (" + currentDate + ")";
    currentWeatherEl.appendChild(currentHeaderEl);

    var currentBodyEl = document.createElement('div');
    currentBodyEl.classList = 'card-body';
    currentWeatherEl.appendChild(currentBodyEl);

    var currentIconEl = document.createElement('img');
    currentIconEl.setAttribute('src', currentIconUrl);
    currentBodyEl.appendChild(currentIconEl);

    var currentTempEl = document.createElement('p');
    currentTempEl.classList = 'card-text';
    currentTempEl.textContent = "Temperature: " + currentTemp + "°F";
    currentBodyEl.appendChild(currentTempEl);

    var currentHumidityEl = document.createElement('p');
    currentHumidityEl.classList = 'card-text';
    currentHumidityEl.textContent = "Humidity: " + currentHumidity + "%";
    currentBodyEl.appendChild(currentHumidityEl);

    var currentWindEl = document.createElement('p');
    currentWindEl.classList = 'card-text';
    currentWindEl.textContent = "Wind Speed: " + currentWind + " MPH";
    currentBodyEl.appendChild(currentWindEl);

    currentDay.appendChild(currentWeatherEl);

    var fiveDayHeader = document.createElement('h3');
    fiveDayHeader.textContent = "5-Day Forecast:";
    currentDay.appendChild(fiveDayHeader);

    var fiveDayRow = document.createElement('div');
    fiveDayRow.classList = 'row';
    currentDay.appendChild(fiveDayRow);

    for (var i = 1; i < 6; i++) {
        var fiveDayCol = document.createElement('div');
        fiveDayCol.classList = 'col-md-2';
        fiveDayRow.appendChild(fiveDayCol);

        var fiveDayCard = document.createElement('div');
        fiveDayCard.classList = 'card bg-primary text-light';
        fiveDayCol.appendChild(fiveDayCard);

        var fiveDayBody = document.createElement('div');
        fiveDayBody.classList = 'card-body';
        fiveDayCard.appendChild(fiveDayBody);

        var fiveDayDate = document.createElement('h5');
        fiveDayDate.classList = 'card-title';
        fiveDayDate.textContent = dayjs().add(i, 'day').format('MMMM D YYYY');
        fiveDayBody.appendChild(fiveDayDate);

        var fiveDayIcon = document.createElement('img');
        var fiveDayIconUrl = "http://openweathermap.org/img/w/" + weather.list[i].weather[0].icon + ".png";
        fiveDayIcon.setAttribute('src', fiveDayIconUrl);
        fiveDayBody.appendChild(fiveDayIcon);

        var fiveDayTemp = document.createElement('p');
        fiveDayTemp.classList = 'card-text';
        fiveDayTemp.textContent = "Temp: " + weather.list[i].main.temp + "°F";
        fiveDayBody.appendChild(fiveDayTemp);

        var fiveDayHumidity = document.createElement('p');
        fiveDayHumidity.classList = 'card-text';
        fiveDayHumidity.textContent = "Humidity: " + weather.list[i].main.humidity + "%";
        fiveDayBody.appendChild(fiveDayHumidity);
    }
}

searchButton.addEventListener('click', formSubmission);

