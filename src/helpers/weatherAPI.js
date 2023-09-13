// Remova os comentários a medida que for implementando as funções
export const searchCities = async (term) => {
  const TOKEN = import.meta.env.VITE_TOKEN;
  const TERMO_DE_BUSCA = term;
  const URL = `http://api.weatherapi.com/v1/search.json?lang=pt&key=${TOKEN}&q=${TERMO_DE_BUSCA}`;
  const response = await fetch(URL);
  const data = await response.json();
  if(data.length === 0){
    window.alert('Nenhuma cidade encontrada')
  }
  return data;
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
