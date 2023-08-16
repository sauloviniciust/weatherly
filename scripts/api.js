'use strict';

import OPEN_WEATHER_API_KEY from './key.js';

const apiKey = OPEN_WEATHER_API_KEY;
// const apiKey = process.env.API_KEY;


// const apiKey = '%API_KEY%';

/**
 * Função responsável por buscar dados climáticos da API da OpenWeather usando a
 * função 'fetch'. Ela recebe uma URL da API e uma função de retorno (callback)
 * como parâmetros.
 *
 */

/**
 *
 * @param {string} URL
 * @param {Function} callback
 */
export const fetchData = function (URL, callback) {
	fetch(`${URL}&appid=${apiKey}`)
		.then((res) => res.json())
		.then((data) => callback(data));
};

/**
 * Esse módulo contém um objeto chamado 'url', que possui várias funções que re-
 * tornam URLs formatadas para diferentes endpoints da API. Cada função é respon-
 * sável por gerar a URL apropriada com base nos parâmetros fornecidos.
 *
 */

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
