import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import './css/styles.css';

const refs = {
  body: document.querySelector('body'),
  input: document.querySelector('input'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
refs.input.focus();

function onSearch(event) {
  event.preventDefault();
  const searchQuery = event.target.value.toLowerCase().trim();

  if (searchQuery === '') {
    return (refs.countryInfo.innerHTML = ''), (refs.countryList.innerHTML = '');
  }
  fetchCountry(searchQuery);
}

function fetchCountry(searchCountry) {
  fetchCountries(searchCountry)
    .then(searchCountry => {
      refs.countryInfo.innerHTML = '';
      refs.countryList.innerHTML = '';

      if (searchCountry.length === 1) {
        refs.countryList.insertAdjacentHTML(
          'beforeend',
          renderList(searchCountry)
        );
        refs.countryInfo.insertAdjacentHTML(
          'beforeend',
          renderInfo(searchCountry)
        );
      } else if (searchCountry.length >= 10) {
        errorTooManyMatches();
      } else {
        refs.countryList.insertAdjacentHTML(
          'beforeend',
          renderList(searchCountry)
        );
      }
    })
    .catch(error => {
      errorNoCountryFound();
      console.log(error);
    });
}

function renderList(searchCountries) {
  return searchCountries
    .map(({ flags, name }) => {
      return `<li class="list-item">
   <img class="list-img" src="${flags.svg}" alt='${name}' width = 75px height = 50px>
   <h2 class="list-title">${name}</h2></li>`;
    })
    .join('');
}

function renderInfo(searchCountries) {
  return searchCountries
    .map(({ capital, population, languages }) => {
      const name = languages.map(({ name }) => name).join(', ');
      return `<ul class="country-info"><li><p class="list-text" ><b>Capital</b>: ${capital}</p></li>
    <li> <p class="list-text"><b>Population</b>: ${population}</p></li>
    <li><p class="list-text"><b>Languages</b>:&nbsp;${name}</p></li></ul>`;
    })
    .join('');
}

function errorTooManyMatches() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function errorNoCountryFound() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
