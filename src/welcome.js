import { memo } from "react"

const Welcome = ({setStatus, status}) => {

    return (
        <div className={`welcome-body ${status ? "welcome-body-show" : ""}`}>
            <div className="welcome-img">
                <img src={require("./static/img/partly cloudy day.png")} alt="" />
            </div>
            <div className="welcome-text">
                <h1>Get to know more about the weather of an area</h1>
                <p>Recieve up-to-date data and statistics about the weather of a particular city</p>
            </div>
            <div className="welcome-button">
                <button id="start-weather-forecasts" onClick={() => setStatus(false)}>Get started</button>
            </div>
        </div>
    )
}

export default memo(Welcome)