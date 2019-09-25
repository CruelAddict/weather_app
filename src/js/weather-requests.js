import {displayWeatherUI} from "./weather-data-ui";
import {raiseError} from "./weather-data-ui";

const api_key = 'bf3565940c52aaa3383c1dbc23799bb1';

function getWeatherByCityName(name) {
    console.log('Getting weather');
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${api_key}`;
    const Http = new XMLHttpRequest();
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4)
        {
            if (Http.responseText)
            {
                if (Http.status === 200){
                    console.log(Http.responseText);
                    let weather_data = JSON.parse(Http.responseText);
                    let temperature = weather_data['main']['temp']-273.15;
                    let timezone = weather_data['timezone'];
                    let weather_items = weather_data['weather'];
                    let wind_speed = weather_data['wind']['speed'];
                    let humidity = weather_data['main']['humidity'];
                    let pressure = weather_data['main']['pressure'];
                    displayWeatherUI(timezone, temperature, weather_items, wind_speed, humidity, pressure);
                } else raiseError('City not found.')
            } else raiseError('Failed to connect to the server.')
        }
    }
}
export {getWeatherByCityName}
