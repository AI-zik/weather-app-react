import { memo } from "react"

const Location = ({location, date}) => {
    return (
            <div className="location">
                <p id="location" className="skeleton-loader">{location}</p>
                <div><p id="date" className="skeleton-loader">{date}</p></div>
            </div>
    )
}

export default memo(Location)