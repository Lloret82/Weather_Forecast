// fetch request weather with api key

var getWeather = function (city) {
    const apiKey = 'c4c3822fdff443c09d0fe5ad110dfc2f'
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

    fetch(apiURL)
        .then(function (response) {
            response.json()
            .then(function (data) {
                displayWeather(data, city);
            });
        });
};

// list of global var for DOM

var cities = [];
var cityFormEl = document.querySelector("#city-search-form");
var cityInputEl = document.querySelector("#city");
var weatherContainerEl = document.querySelector("#current-weather-container");
var citySearchInputEl = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var forecastContainerEl = document.querySelector("#fiveday-container");
var pastSearchButtonEl = document.querySelector("#past-search-buttons");

// city input form check, add the new city to cities array and store to local storage
var formSubmit = function (event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    if (city) {
        getWeather(city);
        fiveDays(city);
        cities.unshift({ city });
        cityInputEl.value = "";
    } else {
        alert("Please enter a City");
    }
    store();
    pastSearch(city);
}

// store to local storage

var store = function () {
    localStorage.setItem("cities", JSON.stringify(cities));
};

//function to display the weather

var displayWeather = function (weather, searchCity) {
    weatherContainerEl.textContent = "";
    citySearchInputEl.textContent = searchCity;


//display the city, date and icon followed by a list with temp,humidity,wind speed
    var currentDate = document.createElement("span")
    currentDate.textContent = " (" + moment().format("D MMMM, YYYY, h:mm:ss") + ") ";
    citySearchInputEl.appendChild(currentDate);

    var weatherIcon = document.createElement("img")
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    citySearchInputEl.appendChild(weatherIcon);

    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temp: " + Math.round(weather.main.temp) + " °C";
    temperatureEl.classList = "list-group-item"

    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityEl.classList = "list-group-item"

    var windSpeedEl = document.createElement("span");
    windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " KMH";
    windSpeedEl.classList = "list-group-item"

    weatherContainerEl.appendChild(temperatureEl);

    weatherContainerEl.appendChild(humidityEl);

    weatherContainerEl.appendChild(windSpeedEl);

//variable and function to locate the searched place and get the UV data
    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    getUvIndex(lat, lon)
}

var getUvIndex = function (lat, lon) {
    var apiKey = "c4c3822fdff443c09d0fe5ad110dfc2f"
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                displayUvIndex(data)
            });
        });

}

// get the UV dat and assign the right class

var displayUvIndex = function (index) {
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "list-group-item"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if (index.value <= 2) {
        uvIndexValue.classList = "favorable"
    } else if (index.value > 2 && index.value <= 8) {
        uvIndexValue.classList = "moderate "
    }
    else if (index.value > 8) {
        uvIndexValue.classList = "severe"
    };

    uvIndexEl.appendChild(uvIndexValue);

    weatherContainerEl.appendChild(uvIndexEl);
}

//request function for next 5 daYs weather forecast

var fiveDays = function (city) {
    var apiKey = "c4c3822fdff443c09d0fe5ad110dfc2f"
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`

    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                display5Day(data);
            });
        });
};

//display 5 days forecast

var display5Day = function (weather) {
    forecastContainerEl.textContent = ""
    forecastTitle.textContent = "Next Day Forecast:";

    var forecast = weather.list;
    for (var i = 5; i != forecast.length; i = i += 8) {
        var dailyForecast = forecast[i];


        var forecastEl = document.createElement("div");
        forecastEl.classList = "card bg-secondary text-light m-2";


        var forecastDate = document.createElement("h5")
        forecastDate.textContent = moment.unix(dailyForecast.dt).format(" D MMMM, YYYY");
        forecastDate.classList = "card-header text-center"
        forecastEl.appendChild(forecastDate);


        var weatherIcon = document.createElement("img")
        weatherIcon.classList = "card-body text-center";
        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);

        forecastEl.appendChild(weatherIcon);

        var forecastTempEl = document.createElement("span");
        forecastTempEl.classList = "card-body text-center";
        forecastTempEl.textContent = Math.round(dailyForecast.main.temp) + " °C";

        forecastEl.appendChild(forecastTempEl);

        var forecastHumEl = document.createElement("span");
        forecastHumEl.classList = "card-body text-center";
        forecastHumEl.textContent = dailyForecast.main.humidity + "  %";

        forecastEl.appendChild(forecastHumEl);


        forecastContainerEl.appendChild(forecastEl);
    }

}

var pastSearch = function (pastSearch) {


    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex justify-content-center col-4 W-50 btn-light border";
    pastSearchEl.setAttribute("data-city", pastSearch)
    pastSearchEl.setAttribute("type", "submit");

    pastSearchButtonEl.append(pastSearchEl);
}


var previousCitySearch = function (event) {
    var city = event.target.getAttribute("data-city")
    if (city) {
        getWeather(city);
        fiveDays(city);
    }
}


cityFormEl.addEventListener("submit", formSubmit);
pastSearchButtonEl.addEventListener("click", previousCitySearch);