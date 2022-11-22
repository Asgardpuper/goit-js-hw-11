import Axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';

const defaultOptions = {
  API_KEY: '21459621-fc317cd07d31a3b6e25198c55',
  URL: 'https://pixabay.com/api/?',
  ELEMENTS_PER_PAGE: 40,
};

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryBox: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

class searchAPI {
  constructor({ API_KEY, URL, ELEMENTS_PER_PAGE }) {
    this.apiKey = API_KEY;
    this.url = URL;
    this.elementsPerPage = ELEMENTS_PER_PAGE;
  }
  async fetchImages(inputSearchData, pageNumber) {
    try {
      const response = await Axios.get(
        `${this.url}key=${this.apiKey}&q=${inputSearchData}&page=${pageNumber}&per_page=${this.elementsPerPage}`
      );
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}

const lightbox = new SimpleLightbox('.gallery');

const imageSearchApi = new searchAPI(defaultOptions);

refs.searchForm.addEventListener('submit', onFormSubmit);

//* get search request from user

function onFormSubmit(evt) {
  evt.preventDefault();
  const inputElData = evt.currentTarget.searchQuery.value;
  getImagesCollection(inputElData);
}

//* get images collection from pixabay

function getImagesCollection(inputElData, pageNumber = 1) {
  imageSearchApi
    .fetchImages(inputElData, pageNumber)
    .then(response => parseImagesCollection(response.data.hits));
}

//* parse images collection and get key and values which we need to display to the user

function parseImagesCollection(imagesCollectionResponse) {
  imagesCollectionResponse.map(elem => {
    const imageKeysList = {
      webformatURL: elem.webformatURL,
      largeImageURL: elem.largeImageURL,
      tags: elem.tags,
      likes: elem.likes,
      views: elem.views,
      comments: elem.comments,
      downloads: elem.downloads,
    };
    renderImagesCollection(imageKeysList);
  });
}

//* create html and render images on website

function renderImagesCollection(imageKeysList) {
  const photoCardHtml = `<div class="photo-card w-64">
    <a href="${imageKeysList.largeImageURL}"><img src="${imageKeysList.webformatURL}" alt="${imageKeysList.tags}" loading="lazy"  /></a>
    <div class="info">
      <p class="info-item">
        <b>Likes ${imageKeysList.likes}</b>
      </p>
      <p class="info-item">
        <b>Views ${imageKeysList.views}</b>
      </p>
      <p class="info-item">
        <b>Comments ${imageKeysList.comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads ${imageKeysList.downloads}</b>
      </p>
    </div>
  </div>`;

  refs.galleryBox.insertAdjacentHTML('beforeend', photoCardHtml);
}
