'use strict';

/**
 * Esse arquivo contém várias funções utilitárias para formatação de datas, horas
 * e outros dados relacionados ao clima. Além disso, ele define um objeto chamado
 * aquiText, que mapeia diferentes níveis do Índice de Qualidade do Ar (AQI) a
 * textos descritivos. Essas funções e constantes são úteis para processar e exibir
 * os dados na interface do usuário.
 *
 */

/**
 * Array que contém os nomes dos dias da semana.
 *
 */

export const weekDays = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
];

/**
 * Array que contém os nomes dos meses do ano.
 *
 */

export const months = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];

/**
 * Recebe um valor de data em formato Unix (em segundos) e um deslocamento de fuso
 * horário em segundos. Retorna uma string formatada representando a data no for-
 * mato 'Dia da Semana Dia, Mês'.
 *
 */

/**
 *
 * @param {number} dateUnix unix date in seconds
 * @param {number} timezone timezone shift from UTC in seconds
 * @returns {string} date string
 */

export const getDate = function (dateUnix, timezone) {
	const date = new Date((dateUnix + timezone) * 1000);
	const weekDay = weekDays[date.getUTCDay()];
	const month = months[date.getUTCMonth()];

	return `${weekDay} ${date.getUTCDate()}, ${month}`;
};

/**
 * Recebe um valor de tempo em formato Unix (em segundos) e um deslocamento de fuso
 * horário em segundos. Retorna uma string formatada representando o horário no
 * formato 'HH:mm AM/PM'.
 */

/**
 *
 * @param {number} timeUnix unix time in seconds
 * @param {number} timezone timezone shift from UTC in seconds
 * @returns {string} time string
 */

export const getTime = function (timeUnix, timezone) {
	const date = new Date((timeUnix + timezone) * 1000);
	const hours = date.getUTCHours();
	const minutes = date.getUTCMinutes();
	const period = hours >= 12 ? 'PM' : 'AM';

	return `${hours % 12 || 12}:${minutes} ${period}`;
};

/**
 * Mesma coisa da função getTime, mas retorna apenas as horas arredondadas no
 * formato 'HH:00 AM/PM'.
 *
 */

/**
 *
 * @param {number} timeUnix unix time in seconds
 * @param {number} timezone timezone shift from UTC in seconds
 * @returns {string} time string
 */

export const getHours = function (timeUnix, timezone) {
	const date = new Date((timeUnix + timezone) * 1000);
	const hours = date.getUTCHours();
	const period = hours >= 12 ? 'PM' : 'AM';

	return `${hours % 12 || 12}:00 ${period}`;
};

/**
 * Recebe uma velocidade em metros por segundo (mps) e converte em quilômetros por
 * hora (km/h).
 *
 */

/**
 *
 * @param {number} mps metters per seconds
 * @returns {number} kilometers per hours
 */
export const mpsToKmh = (mps) => {
	const mph = mps * 3600;

	return mph / 1000;
};

/**
 * Objeto que mapeia diferentes nívdeo de Índice de Qualidade do Ar (AQI) a textos
 * descritivos.
 *
 */

export const aqiText = {
	1: {
		level: 'Good',
		message:
			'Air quality is considered satisfactory, and air pollution poses little to no risk.',
	},
	2: {
		level: 'Fair',
		message:
			'Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.',
	},
	3: {
		level: 'Moderate',
		message:
			'Members of sensitive groups may experience health effects. The general public is not likely to be affected.',
	},
	4: {
		level: 'Poor',
		message:
			'Everyone may begin to experience health effects; Members of sensitive groups may experience more serious issues.',
	},
	5: {
		level: 'Very Poor',
		message:
			'Health warnings of emergency conditions. The entire population is more likely to be affected.',
	},
};
