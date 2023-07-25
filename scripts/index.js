'use strict';

import { fetchData, url } from './api.js';
import * as data from './data.js';

/**
 *
 * @param {NodeList} elements elements node array
 * @param {string} eventType event type
 * @param {function} callback callback function
 */
const addEventOnElements = function (elements, eventType, callback) {
	for (const element of elements) element.addEventListener(eventType, callback);
};

const searchView = document.querySelector('[data-search]');
const searchToggle = document.querySelectorAll('[data-search-toggle]');

const toggleSearch = () => searchView.classList.toggle('active');
addEventOnElements(searchToggle, 'click', toggleSearch);

// search
const searchField = document.querySelector('[data-search-input]');
const searchResult = document.querySelector('[data-search-result]');

let searchTimeout = null;
const searchTimeoutDuration = 500;

searchField.addEventListener('input', function () {
	searchTimeout ?? clearTimeout(searchTimeout);

	if (!searchField.value) {
		searchResult.classList.remove('active');
		searchResult.innerHTML = '';
		searchField.classList.remove('searching');
	} else {
		searchField.classList.add('searching');
	}

	if (searchField.value) {
		searchTimeout = setTimeout(() => {
			fetchData(url.geo(searchField.value), function (locations) {
				searchField.classList.remove('searching');
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
						<a
							href="#/weather?lat=${lat}&lon=${lon}"
							class="result-link has-state" aria-label="${name} weather"
							data-search-toggle
						></a>
                    `;

					searchResult
						.querySelector('[data-result-list]')
						.appendChild(searchItem);

					items.push(searchItem.querySelector('[data-search-toggle]'));
				}
			});
		}, searchTimeoutDuration);
	}
});
