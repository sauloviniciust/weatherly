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
				<ul class="result-list" data-result-list></ul>
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
	loading.style.display = 'grid';
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

	// current weather section
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
			<h2 class="card-title title-2">Current Weather</h2>
			<p class="body-3">${description}</p>
			<div class="current-weather-wrapper">
				<img
					src="./assets/images/icons/${icon}.png"
					alt="${description}"
					class="weather-icon"
				/>
				<p class="heading">${parseInt(temp)}&deg;<sup>C</sup></p>
			</div>
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
			console.log(data-location)
		});
	
		currentWeatherSection.appendChild(card);

		// hourly forecast section
		fetchData(url.forecast(lat, lon), function (forecast) {
			const {
				list: forecastList,
				city: { timezone },
			} = forecast;

			hourlySection.innerHTML = `
				<h2 class="title-2">Today's Forecast</h2>
		 		<div class="hourly-slider-container">
		 			<ul class="hourly-slider-list" data-temp></ul>
		 			<ul class="hourly-slider-list" data-wind></ul>
		 		</div>
			`;

			for (const [index, forecastData] of forecastList.entries()) {
				if (index > 7) {
					break;
				}

				const {
					dt: dateTimeUnix,
					main: { temp },
					weather,
					wind: { deg: windDirection, speed: windSpeed },
				} = forecastData;

				const [{ icon, description }] = weather;

				const tempList = document.createElement('li');
				tempList.classList.add('hourly-slider-item');
				tempList.innerHTML = `
					<div class="card card-sm hourly-slider-card">
						<p class="body-3">${parseInt(temp)}&deg;</p>
						<img
							src="./assets/images/icons/${icon}.png"
							title="${description}"
							alt="${description}"
							class="weather-icon"
							loading="lazy"
						/>
						<p class="body-3">${data.getHours(dateTimeUnix, timezone)}</p>
					</div>
				`;

				hourlySection.querySelector('[data-temp]').appendChild(tempList);

				const windList = document.createElement('li');
				windList.classList.add('hourly-slider-item');
				windList.innerHTML = `
					<div class="card card-sm hourly-slider-card">
						<p class="body-3">${data.getHours(dateTimeUnix, timezone)}</p>
						<img
							src="./assets/images/icons/arrow.png"
							alt="Wind Direction"
							class="weather-icon"
							loading="lazy"
							style="transform: rotate(${windDirection - 180}deg)"
						/>
						<p class="body-3">${parseInt(data.mpsToKmh(windSpeed))} Km/h</p>
					</div>
				`;

				hourlySection.querySelector('[data-wind]').appendChild(windList);
			}

			// 5-Day forecast section
			forecastSection.innerHTML = `
				<div class="card card-lg forecast-card">
					<h2 class="card-title title-2" id="forecastLabel">
						5-Day Forecast
					</h2>
					<ul data-forecast-list></ul>
				</div>
			`;

			for (let i = 7, len = forecastList.length; i < len; i += 8) {
				const {
					main: { temp_max },
					weather,
					dt_txt,
				} = forecastList[i];

				const [{ icon, description }] = weather;

				const date = new Date(dt_txt);

				const fiveDayList = document.createElement('li');
				fiveDayList.classList.add('card-item');
				fiveDayList.innerHTML = `
					<div class="forecast-icon-wrapper">
						<img
							src="./assets/images/icons/${icon}.png"
							alt="${description}"
							class="weather-icon"
							title="${description}"
						/>
						<span class="span">
							<p class="title-3">${parseInt(temp_max)}&deg;</p>
						</span>
					</div>
					<p class="label-1">${date.getDate()} ${data.months[date.getUTCMonth()]}</p>
					<p class="label-1">${data.weekDays[date.getUTCDay()]}</p>
				`;

				forecastSection
					.querySelector('[data-forecast-list]')
					.appendChild(fiveDayList);
			}
		});

		// highlights section
		fetchData(url.airPollution(lat, lon), function (airPollution) {
			const [
				{
					main: { aqi },
					components: { no2, o3, so2, pm2_5 },
				},
			] = airPollution.list;

			const card = document.createElement('div');
			card.classList.add('card', 'card-lg', 'highlights-card');
			card.innerHTML = `
			<h2 class="title-2" id="highlights-label">Today's Highlights</h2>
			<div class="highlights-list">
				<div class="card card-sm highlight-card one">
					<h3 class="title-3">Air Quality</h3>
					<div class="highlight-card-wrapper">
						<i class="fa-solid fa-wind"></i>
						<ul class="card-list">
							<li class="card-item">
								<p class="title-1">${Number(pm2_5).toPrecision(3)}</p>
								<p class="label-1">PM<sub>2.5</sub></p>
							</li>
							<li class="card-item">
								<p class="title-1">${Number(so2).toPrecision(3)}</p>
								<p class="label-1">SO<sub>2</sub></p>
							</li>
							<li class="card-item">
								<p class="title-1">${Number(no2).toPrecision(3)}</p>
								<p class="label-1">NO<sub>2</sub></p>
							</li>
							<li class="card-item">
								<p class="title-1">${Number(o3).toPrecision(3)}</p>
								<p class="label-1">O<sub>3</sub></p>
							</li>
						</ul>
					</div>
					<span class="badge aqi-${aqi} label-${aqi}" title="${
				data.aqiText[aqi].message
			}">${data.aqiText[aqi].level}</span>
				</div>
				<div class="card card-sm highlight-card two">
					<h3 class="title-3">Sunrise & Sunset</h3>
					<div class="card-list">
						<div class="card-item">
							<i class="fa-solid fa-sun"></i>
							<div>
								<p class="label-1">Sunrise</p>
								<p class="label-1">${data.getTime(sunriseUnixUTC, timezone)}</p>
							</div>
						</div>
						<div class="card-item">
							<i class="fa-solid fa-moon"></i>
							<div>
								<p class="label-1">Sunset</p>
								<p class="label-1">${data.getTime(sunsetUnixUTC, timezone)}</p>
							</div>
						</div>
					</div>
				</div>
				<div class="card card-sm highlight-card">
			 	<h3 class="title-3">Sensation</h3>
			 	<div class="highlight-card-wrapper">
			 		<i class="fa-solid fa-temperature-three-quarters"></i>
			 		<p class="title-1">${parseInt(feels_like)}&deg;<sup>C</sup></p>
			 	</div>
				</div>
				<div class="card card-sm highlight-card">
					<h3 class="title-3">Humidity</h3>
					<div class="highlight-card-wrapper">
						<i class="fa-solid fa-water"></i>
						<p class="title-1">${humidity}<sup>%</sup></p>
					</div>
				</div>
				<div class="card card-sm highlight-card">
					<h3 class="title-3">Pressure</h3>
					<div class="highlight-card-wrapper">
						<i class="fa-solid fa-weight-scale"></i>
						<p class="title-1">${pressure}<sup>hPa</sup></p>
					</div>
				</div>
				<div class="card card-sm highlight-card">
					<h3 class="title-3">Visibility</h3>
					<div class="highlight-card-wrapper">
						<i class="fa-solid fa-eye"></i>
						<p class="title-1">${visibility / 1000}<sup>Km</sup></p>
					</div>
				</div>
			</div>
		`;

			highlightsSection.appendChild(card);

			loading.style.display = 'none';
			container.style.overflowY = 'overlay';

			container.classList.add('fade-in');
		});
	});
};

export const error404 = () => (errorContent.style.display = 'flex');
