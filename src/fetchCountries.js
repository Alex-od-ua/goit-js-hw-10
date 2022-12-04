export { fetchCountries };

function fetchCountries(searchCountry) {
  const url = `https://restcountries.com/v2/name/${searchCountry}?fields=name,capital,population,flags,languages`;

  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
