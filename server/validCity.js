async function validCity(city) {
    const fetch = await import('node-fetch');
    const apiKey = '2b915a4b291f45a59554ceeab0ca67a3';
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${apiKey}`);
    const data = await response.json();
    if (data.total_results > 0 && data.results[0].components.city) {
      return true;
    } else {
      return false;
    }
  }
  
  module.exports = validCity;