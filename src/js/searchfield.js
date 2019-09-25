import {getWeatherByCityName} from "./weather-requests";
import {hideAllItems, showAllItems, resetWeatherData} from "./weather-data-ui";

function setSearchfieldEvents() {
    let mainSearch = $("#main-search");
    mainSearch.on("keydown", function (event) {
        if (event.which === 13) {
            resetWeatherData();
            mainSearch.blur();
            getWeatherByCityName($('#main-search').val());
        }
    });
    mainSearch.focus(() => {
        hideAllItems()
    });
    mainSearch.focusout(() => {
        showAllItems()
    });
}

export {setSearchfieldEvents}
