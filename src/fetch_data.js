import {checkError, today, months, addZero, weatherDescCodes, checkNightMode, weatherImgCodes} from "./utils"

export async function getIPLocation () {
    const response = await fetch("https://ipapi.co/json/");
    return response.json()
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

export async function getCityData (city) {
    let response = await fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city +"&limit=5&appid=b34fddd3dae4a2eb0ad363b62f98ba1e")
    checkError(response)
    return response.json()
}

export const handleError = (fun) => {
    fun(true)
}

const hourlyDataHandler = (latitude, longitude, data, time, changeWeatherData, previousData, stored = false) => {
    let temperatureData = data.hourly["temperature_2m"];
    let humidityData = data.hourly["relativehumidity_2m"];
    let windSpeedData = data.hourly["windspeed_10m"]
    let cloudCoverData = data.hourly["cloudcover"]
    let weatherCodeData = data.hourly.weathercode
    let timeData = data.hourly.time
    let i = 0;
    time = new Date (time)
    for (let index in timeData) {
        if (time.getDate() === new Date(timeData[index]).getDate() &&   time.getHours() === new Date(timeData[index]).getHours() ) {
            i = index;
        }
    }
    let forecastTime = new Date (timeData[i])
    const params = {
        maxTemperature : temperatureData[i],
        humidity : humidityData[i],
        windSpeed : windSpeedData[i],
        cloudCover : cloudCoverData[i],
        date : `${months[forecastTime.getMonth()]} ${forecastTime.getDate()} ${addZero(forecastTime.getHours())}:${addZero(forecastTime.getMinutes())}`,
        weatherDescription : weatherDescCodes[`${weatherCodeData[i]}`],
        weatherImageSrc : weatherImgCodes[`${checkNightMode(weatherCodeData[i], forecastTime)}`],
        loading: false
    }
    let forecasts = []
    for (let index in timeData) {
        if (new Date (previousData.requestedForecastDate).getDate() === new Date (timeData[index]).getDate()) {
            let forecastDate = new Date(timeData[index]);
            let forecast = {}

            if (forecastTime.getHours() === forecastDate.getHours()) {
                forecast.isActive = true
            }
            forecast.temperature = temperatureData[index]
            forecast.imageSrc = `${weatherImgCodes[`${checkNightMode(weatherCodeData[index], forecastDate)}`]}`;
            if (today.getHours() === forecastDate.getHours() && today.getDate() === forecastDate.getDate()) {
                forecast.time = "now"
            }
            else {
            forecast.time = `${addZero(forecastDate.getHours())}:${addZero(forecastDate.getMinutes())}`
            }
            forecast.timeData = timeData[index]
            forecast.id = index
            forecasts.push(forecast)
        }
    }
    params.forecasts = forecasts
    if (!stored) {
        params.dataHolder = previousData.dataHolder
        params.dataHolder.hourly = data
        params.dataHolder.hourly.latitude = latitude
        params.dataHolder.hourly.longitude = longitude
    }
    changeWeatherData(params)
}

const dailyDataHandler = (latitude, longitude, data, time, changeWeatherData, previousData, stored = false) => {
    let maxTemperatureData = data.daily["temperature_2m_max"];
    let minTemperatureData = data.daily["temperature_2m_min"];
    let windSpeedData = data.daily["windspeed_10m_max"]
    let precipitationData = data.daily["precipitation_sum"]
    let windDirectionData = data.daily["winddirection_10m_dominant"]
    let weatherCodeData = data.daily.weathercode
    let timeData = data.daily.time;
    let i;

    //defining the start index for the requested weather date
    time = new Date (time)
    for (let index in timeData) {
        if (time.getDate() === new Date(timeData[index]).getDate()) {
            i = index;
            break;
        }
    }
    let forecastTime = new Date (timeData[i])

    //changing state values
    const params = {
        maxTemperature : maxTemperatureData[i],
        minTemperature : minTemperatureData[i],
        precipitation : precipitationData[i],
        windSpeed : windSpeedData[i],
        windDirection : windDirectionData[i],
        date : `${months[forecastTime.getMonth()]} ${forecastTime.getDate()}`,
        weatherDescription : weatherDescCodes[`${weatherCodeData[i]}`],
        weatherImageSrc : weatherImgCodes[weatherCodeData[i]],
        loading: false
    }

    let forecasts = []

    //fetching the forecasts for the other days
    for (let index in timeData) {
            let forecastDate = new Date(timeData[index]);
            let forecast = {}

            if (forecastTime.getDate() === forecastDate.getDate()) {
                forecast.isActive = true
            }
            forecast.temperature = maxTemperatureData[index]
            forecast.imageSrc = weatherImgCodes[weatherCodeData[index]];
            if (today.getDate() === forecastDate.getDate()) {
                forecast.time = "Today"
            }
            else {
            forecast.time = `${months[forecastDate.getMonth()]} ${forecastDate.getDate()}`
            }
            forecast.timeData = timeData[index]
            forecast.id = index
            forecasts.push(forecast)
    }
    if (!stored) {
        params.dataHolder = previousData.dataHolder
        params.dataHolder.daily = data
        params.dataHolder.daily.latitude = latitude
        params.dataHolder.daily.longitude = longitude
    }
    params.forecasts = forecasts
    changeWeatherData(params)
}

export const changeData = (latitude, longitude, time, changeWeatherData, previousData, errorHandler) => {
    if (previousData.forecastDisplayMode === "hourly") {
        //console.log(parseFloat(latitude).toPrecision(3))
        if (previousData.dataHolder.hourly.latitude === (latitude) && previousData.dataHolder.hourly.longitude === longitude) {
            hourlyDataHandler(latitude, longitude, previousData.dataHolder.hourly, time, changeWeatherData, previousData, true)
        } else {
            getHourlyWeatherData(latitude, longitude).then(data => {
                hourlyDataHandler(latitude, longitude, data, time, changeWeatherData, previousData)   
            }).catch((error) => {errorHandler(true)})
        }
    } else {
        if (previousData.dataHolder.daily.latitude === latitude && previousData.dataHolder.daily.longitude === longitude) {
            dailyDataHandler(latitude, longitude, previousData.dataHolder.daily, time, changeWeatherData, previousData, true)
        } else {
            getDailyWeatherData(latitude, longitude).then(data=> {
                dailyDataHandler(latitude, longitude, data, time, changeWeatherData, previousData)
            }).catch((error) => {errorHandler(true)})
        }
    }
}

