export const weatherImgCodes = {
    "0": "clear sky day.png",
    "0.5" : "clear sky night.png",
    "1" : "mainly clear day.png",
    "1.5" : "mainly clear night.png",
    "2" : "partly cloudy day.png",
    "2.5" : "partly cloudy night.png",
    "3" : "overcast.png" ,
    "45" : "fog.png",
    "48" : "fog.png",
    "51" :  "drizzle day.png",
    "51.5" : "drizzle night.png",
    "53" : "drizzle day.png",
    "53.5" : "drizzle night.png",
    "55" : "drizzle day.png",
    "55.5" : "drizzle night.png",
    "56" : "freezing drizzle day.png",
    "56.5" : "freezing drizzle night.png",
    "57" : "freezing drizzle day.png",
    "57.5" : "freezing drizzle night.png",
    "61" : "rain day.png",
    "61.5" : "rain night.png",
    "63" : "rain day.png",
    "63.5" : "rain night.png",
    "65" : "rain day.png",
    "65.5" : "rain night.png",
    "66" : "freezing rain.png",
    "67" : "freezing rain.png",
    "71" : "snow fall.png",
    "73" : "snow fall.png",
    "75" : "snow fall.png",
    "77" : "snow grains.png",
    "80" : "slight rain shower day.png",
    "80.5" : "slight rain shower night.png",
    "81" : "rain shower.png",
    "82" : "rain shower.png",
    "85" : "snow fall.png",
    "86" : "snow fall.png",
    "95" : "thunderstorm.png",
    "96" : "thunderstorm with hail.png",
    "99" : "thunderstorms with hail.png"
}

export const codesWithNightMode = [0, 1, 2, 51, 52, 53, 56, 57, 61, 63, 65, 80]

export const weatherDescCodes = {
    "0": "Clear skies",
    "1" : "Mainly clear skies",
    "2" : "Partly cloudy skies",
    "3" : "Overcast skies" ,
    "45" : "Foggy",
    "48" : "Depositing rime fog",
    "51" :  "Light drizzle",
    "53" : "Moderate drizzle",
    "55" : "Dense drizzle",
    "56" : "Light Freezing drizzle",
    "57" : "Dense freezing drizzle",
    "61" : "Slight rain",
    "63" : "Moderate rainfall",
    "65" : "Heavy rainfall",
    "66" : "Slight freezing rainfall",
    "67" : "Heavy freezing rainfall",
    "71" : "Slight snow fall",
    "73" : "Moderate snow fall",
    "75" : "Heavy snow fall",
    "77" : "Snow grains",
    "80" : "Slight rain shower",
    "81" : "Moderate rain shower",
    "82" : "Violent rain shower",
    "85" : "Slight snow shpwers",
    "86" : "Heavy snow showers",
    "95" : "Thunderstorms",
    "96" : "Thunderstorms with slight hail",
    "99" : "Thunderstorms with heavy hail"
}
export const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export const addZero = (value) => {if (value < 10) {value = "0" + value} return value}

export function checkNightMode(code, date) {
    if (codesWithNightMode.includes(code)) {
        if (date.getHours() < 7 || date.getHours() > 18) {
            return code + ".5"
        } else {
            return code
        }
    } else {
        return code
    }
}

//function to check for fetch errors
export function checkError(response) {
    if (!response.ok) {
        throw Error (response.statusText)
    }
}

export const today = new Date()

//cookie functions
export function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

export function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

export function checkCookie (cname) {
    return getCookie(cname) !== ""? true : false
}