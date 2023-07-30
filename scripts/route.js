'use strict';

import { updateWeather, error404 } from './index.js';

/**
 * Responsável por obter a localização atual do usuário utilizando a API de geolo-
 * calização do navegador. Uma vez que a posição é obtida com sucesso, ela chama a
 * função updateWeather com as coordenadas de latitude e longitude como parâmetros.
 * Essas coordenadas são utilizadas para buscar os dados climáticos relacionados a
 * essa localização através da função updateWeather.
 *
 * Em caso de erro ao obter a localização do usuário, o código redireciona para a
 * localização padrão definida em defaultLocation, utilizando a propriedade window.
 * location.hash.
 *
 */

const defaultLocation = '#/weather?lat=23.5506507&lon=46.6333824';

const currentLocation = function () {
	window.navigator.geolocation.getCurrentPosition(
		(res) => {
			const { latitude, longitude } = res.coords;

			updateWeather(`lat=${latitude}`, `lon=${longitude}`);
		},
		(err) => {
			window.location.hash = defaultLocation;
		}
	);
};

/**
 * Apresenta uma função chamada searchedLocation que recebe uma string chamada
 * 'query' como parâmetro. Essa função é usada para atualizar as informações
 * climáticas com base em uma consulta específica contida na 'query'.
 *
 */

/**
 *
 * @param {string} query
 */
const searchedLocation = (query) => updateWeather(...query.split('&'));

/**
 * Objeto do tipo Map chamado 'routes', que mapeia caminhos de URL para funções
 * específicas.
 *
 */

const routes = new Map([
	['/current-location', currentLocation],
	['/weather', searchedLocation],
]);

/**
 * Responsável por verificar a parte do fragmento da URL (hash) e encaminhar para
 * a função apropriada com base no caminho de rota correspondente. Começa obtendo
 * a parte do gragment da UTL e dividindo em duas partes: o caminho de rota e a
 * string de consulta (query), separados por '?'. Se não houver uma query, ele
 * define a variável 'query' como undefined.
 *
 */

const checkHash = function () {
	const requestUrl = window.location.hash.slice(1);

	const [route, query] = requestUrl.includes
		? requestUrl.split('?')
		: [requestUrl];

	routes.get(route) ? routes.get(route)(query) : error404();
};

/**
 * Responsável por configurar o roteamento baseado na parte do fragmento da URL.
 *
 * Utiliza os eventos 'hashchange' e 'load' para controlar a navegação do usuário
 * e garantir que a função correta seja chamada para a rota atual quando a página
 * é carregada ou quando a hash é alterada.
 *
 */

window.addEventListener('hashchange', checkHash);

window.addEventListener('load', function () {
	if (!window.location.hash) {
		window.location.hash = '#/current-location';
	} else {
		checkHash();
	}
});
