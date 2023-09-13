export const searchCities = async (term) => {
  const TOKEN = import.meta.env.VITE_TOKEN;
  const TERMO_DE_BUSCA = term;
  const response = await fetch(`http://api.weatherapi.com/v1/search.json?lang=pt&key=${TOKEN}&q=${TERMO_DE_BUSCA}`);
  const data = await response.json();
  if (data.length === 0) {
    window.alert('Nenhuma cidade encontrada');
  }
  return data;
};

export const getWeatherByCity = async (cityURL) => {
  const TOKEN = import.meta.env.VITE_TOKEN;
  const response = await fetch(`http://api.weatherapi.com/v1/current.json?lang=pt&key=${TOKEN}&q=${cityURL}`);
  const data = await response.json();
  const citiesData = await searchCities(cityURL);
  const urlCity = citiesData.map(({ url }) => url);
  const obj = {
    name: data.location.name,
    country: data.location.country,
    temp: data.current.temp_c,
    condition: data.current.condition.text,
    icon: data.current.condition.icon,
    url: urlCity,
  };
  return obj;
};
