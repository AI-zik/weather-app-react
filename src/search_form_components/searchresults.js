import { memo, useEffect, useState} from "react"
import { getCityData } from "../fetch_data"

const City = ({name, state, country, latitude, longitude, changeSearchLocation, setSearchQuerying}) => {
    let locationName = `${name}, ${state ? `${state},` : ""} ${country}`
    function handleClick() {

        //to change the search location when the element is clicked
        changeSearchLocation({latitude, longitude, locationName});

        //if it is clicked, close the search form and display the results
        setSearchQuerying(false);
    }
    return (
        <p style={{textAlign: "left"}} className="search-result" onClick={()=> handleClick()}>{`${name}, ${state? state + ", " : ""}${country}`}</p>
    )
}
const SearchResults = ({data, setSearchQuerying, typingStatus, setTypingStatus, changeSearchLocation, setError}) => {
    const [cities, setCities] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(()=> {
        
        //if the data (city) recieved is not an empty string
        // eslint-disable-next-line
        if (data != "") {

            //display the skeleton loader while fetching the city suggestions
            setLoading(true)
            setTypingStatus(false)

            //fetch the city suggestions
            getCityData(data).then(data => {
                //if the city was found
                if (data.length !== 0) {
                    setCities(data);
                } 
                //otherwise set the cities state to an empty array
                else {
                    setCities([])
                }
                setLoading((loading)=> false)
            }).catch((error)=> {
                setError(true)
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    //if fetching data
    if (loading) {
        return (
            <div className={typingStatus ? "search-results" : "search-results show-search-results"}>
                <small>search results</small>
                <div className="search-results-container loading">
                    <p className="skeleton-loader search-result" ></p>
                    <p className="skeleton-loader search-result"></p>
                    <p className="skeleton-loader search-result"></p>
                    <p className="skeleton-loader search-result"></p>
                    <p className="skeleton-loader search-result"></p>
                </div>
            </div>
        )
    }

    //if the cities data was found
    else if (cities.length > 0) {
        return (
            <div className={typingStatus ? "search-results" : "search-results show-search-results"}>
                <small>search results</small>
                <div className="search-results-container">
                    {cities.map((city) => {
                        return (<City name={city.name} setSearchQuerying={setSearchQuerying} state={city.state} country={city.country} latitude={city.lat} longitude={city.lon} key={cities.indexOf(city)} changeSearchLocation={changeSearchLocation}/>)
                    })}
                </div>
            </div>
        )
    } else {

        //if no data was returned from the api
        return (
            <div className={typingStatus ? "search-results" : "search-results show-search-results"}>
                <small>search results</small>
                <div className="city-not-found">
                    <svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <desc>Created with Sketch.</desc>
                        <g id="-Product-Icons" stroke="none" strokeWidth="1" fillRule="evenodd">
                            <g id="ic_fluent_location_not_found_24_regular" fillRule="nonzero">
                                <path d="M5.84301215,4.55890685 C9.24342264,1.15849636 14.7565774,1.15849636 18.1569879,4.55890685 C21.4893901,7.89130914 21.5560382,13.252791 18.356932,16.6663564 L18.1569879,16.8728826 C17.2419979,17.7878725 15.7116094,19.2826735 13.5641649,21.3589636 C12.6919186,22.2023085 11.3080914,22.2022001 10.4359799,21.3587188 L6.5863078,17.6101042 C6.30208268,17.3299283 6.0543257,17.0841961 5.84301215,16.8728826 C2.44260165,13.4724721 2.44260165,7.95931735 5.84301215,4.55890685 Z M17.0963277,5.61956702 C14.2817036,2.80494297 9.71829638,2.80494297 6.90367232,5.61956702 C4.08904826,8.43419108 4.08904826,12.9975983 6.90367232,15.8122224 L8.59986042,17.4841867 C9.38268933,18.2492508 10.3424212,19.181446 11.478793,20.2805069 C11.7694967,20.5616672 12.2307719,20.5617033 12.5215209,20.2805882 L15.4959128,17.3910853 C16.1544227,16.746944 16.6879447,16.2206054 17.0963277,15.8122224 C19.9109517,12.9975983 19.9109517,8.43419108 17.0963277,5.61956702 Z M14.9462117,7.61294647 L15.0303301,7.68556462 C15.2965966,7.95183118 15.3208027,8.36849486 15.1029482,8.66210636 L15.0303301,8.74622479 L13.061,10.7158947 L15.0303301,12.6855646 C15.2965966,12.9518312 15.3208027,13.3684949 15.1029482,13.6621064 L15.0303301,13.7462248 C14.7640635,14.0124914 14.3473998,14.0366974 14.0537883,13.8188429 L13.9696699,13.7462248 L12,11.7768947 L10.0303301,13.7462248 C9.76406352,14.0124914 9.34739984,14.0366974 9.05378835,13.8188429 L8.96966991,13.7462248 C8.70340335,13.4799582 8.6791973,13.0632945 8.89705176,12.7696831 L8.96966991,12.6855646 L10.939,10.7158947 L8.96966991,8.74622479 C8.70340335,8.47995823 8.6791973,8.06329455 8.89705176,7.76968305 L8.96966991,7.68556462 C9.23593648,7.41929806 9.65260016,7.395092 9.94621165,7.61294647 L10.0303301,7.68556462 L12,9.6548947 L13.9696699,7.68556462 C14.2359365,7.41929806 14.6526002,7.395092 14.9462117,7.61294647 Z" id="Color"></path>
                            </g>
                        </g>
                    </svg>
                    <p>Location not found</p>
                </div>
            </div>
        )
    }
}

export default memo(SearchResults)