// Remova os comentários a medida que for implementando as funções
export const searchCities = async (term) => {
  const TOKEN = import.meta.env.VITE_TOKEN;
  const URL = `http://api.weatherapi.com/v1/search.json?lang=pt&key=${TOKEN}&q=${term}`;
  const response = await fetch(URL);
  const data = await response.json();
  const arrayData= [];
  if(data.length === 0){
    window.alert('Nenhuma cidade encontrada')
  }
  const mapData = data.map((city) => {
    const objData = {
      id: city.id,
      name: city.name,
      region: city.region,
      country: city.country,
      lat: city.lat,
      lon: city.lon,
      url: city.url,
    };
    arrayData.push(objData);
  })
  return arrayData;
};

export const getWeatherByCity = async (cityURL) => {
  let obj = {};
  const TOKEN = import.meta.env.VITE_TOKEN;
  const returnCities = await searchCities(cityURL);
  const urls = returnCities.map((urlCity) => urlCity.url);
  for (const url of urls) {
  const response = await fetch(`http://api.weatherapi.com/v1/current.json?lang=pt&key=${TOKEN}&q=${url}`);
  const data = await response.json();
  obj = {
    temp: data.current.temp_c,
    condition: data.current.condition.text,
    icon: data.current.condition.icon,
  };
}
  return obj;
};
