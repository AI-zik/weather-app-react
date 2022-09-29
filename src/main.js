import SearchToggle from "./main_components/search_toggle"
import Location from "./main_components/location"
import WeatherImage from "./main_components/weather_image"
import WeatherDescription from "./main_components/weather_description"
import TemperatureIndicator from "./main_components/temp_indicator"
import OtherIndicators from "./main_components/other_indicators"
import Forecasts from "./main_components/forecasts"
import { useState, useEffect, useRef, memo } from "react"
import { getCookie, setCookie, months, today } from "./utils"
import { changeData, getIPLocation } from "./fetch_data"


//main component
const Main = ({searchQuerying, setSearchQuerying, searchLocation, setError}) => {
    
    //state holding the weather data
    const [weatherData, setWeatherData] = useState({
        location: getCookie("current location"),
        date: "",
        weatherImageSrc: "",
        weatherDescription: "",
        maxTemperature: "",
        minTemperature: "",
        humidity: "",
        windSpeed: "",
        cloudCover: "",
        windDirection: "",
        precipitation: "",
        forecastDisplayMode : "hourly",
        forecasts: [],
        forecastDateOptions : [],
        requestedForecastDate : today,
        loading: true,
        dataHolder : {
            hourly: {
                latitude: 0,
                longitude: 0
            },
            daily: {
                latitude: 0,
                longitude: 0
            }
        }
    })

    //function to change the weather data dict
    const changeWeatherData = (parameters) => {
        setWeatherData((weatherData) => ({...weatherData, ...parameters}) )
    }

    //function to change the data rendered. I put it in a function to avoid violating DRY
    const changeDisplayedData = (latitude=getCookie("current latitude"), longitude=getCookie("current longitude")) => {
        changeData(latitude, longitude, weatherData.requestedForecastDate, changeWeatherData, weatherData, setError)
    }
    //useEffect for initial render, like window.onload
    useEffect(() => {
        //console.log("render")
        const requestedForecastDateOptionArray = []
        const currentDay = new Date()

        //creating forecast date options for 7 days
        for (let j = 0; j < 7; j++) {
            let requestedForecastDateOption = currentDay.setDate(currentDay.getDate() + (j === 0 ? 0 : 1))
            requestedForecastDateOption = new Date (requestedForecastDateOption)
            requestedForecastDateOption = j === 0 ? requestedForecastDateOption.setHours(today.getHours(), 0, 0) : requestedForecastDateOption.setHours(0, 0, 0) 
            requestedForecastDateOption = new Date (requestedForecastDateOption)
            let name;
            if (j === 0) {
                name = "Today"
            } else if (j === 1) {
                name = "Tomorrow"
            } else {
                name = `${months[requestedForecastDateOption.getMonth()]} ${requestedForecastDateOption.getDate()}`;
            }
            let value = requestedForecastDateOption;
            requestedForecastDateOptionArray.push({
                id : j,
                name: name,
                value: value
            })
        }
        let params = {
            forecastDateOptions: requestedForecastDateOptionArray
        }

        //if current latitude cookie doesn't exist, then fetch coordinate data based on user's IP address
        if (!getCookie("current latitude")) {
            getIPLocation ().then(data => {
                setCookie("current latitude", data.latitude, 30);
                setCookie("current longitude", data.longitude, 30);
                setCookie("current location", `${data.city}, ${data.region? data.region + ", " : ""}${data["country_code"]}`, 30) 
                changeWeatherData({location: getCookie("current location")})
                changeDisplayedData(data.latitude, data.longitude)
            }).catch((error) => setError(true))
        }
        else {
            params.location = getCookie("current location")
            changeDisplayedData()
        }
        //
        changeWeatherData(params)
        //changeDisplayedData()


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let displayModeEffectTracker = useRef(weatherData.forecastDisplayMode)
    let forecastDateEffectTracker = useRef(weatherData.requestedForecastDate)
    //changing the weather data if the display mode or date is changed
    useEffect(()=> {
            if (displayModeEffectTracker.current !== weatherData.forecastDisplayMode || forecastDateEffectTracker.current !== weatherData.requestedForecastDate) {
                displayModeEffectTracker.current = weatherData.forecastDisplayMode
                forecastDateEffectTracker.current = weatherData.requestedForecastDate
                changeDisplayedData()
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [weatherData.forecastDisplayMode, weatherData.requestedForecastDate])


    let searchLocationEffectTracker = useRef(searchLocation)
    //use effect for changing data if a new location was searched for
    useEffect(()=> {
            
            if (searchLocationEffectTracker.current !== searchLocation) {
                searchLocationEffectTracker.current = searchLocation
                //change the location and clear out the data from the previous city
                let params = {
                    location: getCookie("current location"),
                    loading: true,
                    date: "",
                    weatherImageSrc: "",
                    weatherDescription: "",
                    maxTemperature: "",
                    minTemperature: "",
                    humidity: "",
                    windSpeed: "",
                    cloudCover: "",
                    windDirection: "",
                    precipitation: "",
                }
        
                //changing the data to the current search location's forecast
                changeWeatherData(params)
                changeDisplayedData()
            }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchLocation])

    return (
        <div className={`main ${weatherData.loading ? "loading" : ""}`}>
            <div className={weatherData.forecastDisplayMode === "daily" ? "main-forecast" : "main-forecast hourly-forecast"}>
                <SearchToggle setSearchQuerying={setSearchQuerying}/>
                <Location location={weatherData.location} date={weatherData.date}/>
                <WeatherImage source={weatherData.weatherImageSrc}/>
                <WeatherDescription description={weatherData.weatherDescription}/>
                <TemperatureIndicator max={weatherData.maxTemperature} min={weatherData.minTemperature} displayMode={weatherData.forecastDisplayMode}/>
                <OtherIndicators humidity={weatherData.humidity} windSpeed={weatherData.windSpeed} cloudCover={weatherData.cloudCover} windDirection={weatherData.windDirection} precipitation={weatherData.precipitation} displayMode= {weatherData.forecastDisplayMode} />
            </div>
            <Forecasts changeWeatherData={changeWeatherData} weatherData={weatherData}/>
        </div>
    
    )
}

export default memo(Main)