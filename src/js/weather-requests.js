import weatherUIHandler from "./weather-data-ui";

const api_key = 'bf3565940c52aaa3383c1dbc23799bb1';

export default class weatherRequests {
    static getWeatherByCityName(name) {
        return new Promise((resolve, reject) => {
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
                            // console.log(Http.responseText);
                            let weatherData = JSON.parse(Http.responseText);
                            this.parseWeatherData(weatherData);
                            resolve(0);
                        } else {
                            weatherUIHandler.raiseError('City not found.');
                            resolve(1);
                        }
                    } else {
                        weatherUIHandler.raiseError('Failed to connect to the server.');
                        resolve(1);
                    }
                }
            }
        });
    }

    static parseWeatherData(weatherData) {
        let temperature = weatherData['main']['temp']-273.15;
        let timezone = weatherData['timezone'];
        let weather_items = weatherData['weather'];
        let wind_speed = weatherData['wind']['speed'];
        let humidity = weatherData['main']['humidity'];
        let pressure = weatherData['main']['pressure'];
        weatherUIHandler.displayWeatherUI(timezone, temperature, weather_items, wind_speed, humidity, pressure);
    }
}

