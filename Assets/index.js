function getWeatherData(city) {
    const apiKey = 'd51e3d6f7fd1ae72f7ad89ee634c35f2'; // Replace with your actual API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            renderWeatherData(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function renderWeatherData(data) {
    // Log weather data to the console
    console.log(data);
}

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('cityInput').value.trim();
    if (city !== '') {
        getWeatherData(city);
    } else {
        alert('Please enter a city name');
    }
});
