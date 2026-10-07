/* =========================================
   ELEMENTS
========================================= */

const searchForm =
    document.getElementById("searchForm");

const cityInput =
    document.getElementById("cityInput");

const errorMessage =
    document.getElementById("errorMessage");

const loading =
    document.getElementById("loading");

const cityName =
    document.getElementById("cityName");

const weatherDescription =
    document.getElementById("weatherDescription");

const weatherIcon =
    document.getElementById("weatherIcon");

const temperature =
    document.getElementById("temperature");

const temperatureUnit =
    document.getElementById("temperatureUnit");

const humidity =
    document.getElementById("humidity");

const windSpeed =
    document.getElementById("windSpeed");

const feelsLike =
    document.getElementById("feelsLike");

const celsiusBtn =
    document.getElementById("celsiusBtn");

const fahrenheitBtn =
    document.getElementById("fahrenheitBtn");


/* =========================================
   VARIABLES
========================================= */

let currentTemperatureCelsius = null;

let currentFeelsLikeCelsius = null;


/* =========================================
   SEARCH FORM
========================================= */

searchForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const city =
            cityInput.value.trim();


        if (!city) {

            showError(
                "Please enter a city name."
            );

            return;
        }


        getWeather(city);
    }
);


/* =========================================
   GET WEATHER
========================================= */

async function getWeather(city) {

    hideError();

    loading.style.display = "flex";


    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;


    try {

        const response =
            await fetch(url);


        if (!response.ok) {

            if (response.status === 404) {

                throw new Error(
                    "City not found. Please check the city name."
                );
            }


            if (response.status === 401) {

                throw new Error(
                    "Weather service authorization failed."
                );
            }


            throw new Error(
                "Unable to fetch weather data."
            );
        }


        const data =
            await response.json();


        displayWeather(data);

    } catch (error) {

        showError(
            error.message
        );

    } finally {

        loading.style.display =
            "none";
    }
}


/* =========================================
   DISPLAY WEATHER
========================================= */

function displayWeather(data) {

    cityName.textContent =
        `${data.name}, ${data.sys.country}`;


    weatherDescription.textContent =
        data.weather[0].description;


    currentTemperatureCelsius =
        data.main.temp;


    currentFeelsLikeCelsius =
        data.main.feels_like;


    temperature.textContent =
        Math.round(
            currentTemperatureCelsius
        );


    temperatureUnit.textContent =
        "°C";


    humidity.textContent =
        `${data.main.humidity}%`;


    windSpeed.textContent =
        `${data.wind.speed.toFixed(2)} m/s`;


    feelsLike.textContent =
        `${Math.round(
            currentFeelsLikeCelsius
        )}°C`;


    const iconCode =
        data.weather[0].icon;


    /*
       Clear sky:
       01d = CSS SUN
       01n = CSS MOON

       We do not use the ugly
       OpenWeather clear-sky circle.
    */

    if (
        iconCode === "01d" ||
        iconCode === "01n"
    ) {

        weatherIcon.style.display =
            "none";

    } else {

        weatherIcon.src =
            `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        weatherIcon.alt =
            data.weather[0].description;
    }


    celsiusBtn.classList.add(
        "active"
    );

    fahrenheitBtn.classList.remove(
        "active"
    );


    updateWeatherTheme(
        data,
        iconCode
    );
}


/* =========================================
   WEATHER THEME
========================================= */

function updateWeatherTheme(
    data,
    iconCode
) {

    document.body.className = "";


    const weather =
        data.weather[0].main.toLowerCase();


    const temperatureValue =
        data.main.temp;


    /* =====================================
       NIGHT
    ====================================== */

    if (
        iconCode.endsWith("n")
    ) {

        document.body.classList.add(
            "weather-night"
        );

        return;
    }


    /* =====================================
       THUNDERSTORM
    ====================================== */

    if (
        weather.includes(
            "thunderstorm"
        )
    ) {

        document.body.classList.add(
            "weather-storm"
        );

        return;
    }


    /* =====================================
       RAIN
    ====================================== */

    if (
        weather.includes("rain") ||
        weather.includes("drizzle")
    ) {

        document.body.classList.add(
            "weather-rain"
        );

        return;
    }


    /* =====================================
       SNOW
    ====================================== */

    if (
        weather.includes("snow")
    ) {

        document.body.classList.add(
            "weather-snow"
        );

        return;
    }


    /* =====================================
       CLOUDS
    ====================================== */

    if (
        weather.includes("cloud")
    ) {

        document.body.classList.add(
            "weather-clouds"
        );

        return;
    }


    /* =====================================
       HOT DAY
    ====================================== */

    if (
        temperatureValue >= 30
    ) {

        document.body.classList.add(
            "weather-hot"
        );

        return;
    }


    /* =====================================
       NORMAL DAY
    ====================================== */

    document.body.classList.add(
        "weather-day"
    );
}


/* =========================================
   CELSIUS
========================================= */

celsiusBtn.addEventListener(
    "click",
    function () {

        if (
            currentTemperatureCelsius === null
        ) {
            return;
        }


        temperature.textContent =
            Math.round(
                currentTemperatureCelsius
            );


        temperatureUnit.textContent =
            "°C";


        feelsLike.textContent =
            `${Math.round(
                currentFeelsLikeCelsius
            )}°C`;


        celsiusBtn.classList.add(
            "active"
        );


        fahrenheitBtn.classList.remove(
            "active"
        );
    }
);


/* =========================================
   FAHRENHEIT
========================================= */

fahrenheitBtn.addEventListener(
    "click",
    function () {

        if (
            currentTemperatureCelsius === null
        ) {
            return;
        }


        const fahrenheit =
            (
                currentTemperatureCelsius *
                9 / 5
            ) + 32;


        const feelsLikeFahrenheit =
            (
                currentFeelsLikeCelsius *
                9 / 5
            ) + 32;


        temperature.textContent =
            Math.round(
                fahrenheit
            );


        temperatureUnit.textContent =
            "°F";


        feelsLike.textContent =
            `${Math.round(
                feelsLikeFahrenheit
            )}°F`;


        fahrenheitBtn.classList.add(
            "active"
        );


        celsiusBtn.classList.remove(
            "active"
        );
    }
);


/* =========================================
   ERROR
========================================= */

function showError(message) {

    errorMessage.textContent =
        message;

    errorMessage.style.display =
        "block";
}


function hideError() {

    errorMessage.textContent =
        "";

    errorMessage.style.display =
        "none";
}