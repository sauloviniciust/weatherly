'use strict';

import OPEN_WEATHER_API_KEY from './key.js';

const apiKey = OPEN_WEATHER_API_KEY;

/**
 *
 * @param {string} URL OpenWeather API
 * @param {Function} callback callback
 */
export const fetchData = function (URL, callback) {
	fetch(`${URL}&appid=${apiKey}`)
		.then((res) => res.json())
		.then((data) => callback(data));
};

export const url = {
	currentWeather(lat, lon) {
		return `https://api.openweathermap.org/data/2.5/weather?${lat}&${lon}&units=metric`;
	},
	forecast(lat, lon) {
		return `https://api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric`;
	},
	airPollution(lat, lon) {
		return `https://api.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}`;
	},
	reverseGeo(lat, lon) {
		return `https://api.openweathermap.org/geo/1.0/reverse?${lat}&${lon}&limit=5`;
	},
	/**
	 *
	 * @param {string} query search query
	 * @returns
	 */
	geo(query) {
		return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`;
	},
};
