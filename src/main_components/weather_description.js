import { memo } from "react"

const WeatherDescription = ({description}) => {
    return(
        <div className="weather-description">
            <p id="weather-description" className="skeleton-loader">{description}</p>
        </div>
    )
}

export default memo(WeatherDescription)