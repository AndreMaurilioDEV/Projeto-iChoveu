// Remova os comentários a medida que for implementando as funções
export const searchCities = async (term) => {
  const { VITE_TOKEN } = import.meta.env;
  const response = await fetch(`http://api.weatherapi.com/v1/search.json?lang=pt&key=${VITE_TOKEN}&q=${term}`);
  const data = await response.json();
  if (data.length === 0) {
    window.alert('Nenhuma cidade encontrada');
    return [];
  }
  return data;
};

export const getWeatherByCity = async (cityURL) => {
  let obj = {};
  const { VITE_TOKEN } = import.meta.env;
  const returnCities = await searchCities(cityURL);
  const url = returnCities.map((urlCity) => urlCity.url);
  const response = await fetch(`http://api.weatherapi.com/v1/current.json?lang=pt&key=${VITE_TOKEN}&q=${url}`);
  const data = await response.json();
  obj = {
    temp: data.current.temp_c,
    condition: data.current.condition.text,
    icon: data.current.condition.icon,
  };
  return obj;
};
