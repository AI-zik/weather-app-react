import Search from "./search"
import Main from "./main"
import { useEffect, useState } from "react"
import { getCookie, setCookie } from "./utils"
import Welcome from "./welcome"
import Error from "./error"


const App = () => {

    const [searchQuerying, setSearchQuerying] = useState(false)
    const [searchLocation, setSearchLocation] = useState({
        latitude : getCookie("current latitude"),
        longitude: getCookie("current longitude")
    })
    //to display the welcome screen if user is a new user
    const [welcomeStatus, setWelcomeStatus] = useState(false)
    
    //display errors if an error occured
    const [error, setError] = useState(false)

    //useEffect to diaplay the welcome message to new users
    useEffect(()=> {
        if (!getCookie("current latitude")) {
            setWelcomeStatus(true)
        }
    }, [])

    const searchQueryingState = (state) => {
        setSearchQuerying(state)
    }


    //like the variable name explains: to change the location where forecast data is gotten from
    const changeSearchLocation = (location) => {
        setSearchLocation(location)
        setCookie("current latitude", location.latitude, 30)
        setCookie("current longitude", location.longitude, 30)
        setCookie("current location", location.locationName, 30)
    }

    //if the user is a new user
    if (welcomeStatus) {
        return <Welcome setStatus={setWelcomeStatus} status={welcomeStatus}/>
    }
    
    //the user is an existing user, just display the screen
    else {
        return (<>
            <Search searchQuerying={searchQuerying} setSearchQuerying={setSearchQuerying} changeSearchLocation={changeSearchLocation} setError={setError}/>
            <Main setSearchQuerying={searchQueryingState} searchQuerying={searchQuerying} searchLocation={searchLocation} setError={setError}/>
            <Error error={error} setError={setError} />
        </>)
    }
}

export default App