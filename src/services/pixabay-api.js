const KEY = '18962627-3cde470dd8252503102b1f7f8';
const BASE_URL = `https://pixabay.com/api/`;

async function fetchImages(searchQuery, page = 1) {
  const url = `${BASE_URL}?image_type=photo&orientation=horizontal&q=${searchQuery}&page=${page}&per_page=12&key=${KEY}`;

  return getData(url).then(response => {
    return response;
  });
}

async function getData(url) {
  const images = await fetch(url);
  const response = await images.json();
  return response;
}

const api = {
  fetchImages,
};

export default api;
