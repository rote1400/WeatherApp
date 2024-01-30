const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");

const KEY = "2abb4416717d1e1b37ce607e0476dab1";

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); // Get user's prompt entered city name and remove extra spaces
    if(!cityName) {
        return;
    }

    const GEOCODING = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${KEY}`;

    fetch(GEOCODING).then(res => res.json()).then(data => {
        if(!data.length) {
            return alert(`No coordinates found found for ${cityName}`);
        }
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert(`An error occurred while fetching the coordinates!`);
    });
}

searchBtn.addEventListener("click", getCityCoordinates);