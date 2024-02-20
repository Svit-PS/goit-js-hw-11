import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  '42437386-75cc59f71a98a974a642ba63e';

const API_KEY = '42437386-75cc59f71a98a974a642ba63e';
const BASE_URL = 'https://pixabay.com/api/';
const searchParams = new URLSearchParams({
  key: '42437386-75cc59f71a98a974a642ba63e',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  min_width: 270,
  min_height: 226,
});

async function fetchPixabay(seachStr, page = 1, countImg = 8) {
  const arr = String(seachStr).split(' ');
  const str = arr.join('+');
  const str_Param = `?${searchParams.toString()}&q=${str}&page=${page}&per_page=${countImg}`;
  //   console.log(`${BASE_URL}${str_Param}`);
  const response = await fetch(`${BASE_URL}${str_Param}`);
  return response.json();
}

export { fetchPixabay };
