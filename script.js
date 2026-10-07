

const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");

const weatherCard = document.getElementById("weatherCard");
const errorMessage = document.getElementById("errorMessage");
const loading = document.getElementById("loading");

const cityName = document.getElementById("cityName");
const weatherDescription = document.getElementById("weatherDescription");
const weatherIcon = document.getElementById("weatherIcon");

const temperature = document.getElementById("temperature");
const temperatureUnit = document.getElementById("temperatureUnit");

const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");

const celsiusBtn = document.getElementById("celsiusBtn");
const fahrenheitBtn = document.getElementById("fahrenheitBtn");

let currentTemperatureCelsius = null;

// Search weather
searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    getWeather(city);
});

// Fetch weather data
async function getWeather(city) {

    hideError();
    loading.style.display = "block";

    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found. Please check the city name.");
            }

            throw new Error("Unable to fetch weather data.");
        }

        const data = await response.json();

        displayWeather(data);

    } catch (error) {

        showError(error.message);

    } finally {

        loading.style.display = "none";
    }
}

// Display weather
function displayWeather(data) {

    cityName.textContent = `${data.name}, ${data.sys.country}`;

    weatherDescription.textContent =
        data.weather[0].description;

    currentTemperatureCelsius = data.main.temp;

    temperature.textContent =
        Math.round(currentTemperatureCelsius);

    temperatureUnit.textContent = "°C";

    humidity.textContent =
        `${data.main.humidity}%`;

    windSpeed.textContent =
        `${data.wind.speed} m/s`;

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    weatherIcon.alt =
        data.weather[0].description;

    celsiusBtn.classList.add("active");
    fahrenheitBtn.classList.remove("active");
}

// Celsius
celsiusBtn.addEventListener("click", function () {

    if (currentTemperatureCelsius === null) {
        return;
    }

    temperature.textContent =
        Math.round(currentTemperatureCelsius);

    temperatureUnit.textContent = "°C";

    celsiusBtn.classList.add("active");
    fahrenheitBtn.classList.remove("active");
});

// Fahrenheit
fahrenheitBtn.addEventListener("click", function () {

    if (currentTemperatureCelsius === null) {
        return;
    }

    const fahrenheit =
        (currentTemperatureCelsius * 9 / 5) + 32;

    temperature.textContent =
        Math.round(fahrenheit);

    temperatureUnit.textContent = "°F";

    fahrenheitBtn.classList.add("active");
    celsiusBtn.classList.remove("active");
});

// Show error
function showError(message) {

    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}

// Hide error
function hideError() {

    errorMessage.textContent = "";
    errorMessage.style.display = "none";
}