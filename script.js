const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const locationBtn = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const KEY = "2abb4416717d1e1b37ce607e0476dab1";

const createWeatherCard = (cityName, weatherElement, index) => {
    if(index === 0) { // HTML for the current weather card
        return `<div class="details">
                    <h2>${cityName} (${weatherElement.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature: ${(weatherElement.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>Wind: ${weatherElement.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherElement.main.humidity}%</h4>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherElement.weather[0].icon}@4x.png" alt="weather-icon">
                    <h4>${weatherElement.weather[0].description}</h4>
                </div>`;
    } else { // HTML for the forecast weather cards
        return `<li class="card">
                    <h3>(${weatherElement.dt_txt.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherElement.weather[0].icon}@2x.png" alt="weather-icon">
                    <h4>Temp: ${(weatherElement.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>Wind: ${weatherElement.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherElement.main.humidity}%</h4>
                </li>`;
    }
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_CALL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${KEY}`;

    fetch(WEATHER_API_CALL).then(res => res.json()).then(data => {
        // Filter the forecast to get only one forecast per day
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });
        
        //Clearing previous weather data
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        // Creating weather cards and adding them to the DOM
        console.log(data);
        fiveDaysForecast.forEach((weatherElement, index) => {
            if(index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherElement, index));
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherElement, index));
            }
        });
    }).catch(() => {
        alert(`An error occurred while fetching the weather forecast!`);
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); // Get user's prompt entered city name and remove extra spaces
    if(!cityName) {
        return;
    }

    const GEOCODING = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${KEY}`;

    // Entered city coordinates
    fetch(GEOCODING).then(res => res.json()).then(data => {
        if(!data.length) {
            return alert(`No coordinates found for ${cityName}`);
        }
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert(`An error occurred while fetching the coordinates!`);
    });
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${KEY}`;

            // Entered city coordinates
            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
                const cityNameFromCoords = data[0];
                getWeatherDetails(cityNameFromCoords, latitude, longitude);
            }).catch(() => { // Error when user denied location permission
                alert(`An error occurred while fetching the city!`);
            });
        },
        error => {
            if(error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please grant access again.");
            }
        }
    );
}

searchBtn.addEventListener("click", getCityCoordinates);
locationBtn.addEventListener("click", getUserCoordinates);