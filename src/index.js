
const { body } = document;
let city;
const place = document.querySelector('#timezone');
const fahrenheitBtn = document.getElementById('fahrenheit');
const celsiusBtn = document.getElementById('celsius');
const temperatureDegree = document.querySelector('.weather-today--temperature');
const API_KEY = '995905e2fb21d6bf45a41cd5f589d28b';
const todayDate = document.getElementById('today');
const FORM = document.getElementById('form');

function convertFahrenheitToCelsius(val) {
  const res = (val - 32) / 1.8;
  return res.toFixed(0);
}

function convertCelsiusToFahrenheit(val) {
  const res = (val * 1.8) + 32;
  return res.toFixed(0);
}

function setCoordinates(lon, lat) {
  const lonData = document.querySelector('.weather-lon__data');
  lonData.innerHTML = lon.toFixed(2);
  const latData = document.querySelector('.weather-lat__data');
  latData.innerHTML = lat.toFixed(2);
}

function getTime(offset) {
  const d = new Date();
  const localTime = d.getTime();
  const localOffset = d.getTimezoneOffset() * 60000;
  let utc = localTime + localOffset;
  const nd = new Date(utc + (3600000 * offset));
  utc = new Date(utc);
  return nd.toLocaleString();
}

async function getImage() {
  const key = '8d720f0d7885b299d736582e9383e03be14a24fdb99e6054335a47b219b4dd9d';
  const url = `https://api.unsplash.com/photos/random?query=town,${city}&client_id=${key}`;
  let data;
  try {
    const response = await fetch(url);
    data = await response.json();
    const link = data.urls.regular;
    body.style.backgroundImage = `url(${link})`;
  } catch (e) {
    throw new TypeError(e);
  }
}

const btnLoad = document.getElementById('bgImg');
btnLoad.addEventListener('click', getImage);

async function getWeatherNextDay() {
  const apiWeatherNextDay = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;
  const response = await fetch(apiWeatherNextDay);
  const json = await response.json();
  const { list } = json;
  // eslint-disable-next-line array-callback-return,consistent-return
  const arrTempNextDay = list.filter((x) => {
    if (x.dt_txt.indexOf('00:00:00') !== -1) return x;
  }).map((y) => y.main.temp.toFixed(0));
  document.getElementById('tm').innerText = `${arrTempNextDay[0]}°`;
  document.getElementById('dayAfterTm').innerText = `${arrTempNextDay[1]}°`;
  document.getElementById('afterTheDayAfterTm').innerText = `${arrTempNextDay[2]}°`;
}

function drawGettingDataInHTML(timezone, temperature, offset) {
  todayDate.textContent = getTime(offset);
  temperatureDegree.textContent = convertFahrenheitToCelsius(temperature);
  place.textContent = timezone;
  document.querySelector('.weather-today--degree').textContent = '°C';

  fahrenheitBtn.addEventListener('click', () => {
    temperatureDegree.textContent = temperature.toFixed(0);
    document.querySelector('.weather-today--degree').textContent = '°F';
  });

  celsiusBtn.addEventListener('click', () => {
    temperatureDegree.textContent = convertFahrenheitToCelsius(temperature);
    document.querySelector('.weather-today--degree').textContent = '°C';
  });
}

function getTemperatureGeolocation() {
  let lon;
  let lat;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      const key = '6db804c95b7372415c202d3538ec9d88';
      const proxy = 'https://cors-anywhere.herokuapp.com/';
      const api = `${proxy}https://api.darksky.net/forecast/${key}/${lat},${lon}`;
      const response = await fetch(api);
      const data = await response.json();
      const { temperature } = data.currently;
      const { timezone, offset } = data;
      // eslint-disable-next-line prefer-destructuring
      city = timezone.split('/')[1];
      drawGettingDataInHTML(timezone, temperature, offset);
      setCoordinates(lon, lat);
      getWeatherNextDay();
      getImage();
    });
  } else {
    throw new Error('You browser does not supported');
  }
}

getTemperatureGeolocation();

function setDataInHtml(name, temp, country, timezone) {
  temperatureDegree.textContent = temp.toFixed(0);
  place.textContent = `${name} / ${country}`;
  document.querySelector('.weather-today--degree').textContent = '°C';
  fahrenheitBtn.addEventListener('click', () => {
    temperatureDegree.textContent = convertCelsiusToFahrenheit(temp);
    document.querySelector('.weather-today--degree').textContent = '°F';
  });
  celsiusBtn.addEventListener('click', () => {
    temperatureDegree.textContent = temp.toFixed(0);
    document.querySelector('.weather-today--degree').textContent = '°C';
  });
  todayDate.textContent = getTime(timezone / 3600);
}

async function gettingWeather(e) {
  e.preventDefault();
  getImage();
  const apiWeatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  const response = await fetch(apiWeatherUrl);
  const json = await response.json();
  const {
    name, main, coord, timezone, sys,
  } = json;
  setCoordinates(coord.lon, coord.lat);
  setDataInHtml(name, main.temp, sys.country, timezone);
}

FORM.addEventListener('submit', (e) => gettingWeather(e));

FORM.addEventListener('submit', () => getWeatherNextDay());

FORM.addEventListener('submit', () => getImage());

window.onload = getImage();
let i;
console.log(i);
// eslint-disable-next-line no-undef
mapboxgl.accessToken = 'pk.eyJ1IjoiaW5uYXJla2VzaCIsImEiOiJjazQ1aHk1MTEwOHg4M2dxbzE5a3dqY3ZjIn0.8r5bwO9SWcGL4CYdwqsobA';
if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition((position) => {
    // eslint-disable-next-line no-undef
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v10',
      center: [position.coords.longitude, position.coords.latitude],
      zoom: 9,
    });
    // eslint-disable-next-line no-undef
    const geocoder = new MapboxGeocoder({
      // eslint-disable-next-line no-undef
      accessToken: mapboxgl.accessToken,
      // eslint-disable-next-line no-undef
      mapboxgl,
    });
    document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

    geocoder.on('result', (e) => {
      city = e.result.text;
    });
  });
}
