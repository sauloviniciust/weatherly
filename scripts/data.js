'use strict';

export const weekDays = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
];

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
 *
 * @param {number} dateUnix unix date in seconds
 * @param {number} timezone timezone shift from UTC in seconds
 * @returns {string} date string
 */

export const getDate = function (dateUnix, timezone) {
	const date = new Date((dateUnix + timezone) * 1000);
	const weekDays = weekDays[date.getUTCDay()];
	const months = months[date.getUTCMonth()];

	return `${weekDays} ${date.getUTCDate()}, ${months}`;
};

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
 *
 * @param {number} mps metters per seconds
 * @returns {number} kilometers per hours
 */
export const mpsToKmh = (mps) => {
	const mph = mps * 3600;

	return mph / 1000;
};

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
