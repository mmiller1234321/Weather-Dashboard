
//geocord base link
//http://api.openweathermap.org/geo/1.0/direct?q={city name}&limit={1}&appid={d5d879a5a7dac48b5c30575d2453e07b}
//5day api base link
//api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units=imperial&appid={d5d879a5a7dac48b5c30575d2453e07b}
//points to input form
var searchformEl = document.querySelector('#searchForm');
//points to the blue search button
var searchButton = document.querySelector('#searchBtn');
//points to weather container
var currentDay = document.querySelector('#weather-container');
//points to fivedayforecast container
var fiveDay = document.querySelector('#fiveDayForecast');
//points to area for search history
var historyEl = document.querySelector('.pastSearches');
//points to all dynamically created buttons under search button
var pastSearchButtons = document.querySelectorAll('.pastSearches button');

//function that takes items out of local storage to display on page
var loadHistory = function() {
    //puts previous city location into a variable
    var city = localStorage.getItem('city');
    //stop function execution if there wasnt anything in localstorage
    if (!city) {
        return false;
    }
    //creates a button element
    var cityEl = document.createElement('button');
    //assign data-city so we can pull the information later
    cityEl.setAttribute('data-city', city);
    //assigns the text inside of the button
    cityEl.textContent = city;
    //adds an event listener
    cityEl.addEventListener('click', prevSearchLoad); 
    //appends to history
    historyEl.appendChild(cityEl);
}
//function for loading previously searched data
var prevSearchLoad = function(event) {
    event.preventDefault();
    //puts the data-city value from the history button into a variable
    var pastCity = event.target.getAttribute('data-city');
    //passes that variable to the function that starts the api calls
    getGeoCode(pastCity);
}

// function that works on search button being clicked
var formSubmission = function(event) {
    event.preventDefault();
    //takes the form text and puts it into a variable that is passed to function getGeoCode
    var city = document.querySelector('#searchForm').value.trim();
    searchformEl.value = "";
    if (city) {
        getGeoCode(city);
    } else {
        //alert popup if you input nothing into the text box and click search
        alert('Please enter a city name');
    }
}
//function that takes the name of a city and turns it into coordinates that the weather api can use
var getGeoCode = function(city) {
    var geoUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=d5d879a5a7dac48b5c30575d2453e07b";
   //fetch request from above url
    fetch(geoUrl).then(function (response){
        //if loop to check for a positive response from the fetch request
        if (response.ok) {
            response.json().then(function (cords) {
                //nested loop that checks if the city your searching for differs from the last local storage input
                //if user input city differs from local storage then it runs loadHistory to add the previous city, adds the current city to local storage, and pushing coordinates to getWeather
                //if user input is the same as local storage it will just push the coordinates along to getWeather without adding the same city to location history
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
//function that takes in coordinates and gets weather data for the location
var getWeather = function(lat, lon) {
    //lat = latitude lon = longitude 
    var lat = lat;
    var lon = lon;
    //5 day weather forecast api url with units in imperial
    var apiUrl = 
    "https://api.openweathermap.org/data/2.5/forecast?&lat=" + lat + "&lon=" + lon + "&units=imperial&appid=d5d879a5a7dac48b5c30575d2453e07b";
    //fetch call to get weather data and if/else statement checking if a positive response came back.
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
//function that takes in weather data and renders it to the page
var displayWeather = function(weather){
    //wipes previous search results
    currentDay.textContent = "";

   //variable for current days weather data
    var currentWeather = weather.list[0];
    //variable for current days temperature
    var currentTemp = currentWeather.main.temp;
    //variable for current days humidity
    var currentHumidity = currentWeather.main.humidity;
    //variable for current days wind speed
    var currentWind = currentWeather.wind.speed;
    //variable for current days weather icon (clouds, sun, rain)
    var currentIcon = currentWeather.weather[0].icon;
    ////variable that points to weather icons based on previous variable
    var currentIconUrl = "http://openweathermap.org/img/w/" + currentIcon + ".png";
    //variable for city name
    var currentCity = weather.city.name;
    //variable for country name(only intitials)
    var currentCountry = weather.city.country;
    //dayjs variable for the current date
    var currentDate = dayjs().format('MMMM D YYYY');

    //creates div element for current day weather
    var currentWeatherEl = document.createElement('div');
    //bootstrap classes that adds card component, background color light, and dark text color
    currentWeatherEl.classList = 'card bg-white text-dark d-flex flex-column align-items-start';
    //creates h3 where you find the city, country, date
    var currentHeaderEl = document.createElement('h3');
    currentHeaderEl.textContent = currentCity + ", " + currentCountry + " (" + currentDate + ")";
    //appends the h3 to the div
    currentWeatherEl.appendChild(currentHeaderEl);

    // Add an img tag with the src html of currentIconUrl(sun,cloudy,rainy icons) and appends it to the body div
    var currentIconEl = document.createElement('img');
    currentIconEl.setAttribute('src', currentIconUrl);
    currentIconEl.classList = 'mt-2'; // Adjust margin top for spacing
    //appends the icon to the div
    currentWeatherEl.appendChild(currentIconEl);

    //creates a div to contain temperature, humidity, and wind speed
    var currentBodyEl = document.createElement('div');
    currentBodyEl.classList = 'card-body text-center';
    //appends the div to the div
    currentWeatherEl.appendChild(currentBodyEl);

    // Add paragraph tags to the card body with the temperature, humidity, and wind speed. Also adds the bootstrap class card text.
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

    //appends the date to the daily weather header
    currentDay.appendChild(currentWeatherEl);

    //creates a h3 for the 5 day weather forecast section under the daily weather card
    var fiveDayHeader = document.createElement('h3');
    fiveDayHeader.textContent = "5-Day Forecast:";
    currentDay.appendChild(fiveDayHeader);

    //creates a five day weather forecase division with the bootstrap class row which applies flex wrap and margins
    var fiveDayRow = document.createElement('div');
    fiveDayRow.classList = 'row';
    currentDay.appendChild(fiveDayRow);

    //a for loop that renders the content for the 5 day weather forecast
    for (var i = 1; i < 6; i++) {
        //creates a div for each day with a bootstrap class that sets spacing and flexbox alignment
        var fiveDayCol = document.createElement('div');
        fiveDayCol.classList = 'col-md-2';
        fiveDayRow.appendChild(fiveDayCol);

        //creates a div inside of the div above and adds a bootstrap card with a blue color and white text. Appends to the div above
        var fiveDayCard = document.createElement('div');
        fiveDayCard.classList = 'card bg-primary text-light';
        fiveDayCol.appendChild(fiveDayCard);

        //creates a div inside of the div above and adds the bootstrap card body. Appends to the div above
        var fiveDayBody = document.createElement('div');
        fiveDayBody.classList = 'card-body';
        fiveDayCard.appendChild(fiveDayBody);

        //creates a h5 element that gets a bootstrap card title class and then gets the date added from dayjs
        var fiveDayDate = document.createElement('h5');
        fiveDayDate.classList = 'card-title';
        fiveDayDate.textContent = dayjs().add(i, 'day').format('MMMM D YYYY');
        fiveDayBody.appendChild(fiveDayDate);

        //creates an img tag with an html linking to an openweater icon pulled from the data
        var fiveDayIcon = document.createElement('img');
        var fiveDayIconUrl = "http://openweathermap.org/img/w/" + weather.list[i].weather[0].icon + ".png";
        fiveDayIcon.setAttribute('src', fiveDayIconUrl);
        fiveDayBody.appendChild(fiveDayIcon);

        // Add paragraph tags to the card body with the temperature, humidity, and wind speed. Also adds the bootstrap class card text.
        var fiveDayTemp = document.createElement('p');
        fiveDayTemp.classList = 'card-text';
        fiveDayTemp.textContent = "Temp: " + weather.list[i].main.temp + "°F";
        fiveDayBody.appendChild(fiveDayTemp);

        var fiveDayHumidity = document.createElement('p');
        fiveDayHumidity.classList = 'card-text';
        fiveDayHumidity.textContent = "Humidity: " + weather.list[i].main.humidity + "%";
        fiveDayBody.appendChild(fiveDayHumidity);

        var fiveDayWindSpeed = document.createElement('p');
        fiveDayWindSpeed.classList = 'card-text';
        fiveDayWindSpeed.textContent = "Wind Speed: " + weather.list[i].wind.speed + " MPH";
        fiveDayBody.appendChild(fiveDayWindSpeed);
    }
}

//event listener for search button that runs the first in a of series of functions to get weather data
searchButton.addEventListener('click', formSubmission);
