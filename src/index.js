import { fetchPixabay } from './js/pixabay';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

const refs = {
  form_search: document.querySelector('#search-form'),
  boxImg: document.querySelector('.photo-list'),
  endBlock: document.querySelector('.end-block'),
};

const COUNT_IMG = 20;
let lightbox = null;
let currentPage = 1;
let options = {
  root: null,
  rootMargin: '200px',
  threshold: 1.0,
};
let observer = new IntersectionObserver(onScroll, options);

const { height: cardHeight } = document
  .querySelector('.container')
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: 'smooth',
});

refs.form_search.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();
  refs.boxImg.innerHTML = '';
  refs.endBlock.classList.add('is-hidden');
  currentPage = 1;
  loadImg();
  observer.observe(refs.endBlock);
}

async function loadImg() {
  const searchValue = refs.form_search.searchQuery.value;

  try {
    const photos = await fetchPixabay(searchValue, currentPage, COUNT_IMG);

    if (!photos.hits.length) {
      throw new Error();
    }

    if (currentPage == 1 && searchValue.length !== 0) {
      Notiflix.Notify.init({
        useIcon: false,
        info: {
          textColor: '#212121',
          background: 'coral',
        },
      });
      Notiflix.Notify.info(`Hooray! We found ${photos.totalHits} images.`);
    }

    const arrImg = [];
    for (const img of photos.hits) {
      const {
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = img;

      arrImg.push({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      });
    }

    createBoxImg(arrImg);

    if (currentPage * COUNT_IMG >= Number(photos.totalHits)) {
      observer.unobserve(refs.endBlock);
      refs.endBlock.classList.remove('is-hidden');
    }

    currentPage += 1;
  } catch (error) {
    console.log(error);
    Notiflix.Notify.init({
      fontSize: '15px',
    });
    Notiflix.Report.info(
      'Oops!',
      'Sorry, there are no images matching your search query. Please try again.',
      'Sorry',
      {
        width: '360px',
        svgSize: '100px',
      }
    );
    refs.form_search.reset();
  }
}

function createBoxImg(arr) {
  const arrToStr = arr
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<li class="photo-item">
          <div class="photo-card">
            <a class="gallery__link" href="${largeImageURL}" onclick="return false;">
              <img class="img-box" src="${webformatURL}" alt="${tags}" loading="lazy" width="270" height="200"> 
              <div class="info">
                <p class="info-item">
                  <b>Likes</b>
                  <b>${likes}</b>
                </p>
                <p class="info-item">
                  <b>Views</b>
                  <b>${views}</b>
                </p>
                <p class="info-item">
                  <b>Comments</b>
                  <b>${comments}</b>
                </p>
                <p class="info-item">
                  <b>Downloads</b>
                  <b>${downloads}</b>
                </p>
              </div>
            </a> 
         </div>
        </li>`;
      }
    )
    .join('');

  refs.boxImg.insertAdjacentHTML('beforeend', arrToStr);

  lightbox = new SimpleLightbox('.gallery__link', {
    captionsData: 'alt',
    captionDelay: 250,
    captionPosition: 'bottom',
    captionClass: 'captionPosition',
  });
}

function onScroll(entries, observer) {
  entries.forEach(entery => {
    if (entery.isIntersecting && currentPage !== 1) {
      loadImg();
    }
  });
}
