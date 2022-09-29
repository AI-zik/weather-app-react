import { memo, useState } from "react";
import SearchForm from "./search_form_components/searchform";
import SearchResults from "./search_form_components/searchresults";

const Search = ({setSearchQuerying, searchQuerying, changeSearchLocation, setError}) => {

    //state for the city whose coordinates will be looked up
    const [city, setCity] = useState("")

    //typing status state
    const [typingStatus, setTypingStatus] = useState(true)

    //function to change the city state
    const changeCity = (city) => {
        setCity(city)
    }

    return (
        <div className={searchQuerying? "search search-querying" : "search"} onClick={()=> setSearchQuerying(false)}>
            <div onClick={(e) => e.stopPropagation()}>
                <SearchForm changeCity={changeCity} setTypingStatus={setTypingStatus} typingStatus={typingStatus}/>
                <SearchResults changeCity={changeCity} setSearchQuerying={setSearchQuerying} data={city} typingStatus={typingStatus} setTypingStatus={setTypingStatus} changeSearchLocation={changeSearchLocation} setError={setError}/>
            </div>
        </div>
    )
}

export default memo(Search)