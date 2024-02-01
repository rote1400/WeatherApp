const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");

const KEY = "2abb4416717d1e1b37ce607e0476dab1";

const createWeatherCard = (weatherElement) => {
    return `<li class="card">
                <h3>(2023-06-18)</h3>
                <img src="https://openweathermap.org/img/wn/10d@2x.png" alt="weather-icon">
                <h4>Temp: 19.10<span>&#8451;</span></h4>
                <h4>Wind: 4.31 M/S</h4>
                <h4>Humidity: 79%</h4>
            </li>`;
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
        
        console.log(fiveDaysForecast);
        fiveDaysForecast.forEach(weatherElement => {
            createWeatherCard(weatherElement);
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

searchBtn.addEventListener("click", getCityCoordinates);