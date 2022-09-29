import { memo } from "react";

const WeatherImage = ({source}) => {
    const weatherImage = source === "" ? "" : require(`../static/img/${source}`);
    return (
        <div className="weather-image">
            <img id="weather-image" src={weatherImage} alt={source}/>
            <div className="skeleton-loader"></div>
        </div>
    )
}
export default memo(WeatherImage)