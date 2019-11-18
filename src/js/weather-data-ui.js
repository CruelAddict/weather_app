import moment from 'moment';

export default class weatherUIHandler {

    static displayWeatherUI(timezone_offset, temperature, weather_items, wind_speed, humidity, pressure) {
        this.getGmtTimestamp().then( (timestamp) => {
                $('.wrong-input').removeClass('wrong-input');
                $('#temperature').text(temperature.toFixed(1));
                $('#time').text(this.timeConverter(timestamp+timezone_offset*1000));
                $('.weather-value-container').addClass('set');
                this.displayWeatherItems(weather_items).then( (item_index) => {
                    item_index++;
                    let side = item_index % 2 === 0 ? 'left' : 'right';
                    this.displayWeatherCondition(side, wind_speed, 'wind speed, m/s', item_index);
                    item_index++;
                    side = item_index % 2 === 0 ? 'left' : 'right';
                    this.displayWeatherCondition(side, humidity+'%', 'humidity', item_index);
                    item_index++;
                    side = item_index % 2 === 0 ? 'left' : 'right';
                    this.displayWeatherCondition(side, pressure, 'atmospheric pressure, hPa', item_index);
                    let checkExist = setInterval(function() {
                        if ($('.weather-value-container').length === item_index+3) {
                            weatherUIHandler.showAllItems();
                            clearInterval(checkExist);
                        }
                    }, 100);
                });

            }
        )
    }

    static hideAllItems(){
        $('.displayed').removeClass('displayed');
    }

    static showAllItems(){
        $('.weather-value-container.set').addClass('displayed');
    }

    static raiseError(error_message){
        this.resetWeatherData();
        this.displayErrorTooltip(error_message);
    }

    static resetWeatherData(){
        $('error-tooltip').remove();
        $('.set').removeClass('set');
        this.hideAllItems();
        $('.optional-weather-item').remove();
    }

    static displayErrorTooltip(message){
        let template = require('../pug-components/error-tooltip.pug');
        $('body').append($(template({message: message})).filter('.export_component_root').html());
        $('.error-tooltip').delay(2500).fadeOut();
        $('.city-search-field').focus();
        setTimeout(function(){
            $('#main-search:focus').addClass('wrong-input');
        }, 300 ).catch(err => console.log(err));

    }

    static displayWeatherItems(weather_items){
        return new Promise((resolve, reject) => {
            for (let i = 0; i < weather_items.length; i++) {
                let side = i % 2 === 0 ? 'left' : 'right';
                let title = weather_items[i]['main'].toUpperCase();
                let description = weather_items[i]['description'];
                this.displayWeatherCondition(side, title, description, i);
                if(i === weather_items.length-1) resolve(i);
            }
        })
    }

    static displayWeatherCondition(side, title, description, item_index){
        let template = require('../pug-components/weather-item.pug');
        let locals = {
            side: side,
            index: item_index,
            title: title,
            description: description
        };
        $('.weather-data').last().append($(template(locals)).filter('.export_component_root').html());
    }

    static timeConverter(UNIX_timestamp){
        return moment.utc(new Date(UNIX_timestamp)).format("hh:mm a");
    }

    static getGmtTimestamp(){
        return new Promise( (resolve, reject) =>
            {
                let url = `http://worldtimeapi.org/api/timezone/Etc/GMT`;
                const Http = new XMLHttpRequest();
                Http.open("GET", url);
                Http.send();
                Http.onreadystatechange = (e) => {
                    if (Http.readyState === 4) {
                        if (Http.responseText) {
                            resolve(JSON.parse(Http.responseText)['unixtime']*1000);
                        }
                    }
                }
            }
        )
    }
}
