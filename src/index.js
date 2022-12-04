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

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
refs.input.focus();

const DEBOUNCE_DELAY = 300;

function onSearch(event) {
  event.preventDefault();
  searchQuery = event.target.value.toLowerCase().trim();

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
        errorManyCountries();
      } else {
        refs.countryList.insertAdjacentHTML(
          'beforeend',
          renderList(searchCountry)
        );
      }
    })
    .catch(error => {
      errorNoName();
      console.log(error);
    })
    .finally();
}

function renderList(searchCountries) {
  const countryList = searchCountries
    .map(country => {
      return `<li class="list-item">
   <img class="list-img" src="${country.flags.svg}" alt='${country.name}' width = 75px height = 50px>
   <h2 class="list-title">${country.name}</h2></li>`;
    })
    .join('');

  return countryList;
}

function renderInfo(searchCountries) {
  const countryInfo = searchCountries
    .map(country => {
      const languages = country.languages
        .map(language => {
          return language.name;
        })
        .join(', ');
      return `<ul class="country-info"><li><p class="list-text" ><b>Capital</b>: ${country.capital}</p></li>
    <li> <p class="list-text"><b>Population</b>: ${country.population}</p></li>
    <li><p class="list-text"><b>Languages</b>:&nbsp;${languages}</p></li></ul>`;
    })
    .join('');

  return countryInfo;
}

function errorManyCountries() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function errorNoName() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
