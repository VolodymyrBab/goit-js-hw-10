import debounce from 'lodash.debounce';
import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
import getRefs from './get_refs';

const refs = getRefs();
const DEBOUNCE_DELAY = 300;


// ....додаєм слухача подій на іnput та debounce
refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

// ....функція для ввода в іnput
function onInput(evt) {
    evt.preventDefault();
    const name = evt.target.value.trim();
    if (!name) {
      clearMarkup();
      return;
    };
  
    fetchCountries(name).then(countryArray => {
      if (countryArray.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      } else if (countryArray.length > 1 && countryArray.length <= 10) {
        clearMarkup();
        renderCountryList(countryArray);
        return;
      } else if (countryArray.length === 1) {
        clearMarkup();
        renderCountryInfo(countryArray);
        return;
      }
    }).catch(error => onError(error))
  };
  
// .....функція створення списку країн відповідаючих запиту

function renderCountryList(countryArray) {
    const markupCountryList = countryArray.map(country => {
      return `
      <li class="country__item">
        <img
          src="${country.flags.svg}"
          alt="flags of ${country.flags.official}"
          class="country-flags"
          width="70px"
          height="44px"
        />
        <p class="country-name">${country.name.official}</p>
      </li>`
    }).join('');
  
    refs.countryList.insertAdjacentHTML('beforeend', markupCountryList);
  };
  

//   .....функція створююча розмітку для унікальної країни

function renderCountryInfo(countryArray) {
    refs.countryInfo.classList.add('style');
    const markupCountryInfo = countryArray.map(({ name, flags, capital, languages, population }) => {
      let lang = ''
      for (let key in languages) {
        lang = languages[key];
      };
      return `<div class="country">
    <img
      src="${flags.svg}"
      alt="flags of ${name.official}"
      class="country__flags"
      width="70px"
      height="44px"
    />
    <p class="country__name">${name.official}</p>
  </div>
  <ul class="description">
    <li>
      <span class="description__title">Capital:</span>
      <p class="description__info">${capital}</p>
    </li>
    <li>
      <span class="description__title">Languages:</span>
      <p class="description__info">${lang}</p>
    </li>
    <li>
      <span class="description__title">Population:</span>
      <p class="description__info">${population}</p>
    </li>
  </ul>`
    }).join('');
  
    refs.countryInfo.insertAdjacentHTML('beforeend', markupCountryInfo);
  };
  

// .....функція очищення
function clearMarkup() {
    refs.countryInfo.classList.remove('style');
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
  }

//   .....функція на помилку

function onError(error) {
    clearMarkup();
    console.log(error);
    Notiflix.Notify.failure('Oops, there is no country with that name');
}

