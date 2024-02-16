document.addEventListener('DOMContentLoaded', function() {
    var searchformEl = document.querySelector('#searchForm');
    var searchInput = document.querySelector('#searchInput');
    var searchButton = document.querySelector('#searchBtn');
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
        getGeoCode(pastCity);
    }

    var formSubmission = function(event) {
        event.preventDefault();
        var city = searchInput.value.trim();
        searchInput.value = "";
        if (city) {
            getGeoCode(city);
        } else {
            alert('Please enter a city name');
        }
    }

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

    var getWeather = function(lat, lon) {
        var lat = lat;
        var lon = lon;
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
});
