import { getWeatherByCity, searchCities } from './weatherAPI';

/**
 * Cria um elemento HTML com as informações passadas
 */
function createElement(tagName, className, textContent = '') {
  const element = document.createElement(tagName);
  element.classList.add(...className.split(' '));
  element.textContent = textContent;
  return element;
}

/**
 * Recebe as informações de uma previsão e retorna um elemento HTML
 */
function createForecast(forecast) {
  const { date, maxTemp, minTemp, condition, icon } = forecast;

  const weekday = new Date(date);
  weekday.setDate(weekday.getDate() + 1);
  const weekdayName = weekday.toLocaleDateString('pt-BR', { weekday: 'short' });

  const forecastElement = createElement('div', 'forecast');
  const dateElement = createElement('p', 'forecast-weekday', weekdayName);

  const maxElement = createElement('span', 'forecast-temp max', 'max');
  const maxTempElement = createElement('span', 'forecast-temp max', `${maxTemp}º`);
  const minElement = createElement('span', 'forecast-temp min', 'min');
  const minTempElement = createElement('span', 'forecast-temp min', `${minTemp}º`);
  const tempContainer = createElement('div', 'forecast-temp-container');
  tempContainer.appendChild(maxElement);
  tempContainer.appendChild(minElement);
  tempContainer.appendChild(maxTempElement);
  tempContainer.appendChild(minTempElement);

  const conditionElement = createElement('p', 'forecast-condition', condition);
  const iconElement = createElement('img', 'forecast-icon');
  iconElement.src = icon.replace('64x64', '128x128');

  const middleContainer = createElement('div', 'forecast-middle-container');
  middleContainer.appendChild(tempContainer);
  middleContainer.appendChild(iconElement);

  forecastElement.appendChild(dateElement);
  forecastElement.appendChild(middleContainer);
  forecastElement.appendChild(conditionElement);

  return forecastElement;
}

/**
 * Limpa todos os elementos filhos de um dado elemento
 */
function clearChildrenById(elementId) {
  const citiesList = document.getElementById(elementId);
  while (citiesList.firstChild) {
    citiesList.removeChild(citiesList.firstChild);
  }
}

/**
 * Recebe uma lista de previsões e as exibe na tela dentro de um modal
 */
export function showForecast(forecastList) {
  const forecastContainer = document.getElementById('forecast-container');
  const weekdayContainer = document.getElementById('weekdays');
  clearChildrenById('weekdays');
  forecastList.forEach((forecast) => {
    const weekdayElement = createForecast(forecast);
    weekdayContainer.appendChild(weekdayElement);
  });

  forecastContainer.classList.remove('hidden');
}

/**
 * Recebe um objeto com as informações de uma cidade e retorna um elemento HTML
 */

const listenerButton = async () => {
   const searchInput = document.getElementById('search-input');
  const searchValue = searchInput.value;
  const cityPrev = await searchCities(searchValue);
  const urlCityPrev = cityPrev.map(({ url }) => url);
  const TOKEN = import.meta.env.VITE_TOKEN;
  const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?lang=pt&key=${TOKEN}&q=${urlCityPrev}&days=7`);
  const data = await response.json();
  const forecastDays = data.forecast.forecastday;
  const array = [];
  for (let index = 0; index < forecastDays.length; index += 1) {
    const objForecast = {
      date: forecastDays[index].date,
      maxTemp: forecastDays[index].day.maxtemp_c,
      minTemp: forecastDays[index].day.mintemp_c,
      condition: forecastDays[index].day.condition.text,
      icon: forecastDays[index].day.condition.icon,
    };
    array.push(objForecast);
  }
  showForecast(array);
};
  /*const searchInput = document.getElementById('search-input');
  const searchValue = searchInput.value;
  const cityPrev = await searchCities(searchValue);
  const urlCityPrev = cityPrev.map(({ url }) => url);
  const TOKEN = import.meta.env.VITE_TOKEN;
  const array = [];
  for (const urlCities of urlCityPrev) {
  const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?lang=pt&key=${TOKEN}&q=${urlCities}&days=7`);
  const data = await response.json();
  const forecastDays = data.forecast.forecastday;
  for (const day of forecastDays){
    const objForecast = {
      date: day.date,
      maxTemp: day.day.maxtemp_c,
      minTemp: day.day.mintemp_c,
      condition: day.day.condition.text,
      icon: day.day.condition.icon,
    };
    console.log(objForecast);
    array.push(objForecast);
  }
  for (let index = 0; index < forecastDays.length; index += 1) {
    const objForecast = {
      date: forecastDays[index].date,
      maxTemp: forecastDays[index].day.maxtemp_c,
      minTemp: forecastDays[index].day.mintemp_c,
      condition: forecastDays[index].day.condition.text,
      icon: forecastDays[index].day.condition.icon,
    };
    array.push(objForecast);
  }
  }
  showForecast(array);
};*/

export async function createCityElement(cityInfo) {
  const cities = document.querySelector('#cities');
  const { name, country, temp, condition, icon /* , url */ } = cityInfo;
  const cityElement = createElement('li', 'city');
  const headingElement = createElement('div', 'city-heading');
  const nameElement = createElement('h2', 'city-name', name);
  const countryElement = createElement('p', 'city-country', country);
  headingElement.appendChild(nameElement);
  headingElement.appendChild(countryElement);

  const tempElement = createElement('p', 'city-temp', `${temp}º`);
  const conditionElement = createElement('p', 'city-condition', condition);

  const tempContainer = createElement('div', 'city-temp-container');
  tempContainer.appendChild(conditionElement);
  tempContainer.appendChild(tempElement);

  const iconElement = createElement('img', 'condition-icon');
  iconElement.src = icon.replace('64x64', '128x128');

  const infoContainer = createElement('div', 'city-info-container');
  infoContainer.appendChild(tempContainer);
  infoContainer.appendChild(iconElement);
  const btnElement = createElement('button', 'btnCity', 'Ver Previsão');
  cities.appendChild(cityElement);
  cityElement.appendChild(headingElement);
  headingElement.appendChild(nameElement);
  headingElement.appendChild(countryElement);
  cityElement.appendChild(infoContainer);
  cityElement.appendChild(btnElement);

  const btnPrevisao = document.querySelectorAll('.btnCity');
  btnPrevisao.forEach(button => {
    button.addEventListener('click', () => {
      const url = button.getAttribute('data-url');
      listenerButton(url);
    });
  });
  return cityElement;
}

/**
 * Lida com o evento de submit do formulário de busca
 */
export async function handleSearch(event) {
  event.preventDefault();
  clearChildrenById('cities');
  let objCities = {};
  let objetoReturn = {};
  const searchInput = document.getElementById('search-input');
  const searchValue = searchInput.value;
  // seu código aqui
  const teste = await searchCities(searchValue);
  for (let index = 0; index < teste.length; index += 1) {
    objCities = {
      name: teste[index].name,
      country: teste[index].country,
    };
    const teste2 = await getWeatherByCity(teste[index].url);
    objetoReturn = { ...objCities, ...teste2 };
    createCityElement(objetoReturn);
  }
  
}
