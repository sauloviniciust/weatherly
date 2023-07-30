'use strict';

import { fetchData, url } from './api.js';
import * as data from './data.js';

/**
 * Essa primeira parte adiciona um evento de clique a múltiplos elementos para
 * exibir ou ocultar uma visualização de busca. Quando os elementos com o atributo
 * '[data-search-toggle]' são clicados, a classe 'active' é alternada no elemento
 * correspondente ao seletor '[data-search]'. Isso permite exibir ou ocultar a
 * área de busca no documento.
 *
 */

/**
 * @param {NodeList} elements
 * @param {string} eventType
 * @param {function} callback
 */
const addEventOnElements = function (elements, eventType, callback) {
	for (const element of elements) {
		element.addEventListener(eventType, callback);
	}
};

const search = document.querySelector('[data-search]');
const searchToggle = document.querySelectorAll('[data-search-toggle]');

const toggleSearch = () => search.classList.toggle('active');

addEventOnElements(searchToggle, 'click', toggleSearch);

/**
 * Esse código implementa o mecanismo de busca em tempo real, que exibe resultados
 * com base nas entradas do usuário. Ele escuta por eventos de 'input' no elemento
 * '[data-search-input]'. Quando o usuário digita algo, um atraso de 500ms é confi-
 * gurado antes de enviar uma solicitação de busca (fetch) ao servidor. Resultados
 * são exibidos em uma lista '[data-search-result]' à medida que são retornados.
 *
 * O código também adiciona eventos de clique a cada item da lista de resultados
 * '[data-result-list]', permitindo que o usuário selecione um resultado para
 * exibir informações climáticas relacionadas à localização escolhida.
 *
 * Além disso, ele lida com algumas interações de classe para mostrar e ocultar os
 * resultados e o estado de busca.
 *
 */

const searchInput = document.querySelector('[data-search-input]');
const searchResult = document.querySelector('[data-search-result]');

let searchTimeout = null;
const searchTimeoutDuration = 500;

searchInput.addEventListener('input', function () {
	searchTimeout ?? clearTimeout(searchTimeout);

	if (!searchInput.value) {
		searchResult.classList.remove('active');
		searchResult.innerHTML = '';

		searchInput.classList.remove('searching');
	} else {
		searchInput.classList.add('searching');
	}

	if (searchInput.value) {
		searchTimeout = setTimeout(() => {
			fetchData(url.geo(searchInput.value), function (locations) {
				searchInput.classList.remove('searching');

				searchResult.classList.add('active');
				searchResult.innerHTML = `
				<ul class="result-list" data-result-list>
				 	<li class="result-item"></li>
				</ul>
				`;

				const /** {NodeList} | [] */ items = [];

				for (const { name, lat, lon, country, state } of locations) {
					const searchItem = document.createElement('li');

					searchItem.classList.add('result-item');
					searchItem.innerHTML = `
					 	<i class="fa-solid fa-location-dot"></i>
 						<div>
 							<p class="result-title">${name}</p>
 							<p class="result-subtitle label-2">${state || ''}, ${country}</p>
 						</div>
 						<a href="#/weather?lat=${lat}&lon=${lon}" class="result-link has-state" aria-label="${name} weather" data-search-toggle></a>
					`;

					searchResult
						.querySelector('[data-result-list]')
						.appendChild(searchItem);

					items.push(searchItem.querySelector('[data-search-toggle]'));
				}

				addEventOnElements(items, 'click', function () {
					toggleSearch();

					searchResult.classList.remove('active');
				});
			});
		}, searchTimeoutDuration);
	}
});

/**
 * Responsável por atualizar a exibição das informações climáticas na página.
 *
 * Recebe as coordenadas de latitude e longitude como entrada e busca os dados
 * climáticos relacionados a essas coordenadas através da função fetchData. Em
 * seguida, atualiza os elementos do DOM relevantes para exibir as informações
 * atuais do clima, como temperatura, descrição do tempo, ícone, data, cidade e
 * país.
 *
 * Também lida com a desativação e reativação do botão de localização atual com
 * base na rota da URL, e remove os conteúdos anteriores antes de adicionar os
 * novos dados do clima para garantir uma exibição atualizada.
 *
 */

const container = document.querySelector('[data-container]');
const loading = document.querySelector('[data-loading]');
const currentLocationBtn = document.querySelector(
	'[data-current-location-btn]'
);
const errorContent = document.querySelector('[data-error-content]');

/**
 *
 * @param {*} lat
 * @param {*} lon
 */
export const updateWeather = function (lat, lon) {
	// loading.style.display = 'grid';
	container.style.overflowY = 'hidden';
	errorContent.style.display = 'none';

	container.classList.remove('fade-in');

	const currentWeatherSection = document.querySelector(
		'[data-current-weather]'
	);
	const highlightsSection = document.querySelector('[data-highlights]');
	const hourlySection = document.querySelector('[data-hourly-forecast]');
	const forecastSection = document.querySelector('[data-5-day-forecast]');

	currentWeatherSection.innerHTML = '';
	highlightsSection.innerHTML = '';
	hourlySection.innerHTML = '';
	forecastSection.innerHTML = '';

	if (window.location.hash === '#/current-location') {
		currentLocationBtn.setAttribute('disabled', '');
	} else {
		currentLocationBtn.removeAttribute('disabled');
	}

	fetchData(url.currentWeather(lat, lon), function (currentWeather) {
		const {
			weather,
			dt: dateUnix,
			sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC },
			main: { temp, feels_like, pressure, humidity },
			visibility,
			timezone,
		} = currentWeather;

		const [{ description, icon }] = weather;

		const card = document.createElement('div');
		card.classList.add('card', 'card-lg', 'current-weather-card');
		card.innerHTML = `
			<h2 class="card-title title-2">CurrentWeather</h2>
			<div class="current-weather-wrapper">
				<img
					src="./assets/images/icons/${icon}.png"
					alt="${description}"
					class="weather-icon"
				/>
				<p class="heading">${parseInt(temp)}&deg;<sup>C</sup></p>
			</div>
			<p class="body-3">${description}</p>
			<ul class="current-weather-list">
				<li class="current-weather-list-item">
					<i class="fa-solid fa-calendar-day"></i>
					<p class="current-weather-list-text title-3">
						${data.getDate(dateUnix, timezone)}
					</p>
				</li>
				<li class="current-weather-list-item">
					<i class="fa-solid fa-location-dot"></i>
					<p class="current-weather-list-text title-3" data-location></p>
				</li>
			</ul>
		`;

		fetchData(url.reverseGeo(lat, lon), function ([{ name, country }]) {
			card.querySelector('[data-location]').innerHTML = `${name}, ${country}`;
		});

		currentWeatherSection.appendChild(card);
	});
};

export const error404 = function () {};
