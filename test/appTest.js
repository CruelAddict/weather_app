import jsdom from 'mocha-jsdom';
import App from '../src/js/app';
import mocha from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
const describe = mocha.describe;
import * as chai from "chai";
const MockXMLHttpRequest = require('mock-xmlhttprequest');
import assert from 'assert';

import Searchfield from '../src/js/searchfield'
import weatherUIhandler from '../src/js/weather-data-ui'
import weatherRequests from '../src/js/weather-requests'


chai.use(sinonChai);
const expect = chai.expect;

global.window = jsdom({
    url: "http://localhost"
});

describe('App', () => {

    before(() => {
        let $ = require('jquery');
        global.$ = $;
    });

    beforeEach(() => {
        sinon.restore();
    });

    it('Should call setSearchfieldEvents', () => {
        let spy = sinon.spy(Searchfield, 'setSearchfieldEvents');
        new App();
        expect(spy).to.have.been.calledOnce
    });

    describe('Searchfield', () => {

        it('Should set keydown action', () => {
            let spy = sinon.spy($.prototype, "on");

            Searchfield.setSearchfieldEvents();

            expect(spy.getCall(0).args[0]).to.equal("keydown");
        });

        it('Should set focus action', () => {
            let spy = sinon.spy($.prototype, "on");

            Searchfield.setSearchfieldEvents();

            expect(spy.getCall(1).args[0]).to.equal("focus");
            expect(spy.getCall(2).args[0]).to.equal("focusout");
        });

        describe('OnCityInput', () => {

            it('Should call resetWeatherData if key is Enter', () => {
                let spy = sinon.spy(weatherUIhandler, 'resetWeatherData');
                let event = $.Event("keydown");

                event.which = 13;
                Searchfield.onCityInput(event);

                expect(spy).to.have.been.calledOnce
            });

            it('Should blur the searchfield if key is Enter', () => {
                let spy = sinon.spy($.prototype, "blur");
                let event = $.Event("keydown");

                event.which = 13;
                Searchfield.onCityInput(event);

                expect(spy).to.have.been.calledOnce
            });

            it('Should call getWeather with provided name if key is Enter', () => {
                let spy = sinon.spy(weatherRequests, "getWeatherByCityName");
                let event = $.Event("keydown");

                event.which = 13;
                Searchfield.onCityInput(event);

                expect(spy).to.have.been.calledOnce
            });

            it('Should do nothing if key is not Enter', () => {
                let spy0 = sinon.spy(weatherUIhandler, 'resetWeatherData');
                let spy1 = sinon.spy($.prototype, "blur");
                let spy2 = sinon.spy(weatherRequests, "getWeatherByCityName");
                let event = $.Event("keydown");

                event.which = 14;
                Searchfield.onCityInput(event);

                sinon.assert.callCount(spy0, 0);
                sinon.assert.callCount(spy1, 0);
                sinon.assert.callCount(spy2, 0);
            })
        });

    });

    describe('Weather Requests', () => {

        var server;

        before(() => {
            XMLHttpRequest = null;

            server = MockXMLHttpRequest.newServer({
                get: ['http://api.openweathermap.org/data/2.5/weather?q=London&appid=bf3565940c52aaa3383c1dbc23799bb1', {
                    // status: 200 is the default
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(LondonWeatherResponse),
                }],
            }).install();

            // server.respondWith('GET', 'http://worldtimeapi.org/api/timezone/Etc/GMT',
            //     [
            //         200,
            //         '{ "Content-Type": "application/json" }',
            //         '{"week_number":46,"utc_offset":"+00:00","utc_datetime":"2019-11-17T15:27:49.858551+00:00","unixtime":1574004469,"timezone":"Etc/GMT","raw_offset":0,"dst_until":null,"dst_offset":0,"dst_from":null,"dst":false,"day_of_year":321,"day_of_week":0,"datetime":"2019-11-17T15:27:49.858551+00:00","client_ip":"5.18.222.244",' +
            //         '"abbreviation":"GMT"}'
            //     ])
        });

        it('displayWeatherData should be called with the response data if response is OK', () => {
            let spy = sinon.stub(weatherRequests, 'parseWeatherData');
            return weatherRequests.getWeatherByCityName('London').then(() => {
                expect(spy).to.have.been.calledOnce;
                // expect(spy.getCall(0).args).to.equal();
            }).catch((err) => {
                assert.fail(`Test failed: ${err}`);
            });

        });

        it('S"Not found" error should be raised if response is 400x', () => {
            let stub = sinon.stub(weatherUIhandler, 'raiseError');
            server.get('http://api.openweathermap.org/data/2.5/weather?q=NonExistingCity&appid=bf3565940c52aaa3383c1dbc23799bb1', {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
                body: '',
            });
            return weatherRequests.getWeatherByCityName('NonExistingCity').then(() => {
                expect(stub).to.have.been.calledOnce;
            }).catch((err) => {
                assert.fail(`Test failed: ${err}`);
            });
        });

        it('S"Not found" error should be raised if response is 400x', () => {
            let stub = sinon.stub(weatherUIhandler, 'raiseError');
            server.get('http://api.openweathermap.org/data/2.5/weather?q=NonExistingCity&appid=bf3565940c52aaa3383c1dbc23799bb1', {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
                body: '',
            });
            return weatherRequests.getWeatherByCityName('NonExistingCity').then(() => {
                expect(stub).to.have.been.calledOnce;
            }).catch((err) => {
                assert.fail(`Test failed: ${err}`);
            });
        })

    });

});


var LondonWeatherResponse = {
    "coord": {"lon": -0.13, "lat": 51.51},
    "weather": [{"id": 803, "main": "Clouds", "description": "broken clouds", "icon": "04d"}],
    "base": "stations",
    "main": {"temp": 280.6, "pressure": 1011, "humidity": 81, "temp_min": 279.82, "temp_max": 281.48},
    "visibility": 10000,
    "wind": {"speed": 2.6, "deg": 360},
    "clouds": {"all": 75},
    "dt": 1574004909,
    "sys": {"type": 1, "id": 1412, "country": "GB", "sunrise": 1573975285, "sunset": 1574006980},
    "timezone": 0,
    "id": 2643743,
    "name": "London",
    "cod": 200
};
