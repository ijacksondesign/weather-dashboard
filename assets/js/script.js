var userSearchEl = document.querySelector(".city-search");
var searchFormEl = document.querySelector(".search-bar");
var currentCityEl = document.querySelector(".city-info");
var currentWeatherEl = document.querySelector(".weather-info");
var heroImageEl = document.querySelector(".main-weather");
var fiveDayEl = document.querySelector(".five-day-forecast");

var getCityWeather = function(city) {
    // weather api
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=fc127e8ad0327bd54aa8b403959d0ff1";

    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            console.log(data);
            displayCurrentWeather(data, city);
            changeHeroBg(data);
            displayFiveDayWeather(city);
        })
    })
};

var displayCurrentWeather = function(weather, city) {
    // erase old city weather
    currentCityEl.innerHTML = "";
    currentWeatherEl.innerHTML = "";

    // display city name
    var cityNameEl = document.createElement("h2");
    cityNameEl.classList = "city";
    cityNameEl.textContent = city;

    currentCityEl.appendChild(cityNameEl);
    
    // date format
    var dateFormat = ("MM/DD/YYYY");

    // reformatted date
    var currentDate = moment().format(dateFormat);

    // display current date
    var currentDateEl = document.createElement("h2");
    currentDateEl.classList = "date";
    currentDateEl.textContent = currentDate;

    currentCityEl.appendChild(currentDateEl);

    // display temperature
    var tempEl = document.createElement("div");
    tempEl.classList = "current-weather";
    tempEl.innerHTML = "<h2 class='temp'>" + Math.ceil(weather.main.temp) + "<sup class='current-degrees'>o</sup></h2>";

    currentWeatherEl.appendChild(tempEl);

    // display weather conditions
    var weatherConditionsEl = document.createElement("div");
    weatherConditionsEl.classList = "current-secondary-weather";
    weatherConditionsEl.innerHTML =
    "<h3>Humidity: <span class='humidity-perc'>" + weather.main.humidity + "%</span></h3><br />"
    + "<h3>Wind Speed: <span class='wind-speed'>" + weather.wind.speed + "%</span></h3><br />" ;

    currentWeatherEl.appendChild(weatherConditionsEl);

    // get uv index data
    var getDisplayUV = function(weather) {
        var apiUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + weather.coord.lat + "&lon=" + weather.coord.lon + "&appid=fc127e8ad0327bd54aa8b403959d0ff1";

        fetch(apiUrl).then(function(response) {
            response.json().then(function(data) {
                // display uv index
                var uvIndex = data;
                var uvIndexEl = document.createElement("h3");
                
                if (uvIndex.value < 3) {
                    uvIndexEl.innerHTML = "UV Index: <span class='uv-warning uv-favorable'>" + uvIndex.value + "</span>"
                }

                else if (uvIndex.value > 7) {
                    uvIndexEl.innerHTML = "UV Index: <span class='uv-warning uv-severe'>" + uvIndex.value + "</span>"
                }

                else {
                    uvIndexEl.innerHTML = "UV Index: <span class='uv-warning uv-moderate'>" + uvIndex.value + "</span>"
                }

                var weatherConditionsEl = document.querySelector(".current-secondary-weather");
                weatherConditionsEl.appendChild(uvIndexEl);
            })
        })
    }

    getDisplayUV(weather);
};

var changeHeroBg = function(weather) {
    heroImageEl.classList = "main-weather main-weather-display"
    
    if (weather.weather[0].id < 600) {
        heroImageEl.classList.add("rainy");
    }
    else if (weather.weather[0].id >= 600 && weather.weather[0].id < 700) {
        heroImageEl.classList.add("snowy");
    }
    else if (weather.weather[0].id > 700 && weather.weather[0].id < 800) {
        heroImageEl.classList.add("foggy");
    }
    else if (weather.weather[0].id === 800) {
        heroImageEl.classList.add("sunny");
    }
    else {
        heroImageEl.classList.add("cloudy");
    }
};

var displayFiveDayWeather = function(city) {
    fiveDayEl.innerHTML = "";

    // weather api
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=fc127e8ad0327bd54aa8b403959d0ff1";

    fetch(apiUrl).then(function(response) {
        response.json().then(function(weather) {
            for (var i = 1; i < weather.list.length; i+=8) {
                console.log(weather);
                // creates a div to house weather info
                var nextDay = document.createElement("div");
                nextDay.classList = "five-day";
                nextDay.setAttribute("data-five-day", i);
        
                fiveDayEl.appendChild(nextDay);
                
                nextDay = document.querySelector("[data-five-day='" + i + "']");
        
                // get current date
                var currentDateTime = weather.list[i].dt_txt;
        
                // split date and time
                var splitDateTime = currentDateTime.split(" ");
                
                // date formats
                var dayDateFormat = ("dddd");
                var fullDateFormat = ("MM/DD/YYYY")
        
                // reformatted date
                var currentDayDate = moment(splitDateTime[0]).format(dayDateFormat);
                
                // create date headers for five day forecast
                var dayDate = document.createElement("h4");
                dayDate.textContent = currentDayDate;
                nextDay.appendChild(dayDate);
        
                var currentFullDate = moment(splitDateTime[0]).format(fullDateFormat);
        
                var fullDate = document.createElement("h5");
                fullDate.textContent = currentFullDate;
                nextDay.appendChild(fullDate);
        
                // display temp info
                var tempEl = document.createElement("div");

                if (weather.list[i].weather[0].id < 600) {
                    tempEl.innerHTML = "<p>" + Math.ceil(weather.list[i].main.temp) + "<sup class='secondary-degrees'>o</sup> </p> <img src='../images/icons/secondary-weather-icons/secondary-rainy-icon.svg' alt='Rainy' class='secondary-icons' />";

                }
                else if (weather.list[i].weather[0].id >= 600 && weather.list[i].weather[0].id < 700) {
                    tempEl.innerHTML = "<p>" + Math.ceil(weather.list[i].main.temp) + "<sup class='secondary-degrees'>o</sup> </p> <img src='../images/icons/secondary-weather-icons/secondary-snowy-icon.svg' alt='Snowy' class='secondary-icons' />";
                }
                else if (weather.list[i].weather[0].id > 700 && weather.list[i].weather[0].id < 800) {
                    tempEl.innerHTML = "<p>" + Math.ceil(weather.list[i].main.temp) + "<sup class='secondary-degrees'>o</sup> </p> <img src='../images/icons/secondary-weather-icons/secondary-foggy-icon.svg' alt='Foggy' class='secondary-icons' />";
                }
                else if (weather.list[i].weather[0].id === 800) {
                    tempEl.innerHTML = "<p>" + Math.ceil(weather.list[i].main.temp) + "<sup class='secondary-degrees'>o</sup> </p> <img src='../images/icons/secondary-weather-icons/secondary-sunny-icon.svg' alt='Sunny' class='secondary-icons' />";
                }
                else {
                    var cloudyIcon = document.createElement("div");
                    cloudyIcon.classList = "secondary-icon-cloudy";
                    tempEl.innerHTML = "<p>" + Math.ceil(weather.list[i].main.temp) + "<sup class='secondary-degrees'>o</sup></p>" + cloudyIcon;
                }

                nextDay.appendChild(tempEl);
        
                // humidity info
                var humidityEl = document.createElement("h5");
                humidityEl.textContent = weather.list[i].main.humidity + "% Humidity"
                nextDay.appendChild(humidityEl);
            }
        })
    })
};

var searchSubmitHandler = function(event) {
    // prevents page from reloading
    event.preventDefault();

    // stores the name of city
    var cityName = userSearchEl.value.trim();
    
    // passes city name through getCityWeather function if there's an input value
    if (cityName) {
        getCityWeather(cityName);
        userSearchEl.value = "";
    }
};

searchFormEl.addEventListener("submit", searchSubmitHandler);