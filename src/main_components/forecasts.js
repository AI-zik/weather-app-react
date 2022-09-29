import { memo } from "react";

//dict of empty keys to trigger the skeleton loader
let emptyParams = {
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
    loading: true
}

const ForecastTogglers = ({changeWeatherData, displayMode, forecastDateOptions, requestedForecastDate}) => {
   
    //active date is the selected date, which is not dependent on time
    let activeDate;
    forecastDateOptions.forEach((date)=> {
        if(date.value.getDate() === new Date(requestedForecastDate).getDate()) {
            activeDate = date.value
        }
    })
    return (
        <div className="forecast-togglers">
            {//the selected value will be the forecast date whose date corresponds
            //with the requested forecast date
            }
            <select value={activeDate } name="forecast-date-select" id="forecast-date-select" onChange={(e)=> changeWeatherData({requestedForecastDate : e.currentTarget.value})} >
                {forecastDateOptions.map((date) => {
                    return <option value={date.value} key={date.id}>{date.name}</option>
                })}
            </select>
            <select name="" value={displayMode} id="forecast-display-mode-select" onChange={(e)=> {
                let params = emptyParams
                params.forecastDisplayMode = e.currentTarget.value
                changeWeatherData(params);
            }}>
                <option value={"hourly"}>Hourly</option>
                <option value={"daily"}>Daily</option>
            </select>
        </div>
    )
}

const Forecast = ({isActive, time, temperature, imageSrc, changeWeatherData, weatherData, timeData}) => {
    //change the weather data's requested forecast date state
    // based on the clicked forecast button details
    const handleClick = () => {
            changeWeatherData({requestedForecastDate : new Date(timeData)})
    }
    return (
        <div className={isActive ? "forecast active-forecast" : "forecast"} onClick={handleClick} >
            <div className="forecast-text">
                <p>{time}</p>
                <h2>{temperature}°c</h2>
            </div>
            <div className="forecast-img">

                <img src={require(`../static/img/${imageSrc}`)} alt="" />
            </div>
        </div>
    )
}
const ForecastsContainer = ({changeWeatherData, weatherData}) => {
    let forecasts = weatherData.forecasts
    if (forecasts.length > 0) {
        return (
            <div className="forecasts-container">
                {forecasts.map((forecast) => {
                    return (
                        <Forecast isActive={forecast.isActive}
                         time={forecast.time} 
                         temperature={forecast.temperature} 
                         imageSrc={forecast.imageSrc} 
                         key={forecast.id} 
                         changeWeatherData={changeWeatherData} 
                         weatherData={weatherData}
                         timeData = {forecast.timeData}/>
                    )
                })}
            </div>
        )
    } else {
        return (
            <div className="forecasts-container">
                
            </div>
        )
    }
} 

const Forecasts = ({changeWeatherData, weatherData}) => {
    return (
        <div className="forecasts">
            <ForecastTogglers changeWeatherData={changeWeatherData} 
            displayMode={weatherData.forecastDisplayMode} 
            forecastDateOptions={weatherData.forecastDateOptions} 
            requestedForecastDate={weatherData.requestedForecastDate}
            />

            <ForecastsContainer
            changeWeatherData={changeWeatherData} 
            weatherData={weatherData}/>
        </div>
    )
}

export default memo(Forecasts)