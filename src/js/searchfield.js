import weatherRequests from "./weather-requests";
import weatherUIHandler from "./weather-data-ui";

export default class Searchfield {
    static setSearchfieldEvents() {
        let mainSearch = $("#main-search");
        mainSearch.on("keydown", event => {
            this.onCityInput(event)
        });
        mainSearch.focus(() => {
            weatherUIHandler.hideAllItems()
        });
        mainSearch.focusout(() => {
            weatherUIHandler.showAllItems()
        });
    }

    static onCityInput(event) {
        if (event.which === 13) {
            weatherUIHandler.resetWeatherData();
            $('#main-search').blur();
            weatherRequests.getWeatherByCityName($('#main-search').val());
        }

    }

}

