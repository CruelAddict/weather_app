import moment from 'moment';

function displayWeatherUI(timezone_offset, temperature, weather_items, wind_speed, humidity, pressure) {
    getGmtTimestamp().then( (timestamp) => {
            $('.wrong-input').removeClass('wrong-input');
            $('#temperature').text(temperature.toFixed(1));
            $('#time').text(timeConverter(timestamp+timezone_offset*1000));
            $('.weather-value-container').addClass('set');
            displayWeatherItems(weather_items).then( (item_index) => {
                item_index++;
                let side = item_index % 2 === 0 ? 'left' : 'right';
                displayWeatherCondition(side, wind_speed, 'wind speed, m/s', item_index);
                item_index++;
                side = item_index % 2 === 0 ? 'left' : 'right';
                displayWeatherCondition(side, humidity+'%', 'humidity', item_index);
                item_index++;
                side = item_index % 2 === 0 ? 'left' : 'right';
                displayWeatherCondition(side, pressure, 'atmospheric pressure, hPa', item_index);
                let checkExist = setInterval(function() {
                    if ($('.weather-value-container').length === item_index+3) {
                        showAllItems();
                        clearInterval(checkExist);
                    }
                }, 100);
            });

        }
    )
}

function hideAllItems(){
    $('.displayed').removeClass('displayed');
}

function showAllItems(){
    $('.weather-value-container.set').addClass('displayed');
}

function raiseError(error_message){
    resetWeatherData();
    displayErrorTooltip(error_message);
}

function resetWeatherData(){
    $('error-tooltip').remove();
    $('.set').removeClass('set');
    hideAllItems();
    $('.optional-weather-item').remove();
}

function displayErrorTooltip(message){
    let template = require('../pug-components/error-tooltip.pug');
    $('body').append($(template({message: message})).filter('.export_component_root').html());
    $('.error-tooltip').delay(2500).fadeOut();
    $('.city-search-field').focus();
    setTimeout(function(){
        $('#main-search:focus').addClass('wrong-input');
    }, 300 );

}

function displayWeatherItems(weather_items){
    return new Promise((resolve, reject) => {
        for (let i = 0; i < weather_items.length; i++) {
            let side = i % 2 === 0 ? 'left' : 'right';
            let title = weather_items[i]['main'].toUpperCase();
            let description = weather_items[i]['description'];
            displayWeatherCondition(side, title, description, i);
            if(i === weather_items.length-1) resolve(i);
        }
    })
}

function displayWeatherCondition(side, title, description, item_index){
    let template = require('../pug-components/weather-item.pug');
    let locals = {
            side: side,
            index: item_index,
            title: title,
            description: description
        };
    $('.weather-data').last().append($(template(locals)).filter('.export_component_root').html());
}

function timeConverter(UNIX_timestamp){
    return moment.utc(new Date(UNIX_timestamp)).format("hh:mm a");
}

function getGmtTimestamp(){
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

export {displayWeatherUI, hideAllItems, showAllItems, raiseError, resetWeatherData}
