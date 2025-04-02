const API_KEY = "3c542c16c19b5905f4be99f181599119";


const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYzU0MmMxNmMxOWI1OTA1ZjRiZTk5ZjE4MTU5OTExOSIsIm5iZiI6MTc0MzU5NTY5OC4wMTYsInN1YiI6IjY3ZWQyOGIyZjVhZTcxNDM1ZGFhZjkxNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eFVfdA_5C03V-bLRSKepRJTPEDumJOvFqe5OWkt6WgU'
    }
  };
  
  fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.error(err));

const BASE_URL = "https://api.themoviedb.org/3/movie";
const API_URL = BASE_URL + "/popular" + "?api_key=" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const main = document.getElementById("main");

getMovies(API_URL);

function getMovies(url) {
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results);
        showMovies(data.results);
    })
}

function showMovies(data) {
    main.innerHTML = "";

    data.forEach(movie => {
        const { title, poster_path, vote_average, overview } = movie;
        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");
        movieEl.innerHTML = `
            <img src="${IMG_URL+poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
            </div>
        `
        main.appendChild(movieEl);
    })
}

function getColor(vote) {
    if(vote >= 8) {
        return "green";
    } else if(vote >= 5) {
        return "orange";
    } else {
        return "red";
    }
}
