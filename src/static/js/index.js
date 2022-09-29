const weatherImgCodes = {
    "0": "static/img/clear sky day.png",
    "0.5" : "static/img/clear sky night.png",
    "1" : "static/img/mainly clear day.png",
    "1.5" : "static/img/mainly clear night.png",
    "2" : "static/img/partly cloudy day.png",
    "2.5" : "static/img/partly cloudy night.png",
    "3" : "static/img/overcast.png" ,
    "45" : "static/img/fog.png",
    "48" : "static/img/fog.png",
    "51" :  "static/img/drizzle day.png",
    "51.5" : "static/img/drizzle night.png",
    "52" : "static/img/drizzle day.png",
    "52.5" : "static/img/drizzle night.png",
    "53" : "static/img/drizzle day.png",
    "53.5" : "static/img/drizzle night.png",
    "56" : "static/img/freezing drizzle day.png",
    "56.5" : "static/img/freezing drizzle night.png",
    "57" : "static/img/freezing drizzle day.png",
    "57.5" : "static/img/freezing drizzle night.png",
    "61" : "static/img/rain day.png",
    "61.5" : "static/img/rain night.png",
    "63" : "static/img/rain day.png",
    "63.5" : "static/img/rain night.png",
    "65" : "static/img/rain day.png",
    "65.5" : "static/img/rain night.png",
    "66" : "static/img/freezing rain.png",
    "67" : "static/img/freezing rain.png",
    "71" : "static/img/snow fall.png",
    "73" : "static/img/snow fall.png",
    "75" : "static/img/snow fall.png",
    "77" : "static/img/snow grains.png",
    "80" : "static/img/slight rain shower day.png",
    "80.5" : "static/img/slight rain shower night.png",
    "81" : "static/img/rain shower.png",
    "82" : "static/img/rain shower.png",
    "85" : "static/img/snow fall.png",
    "86" : "static/img/snow fall.png",
    "95" : "static/img/thunderstorm.png",
    "96" : "static/img/thunderstorm with hail.png",
    "99" : "static/img/thunderstorms with hail.png"
}

const codesWithNightMode = [0, 1, 2, 51, 52, 53, 56, 57, 61, 63, 65, 80]

const weatherDescCodes = {
    "0": "Clear skies",
    "1" : "Mainly clear skies",
    "2" : "Partly cloudy skies",
    "3" : "Overcast skies" ,
    "45" : "Foggy",
    "48" : "Depositing rime fog",
    "51" :  "Light drizzle",
    "53" : "Moderate drizzle",
    "55" : "Dense drizzle",
    "56" : "Light Freezing drizzle",
    "57" : "Dense freezing drizzle",
    "61" : "Slight rain",
    "63" : "Moderate rainfall",
    "65" : "Heavy rainfall",
    "66" : "Slight freezing rainfall",
    "67" : "Heavy freezing rainfall",
    "71" : "Slight snow fall",
    "73" : "Moderate snow fall",
    "75" : "Heavy snow fall",
    "77" : "Snow grains",
    "80" : "Slight rain shower",
    "81" : "Moderate rain shower",
    "82" : "Violent rain shower",
    "85" : "Slight snow shpwers",
    "86" : "Heavy snow showers",
    "95" : "Thunderstorms",
    "96" : "Thunderstorms with slight hail",
    "99" : "Thunderstorms with heavy hail"
}
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const locationIndicator = document.getElementById("location")
const maxTempIndicator = document.getElementById("max-temperature");
const minTempIndicator = document.getElementById("min-temperature");
const weatherDesc =  document.getElementById("weather-description")
const weatherImg =  document.getElementById("weather-image")
const humidityIndicator =  document.getElementById("humidity");
const windSpeedIndicator =  document.getElementById("windspeed");
const cloudCoverIndicator =  document.getElementById("cloud-cover");
const windDirectionIndicator = document.getElementById("wind-direction")
const precipitationIndicator = document.getElementById("precipitation")
const futureForecasts = document.querySelector("forecasts")
const futureForecastsContainer = document.querySelector(".forecasts-container")
const forecastDateIndicator = document.getElementById("date");
const requestedForecastDate = document.querySelector("select[name='forecast-date-select']")
const today = new Date();
const citySearchForm = document.querySelector("form[name='city-search-form']")
const citySearchResults = document.querySelector(".search-results-container")
const citySearchResultsContainer = document.querySelector(".search-results")
const citySearchInput = document.querySelector("input[name='city-search']")
const forecastDisplayMode = document.getElementById("forecast-display-mode-select");
const citySearchToggle = document.getElementById("city-search-toggle")
const searchBoxContainer = document.querySelector(".search")
const errorNotification = document.querySelector(".error")

errorHandler = (error) => {
    console.log(error)
    errorNotification.classList.add("error-show")
}
closeErrorNotif = () => {
    errorNotification.classList.remove("error-show")
}
function checkError(response) {
    if (!response.ok) {
        throw Error (response.statusText)
    }
}
async function getDailyWeatherData (latitude, longitude) {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,winddirection_10m_dominant&timezone=UTC`)
    checkError(response)
    return response.json()
}
async function getHourlyWeatherData (latitude, longitude) {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,weathercode,cloudcover,windspeed_10m`)
    checkError(response)
    return response.json()
}

const addZero = (value) => {if (value < 10) {value = "0" + value} return value}

//check if its night time and return the appropriate code
function checkNightMode(code, date) {
    if (codesWithNightMode.includes(code)) {
        if (date.getHours() < 7 || date.getHours() > 18) {
            return code + ".5"
        } else {
            return code
        }
    } else {
        return code
    }
}
const welcomeBody = document.querySelector(".welcome-body")
const closeWelcomeBody = () => welcomeBody.classList.remove("welcome-body-show")

window.addEventListener("load", () => {
    //adds the skeleton loader
    document.querySelector(".main").classList.add("loading")

    //checking if the user has already visited the app before
    if (!checkCookie("current latitude")) {
        welcomeBody.classList.add("welcome-body-show")
        async function getIPLocation () {
            const response = await fetch("https://ipapi.co/json/");
            return response.json()
        }

        //returning weather data based on users IP address
        getIPLocation().then(data => {
            setCookie("current latitude", data.latitude, 30);
            setCookie("current longitude", data.longitude, 30);
            setCookie("current location", `${data.city}, ${data.region? data.region + ", " : ""}${data["country_code"]}`, 30) 
            locationIndicator.innerHTML = getCookie("current location")
            changeData(data.latitude, data.longitude, today)
        }).catch(error => errorHandler(error))
    }
    else {
        //discard the welcome message
        welcomeBody.innerHTML = ""

        //get weather data based on already stored location data
        changeData(getCookie("current latitude"), getCookie("current longitude"), today)
    }

    let todaysDate = today.getFullYear() + "-" + addZero(today.getMonth() + 1) + "-" + addZero(today.getDate())
    if (!(checkCookie("current forecast date") && (getCookie("current forecast date") == todaysDate))) {
        let todaysDate = today.getFullYear() + "-" + addZero(today.getMonth() + 1) + "-" + addZero(today.getDate())
        setCookie("current forecast date", todaysDate, 1)
    }
    requestedForecastDate.innerHTML = ""
    let currentDay = new Date ()

    //setting up the forecast date togglers
    for (j = 0; j < 7; j++) {
        requestedForecastDateOption = currentDay.setDate(currentDay.getDate() + (j == 0 ? 0 : 1))
        requestedForecastDateOption = new Date (requestedForecastDateOption)
        if (j == 0) {
            requestedForecastDate.innerHTML+= `<option value="${requestedForecastDateOption.toLocaleDateString()}">Today</option>\n`
        } else if (j == 1) {
            requestedForecastDate.innerHTML+= `<option value="${requestedForecastDateOption.toLocaleDateString()}">Tomorrow</option>\n`
        } else {
            requestedForecastDate.innerHTML+= `<option value="${requestedForecastDateOption.toLocaleDateString()}">${months[requestedForecastDateOption.getMonth()]} ${requestedForecastDateOption.getDate()}</option>\n`
        }
    }

    //toggling the display mode classes based on the selected display mode option
    forecastDisplayMode.value == "daily" ? document.querySelector(".main-forecast").classList.remove("hourly-forecast") : document.querySelector(".main-forecast").classList.add("hourly-forecast") 
})
i = 0;

//function for fetching and changing DOM
const changeData = (latitude, longitude, time = new Date(requestedForecastDate.value)) => {
    if (forecastDisplayMode.value == "hourly") {
        getHourlyWeatherData(latitude, longitude).then(data => {
            if (!checkCookie("current latitude")) {
                setCookie("current latitude", latitude, 30);
                setCookie("current longitude", longitude, 30);
            }
            temperatudeData = data.hourly["temperature_2m"];
            humidityData = data.hourly["relativehumidity_2m"];
            windSpeedData = data.hourly["windspeed_10m"]
            cloudCoverData = data.hourly["cloudcover"]
            weatherCodeData = data.hourly.weathercode
            timeData = data.hourly.time

            ///get the lowest index of the requested forecast date.
            for (index in timeData) {
                if (time.getDate() === new Date(timeData[index]).getDate()) {

                    //if the requested date is the current day, display thee current hour
                    if (time.getDate() == today.getDate()) {
                        if (today.getHours() == new Date(timeData[index]).getHours()) {
                            i = index;
                            break;
                        }
                    } else {
                        i = index;
                        break;
                    }
                }
            }

            //remove the skeleton loader since data has been fetched successfully
            document.querySelector(".main").classList.remove("loading")
            maxTempIndicator.textContent = temperatudeData[i] + "°c"
            humidityIndicator.textContent = humidityData[i] + "%"
            windSpeedIndicator.textContent = windSpeedData[i] + "Km/h"
            cloudCoverIndicator.textContent = cloudCoverData[i] + "%"
            let forecastTime = new Date(timeData[i])
            openWeatherAPIKey = "b34fddd3dae4a2eb0ad363b62f98ba1e"
            forecastDateIndicator.textContent = `${months[forecastTime.getMonth()]} ${forecastTime.getDate()} ${addZero(forecastTime.getHours())}:${addZero(forecastTime.getMinutes())}`
            weatherDesc.textContent = weatherDescCodes[`${data.hourly.weathercode[i]}`]
            weatherImg.setAttribute("src", weatherImgCodes[`${checkNightMode(data.hourly.weathercode[i], forecastTime)}`])
            let forecasts = ""

            //display the forecasts for a given date only
            for (index in data.hourly.time ) {
                if (new Date (requestedForecastDate.value).getDate() == new Date (timeData[index]).getDate()) {
                    let forecastDate = new Date(timeData[index])

                    //if the displayed forecast is the same as the particular forecast option, make it the active forecast
                    if (forecastTime.getHours() == forecastDate.getHours()) {
                        forecasts += `<div class="forecast active-forecast" onclick="displayNewForecast(${latitude}, ${longitude}, ${index}, this)">`
                    } else {
                        forecasts += `<div class="forecast" onclick="displayNewForecast(${latitude}, ${longitude}, ${index}, this)">`
                    }
                    forecasts+= `<div class="forecast-text">`

                    //if the current day is the displayed forecast date, display the time as "now"
                    if (today.getHours() == forecastDate.getHours() && today.getDate() == forecastDate.getDate()) {
                           forecasts+=`<p>now</p>`
                    } else {
                        forecasts+=`<p>${addZero(forecastDate.getHours())}:${addZero(forecastDate.getMinutes())}</p>`
                    }
                    forecasts+=`           <h2>${temperatudeData[index]}°c</h2>
                                        </div>
                                        <div class="forecast-img">
                                            <img src="${weatherImgCodes[`${checkNightMode(weatherCodeData[index], forecastDate)}`]}" alt="">
                                        </div>
                                    </div>`
                }
            }
            futureForecastsContainer.innerHTML = forecasts
            locationIndicator.innerHTML = getCookie("current location")
        }).catch(error => errorHandler(error))
    } else {
        getDailyWeatherData(latitude, longitude).then(data => {
            maxTemperatureData = data.daily["temperature_2m_max"];
            minTemperatudeData = data.daily["temperature_2m_min"];
            windSpeedData = data.daily["windspeed_10m_max"]
            windDirectionData = data.daily["winddirection_10m_dominant"]
            precipitationData = data.daily["precipitation_sum"]
            weatherCodeData = data.daily.weathercode
            timeData = data.daily.time
            for (index in timeData) {
                if (time.getDate() === new Date(timeData[index]).getDate()) {
                    i = index;
                    break;
                }
            }
            maxTempIndicator.textContent = maxTemperatureData[i] + "°c"
            minTempIndicator.textContent = minTemperatudeData[i] + "°c"
            windSpeedIndicator.textContent = windSpeedData[i] + "Km/h"
            windDirectionIndicator.textContent = windDirectionData[i] + "°"
            precipitationIndicator.textContent = precipitationData[i] + "mm"
            let forecastTime = new Date(timeData[i])
            openWeatherAPIKey = "b34fddd3dae4a2eb0ad363b62f98ba1e"
            forecastDateIndicator.textContent = `${months[forecastTime.getMonth()]} ${forecastTime.getDate()}`
            weatherDesc.textContent = weatherDescCodes[`${weatherCodeData[i]}`]
            weatherImg.setAttribute("src", weatherImgCodes[`${weatherCodeData[i]}`])
            let forecasts = ""
            for (index in timeData ) {
                let forecastDate = new Date(timeData[index])
                if (forecastTime.getDate() == forecastDate.getDate()) {
                    forecasts += `<div class="forecast active-forecast" onclick="displayNewForecast(${latitude}, ${longitude}, ${index}, this)">`
                } else {
                    forecasts += `<div class="forecast" onclick="displayNewForecast(${latitude}, ${longitude}, ${index}, this)">`
                }
                forecasts+= `<div class="forecast-text">`
                if (today.getDate() == forecastDate.getDate()) {
                        forecasts+=`<p>Today</p>`
                } else {
                    forecasts+=`<p>${months[forecastDate.getMonth()]} ${forecastDate.getDate()}</p>`
                }
                forecasts+=`           <h2>${maxTemperatureData[index]}°c</h2>
                                    </div>
                                    <div class="forecast-img">
                                        <img src="${weatherImgCodes[`${weatherCodeData[index]}`]}" alt="">
                                    </div>
                                </div>`
            }
            futureForecastsContainer.innerHTML = forecasts
            locationIndicator.innerHTML = getCookie("current location")
        }).catch(error => errorHandler(error))
    }
} 

//function to change displayed forecast from forecast button click
function displayNewForecast(latitude, longitude, forecastIndex, el) {
    if (forecastDisplayMode.value == "hourly") {
        getHourlyWeatherData(latitude, longitude).then(data => {
            temperatudeData = data.hourly["temperature_2m"];
            humidityData = data.hourly["relativehumidity_2m"];
            windSpeedData = data.hourly["windspeed_10m"]
            cloudCoverData = data.hourly["cloudcover"]
            weatherCodeData = data.hourly.weathercode
            timeData = data.hourly.time
            maxTempIndicator.textContent = temperatudeData[forecastIndex] + "°c"
            humidityIndicator.textContent = humidityData[forecastIndex] + "%"
            windSpeedIndicator.textContent = windSpeedData[forecastIndex] + "Km/h"
            cloudCoverIndicator.textContent = cloudCoverData[forecastIndex] + "%"
            let forecastTime = new Date(data.hourly.time[forecastIndex])
            openWeatherAPIKey = "b34fddd3dae4a2eb0ad363b62f98ba1e"
            forecastDateIndicator.textContent = `${months[forecastTime.getMonth()]} ${forecastTime.getDate()} ${addZero(forecastTime.getHours())}:${addZero(forecastTime.getMinutes())}`
            weatherDesc.textContent = weatherDescCodes[`${weatherCodeData[forecastIndex]}`]
            weatherImg.setAttribute("src", weatherImgCodes[`${checkNightMode(weatherCodeData[forecastIndex], forecastTime)}`])
            //remove the active forecast class from the forecast containing the class
            document.querySelectorAll(".forecast").forEach((forecast) => {
                forecast.classList.remove("active-forecast")
            })

            //add the active forecast class to the forecast that was clicked
            el.classList.add("active-forecast")
        }).catch(error => errorHandler(error))
    } else {

        //daily mode
        getDailyWeatherData(latitude, longitude).then(data => {
            maxTemperatureData = data.daily["temperature_2m_max"];
            minTemperatudeData = data.daily["temperature_2m_min"];
            windSpeedData = data.daily["windspeed_10m_max"]
            windDirectionData = data.daily["winddirection_10m_dominant"]
            precipitationData = data.daily["precipitation_sum"]
            weatherCodeData = data.daily.weathercode
            timeData = data.daily.time
            maxTempIndicator.textContent = maxTemperatureData[forecastIndex] + "°c"
            minTempIndicator.textContent = minTemperatudeData[forecastIndex] + "°c"
            windSpeedIndicator.textContent = windSpeedData[forecastIndex] + "Km/h"
            windDirectionIndicator.textContent = windDirectionData[forecastIndex] + "°"
            precipitationIndicator.textContent = precipitationData[forecastIndex] + "mm"
            let forecastTime = new Date(timeData[forecastIndex])
            openWeatherAPIKey = "b34fddd3dae4a2eb0ad363b62f98ba1e"
            forecastDateIndicator.textContent = `${months[forecastTime.getMonth()]} ${forecastTime.getDate()}`
            weatherDesc.textContent = weatherDescCodes[`${weatherCodeData[forecastIndex]}`]
            weatherImg.setAttribute("src", weatherImgCodes[`${weatherCodeData[forecastIndex]}`])
            document.querySelectorAll(".forecast").forEach((forecast) => {
                forecast.classList.remove("active-forecast")
            })
            el.classList.add("active-forecast")
            requestedForecastDate.childNodes.forEach((child) => {
                if (new Date(timeData[forecastIndex]).getDate() == new Date (child.value).getDate()) {
                    child.selected = true
                }
            })
        }).catch(error => errorHandler(error))
    }
    i++
}

//change forecast modes
forecastDisplayMode.onchange = function () {
    if (this.value == "daily") {
        document.querySelector(".main-forecast").classList.remove("hourly-forecast")
    } else {
        document.querySelector(".main-forecast").classList.add("hourly-forecast")
    }
    changeData(getCookie("current latitude"), getCookie("current longitude"))
}

//change forecast to the requested forecast date based on it's value
requestedForecastDate.onchange = function () {
    changeData(getCookie("current latitude"), getCookie("current longitude"), new Date(this.value))
}

//if user is currently typing, remove search results
citySearchInput.oninput = () => {
    citySearchResults.innerHTML = "";
    citySearchResultsContainer.classList.remove("show-search-results")
}

citySearchForm.onsubmit = (e) => {
    e.preventDefault()
    citySearchResultsContainer.classList.add("show-search-results")
    async function getCityData (city) {
        response = await fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city +"&limit=5&appid=b34fddd3dae4a2eb0ad363b62f98ba1e")
        checkError(response)
        return response.json()
    }
    getCityData(citySearchInput.value).then(data => {
        citySearchResults.innerHTML = ""

        //if the city was found
        if (data.length !== 0) {
            for (city of data) {
                //adding the data of each city to each search result
                citySearchResults.innerHTML += `<p class="search-result" data-lat="${city.lat}" data-lon="${city.lon}">${city.name}, ${city.state? city.state + ", " : ""}${city.country}</p>`
            }
            document.querySelectorAll(".search-result").forEach((result) => {
                //add an event listener to each result that would change the displayed forecast based on the dataset.
                result.addEventListener("click", (e)=> {
                    document.querySelector(".main").classList.add("loading")
                    changeData(e.currentTarget.dataset.lat, e.currentTarget.dataset.lon, today)
                    setCookie("current latitude", e.currentTarget.dataset.lat, 30)
                    setCookie("current longitude", e.currentTarget.dataset.lon, 30)
                    setCookie("current location", e.currentTarget.textContent, 30)
                    searchBoxContainer.classList.remove("search-querying")
                })
            }).catch(error => errorHandler(error))
        } 
        //if the city was not found
        else {
            citySearchResults.innerHTML = `<div class="city-not-found">
                                                <svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                                    <desc>Created with Sketch.</desc>
                                                    <g id="-Product-Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                        <g id="ic_fluent_location_not_found_24_regular" fill="#212121" fill-rule="nonzero">
                                                            <path d="M5.84301215,4.55890685 C9.24342264,1.15849636 14.7565774,1.15849636 18.1569879,4.55890685 C21.4893901,7.89130914 21.5560382,13.252791 18.356932,16.6663564 L18.1569879,16.8728826 C17.2419979,17.7878725 15.7116094,19.2826735 13.5641649,21.3589636 C12.6919186,22.2023085 11.3080914,22.2022001 10.4359799,21.3587188 L6.5863078,17.6101042 C6.30208268,17.3299283 6.0543257,17.0841961 5.84301215,16.8728826 C2.44260165,13.4724721 2.44260165,7.95931735 5.84301215,4.55890685 Z M17.0963277,5.61956702 C14.2817036,2.80494297 9.71829638,2.80494297 6.90367232,5.61956702 C4.08904826,8.43419108 4.08904826,12.9975983 6.90367232,15.8122224 L8.59986042,17.4841867 C9.38268933,18.2492508 10.3424212,19.181446 11.478793,20.2805069 C11.7694967,20.5616672 12.2307719,20.5617033 12.5215209,20.2805882 L15.4959128,17.3910853 C16.1544227,16.746944 16.6879447,16.2206054 17.0963277,15.8122224 C19.9109517,12.9975983 19.9109517,8.43419108 17.0963277,5.61956702 Z M14.9462117,7.61294647 L15.0303301,7.68556462 C15.2965966,7.95183118 15.3208027,8.36849486 15.1029482,8.66210636 L15.0303301,8.74622479 L13.061,10.7158947 L15.0303301,12.6855646 C15.2965966,12.9518312 15.3208027,13.3684949 15.1029482,13.6621064 L15.0303301,13.7462248 C14.7640635,14.0124914 14.3473998,14.0366974 14.0537883,13.8188429 L13.9696699,13.7462248 L12,11.7768947 L10.0303301,13.7462248 C9.76406352,14.0124914 9.34739984,14.0366974 9.05378835,13.8188429 L8.96966991,13.7462248 C8.70340335,13.4799582 8.6791973,13.0632945 8.89705176,12.7696831 L8.96966991,12.6855646 L10.939,10.7158947 L8.96966991,8.74622479 C8.70340335,8.47995823 8.6791973,8.06329455 8.89705176,7.76968305 L8.96966991,7.68556462 C9.23593648,7.41929806 9.65260016,7.395092 9.94621165,7.61294647 L10.0303301,7.68556462 L12,9.6548947 L13.9696699,7.68556462 C14.2359365,7.41929806 14.6526002,7.395092 14.9462117,7.61294647 Z" id="Color"></path>
                                                        </g>
                                                    </g>
                                                </svg>
                                                <p>Location not found</p>
                                            </div>`
        }
    })
}

//toggle the search bar
citySearchToggle.onclick = (e) => {
    searchBoxContainer.classList.add("search-querying")
}

//stop search bar click from closing search box
document.querySelector(".search div").onclick = (e) => {
    e.stopPropagation()
}

//if the search box container was clicked, close the search box
searchBoxContainer.onclick = (e) => {
    e.currentTarget.classList.remove("search-querying")
}

//cookie functions
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

function checkCookie (cname) {
    return getCookie(cname) !== ""? true : false
}
