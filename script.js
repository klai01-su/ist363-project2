const API_KEY = "3c542c16c19b5905f4be99f181599119";
const BASE_URL = "https://api.themoviedb.org/3";
const POPULAR_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const SEARCH_URL = `${BASE_URL}/search/movie?api_key=${API_KEY}`;
const YOUTUBE_API_KEY = "AIzaSyA1pVKYV2RrItwywuZ9GQ4SK0E-J4JaVkU";
const YOUTUBE_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&key=${YOUTUBE_API_KEY}&q=`;

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagsEl = document.getElementById("tags");

const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");

const genres = [
      {
          "id": 28,
          "name": "Action"
        },
        {
          "id": 12,
          "name": "Adventure"
        },
        {
          "id": 16,
          "name": "Animation"
        },
        {
          "id": 35,
          "name": "Comedy"
        },
        {
          "id": 80,
          "name": "Crime"
        },
        {
          "id": 99,
          "name": "Documentary"
        },
        {
          "id": 18,
          "name": "Drama"
        },
        {
          "id": 10751,
          "name": "Family"
        },
        {
          "id": 14,
          "name": "Fantasy"
        },
        {
          "id": 36,
          "name": "History"
        },
        {
          "id": 27,
          "name": "Horror"
        },
        {
          "id": 10402,
          "name": "Music"
        },
        {
          "id": 9648,
          "name": "Mystery"
        },
        {
          "id": 10749,
          "name": "Romance"
        },
        {
          "id": 878,
          "name": "Science Fiction"
        },
        {
          "id": 10770,
          "name": "TV Movie"
        },
        {
          "id": 53,
          "name": "Thriller"
        },
        {
          "id": 10752,
          "name": "War"
        },
        {
          "id": 37,
          "name": "Western"
        }
      ]

let currentPage = 1;
let nextPage = 2;
let prevPage = 3;
let lastURL = "";
let totalPages = 100;

let selectedGenre = [];

setGenres();


async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}


async function getMovies(url) {
    lastURL = url;
    const data = await fetchData(url);

    if (data && data.results.length !== 0) {
        showMovies(data.results);
        currentPage = data.page;
        nextPage = currentPage + 1;
        prevPage = currentPage - 1;
        totalPages = data.total_pages;
        current.innerText = currentPage;

        prev.classList.toggle("disabled", currentPage <= 1);
        next.classList.toggle("disabled", currentPage >= totalPages);
        window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
        main.innerHTML = `<h1 class="no-results">No results Found</h1>`;
    }
}

async function getYouTubeTrailer(movie) {
    const query = encodeURIComponent(`${movie.title} ${movie.release_date.substring(0, 4)} trailer`);
    const data = await fetchData(`${YOUTUBE_URL}${query}`);

    if (data && data.items && data.items.length > 0) {
        return data.items[0].id.videoId;
    } else {
        return null;
    }
}

async function openNav(movie) {
    document.getElementById("myNav").style.width = "100%";
    const overlayContent = document.getElementById("overlay-content");

    const videoId = await getYouTubeTrailer(movie);
    if (videoId) {
        overlayContent.innerHTML = `
            <iframe width="560" height="315" 
                src="https://www.youtube.com/embed/${videoId}" 
                title="Movie Trailer" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
            </iframe>`;
    } else {
        overlayContent.innerHTML = `<h1 class="no-results">No trailer found</h1>`;
    }
}

function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}


function showMovies(data) {
    main.innerHTML = "";
    data.forEach(movie => {
        const { title, release_date, poster_path, vote_average, overview, id } = movie;
        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");

        movieEl.innerHTML = `
            <img src="${poster_path ? IMG_URL + poster_path : "images/movie_placeholder.png"}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average.toFixed(1)}</span>
            </div>
            <div class="overview">
                <h3>${title} (${release_date.substring(0, 4)})</h3>
                ${overview}
                <br/>
                <div class="watch-trailer" id="trailer-${id}">Watch Trailer</div>
            </div>
        `;

        main.appendChild(movieEl);
        document.getElementById(`trailer-${id}`).addEventListener("click", () => openNav(movie));
    });
}


function setGenres() {
    tagsEl.innerHTML = "";
    genres.forEach(genre => {
        const tag = document.createElement("div");
        tag.classList.add("tag");
        tag.id = genre.id;
        tag.innerText = genre.name;

        tag.addEventListener("click", () => {
            if (selectedGenre.includes(genre.id)) {
                selectedGenre = selectedGenre.filter(id => id !== genre.id);
            } else {
                selectedGenre.push(genre.id);
            }
            getMovies(`${POPULAR_URL}&with_genres=${encodeURI(selectedGenre.join(","))}`);
            highlightSelection();
        });

        tagsEl.append(tag);
    });
}


function highlightSelection() {
    document.querySelectorAll(".tag").forEach(tag => tag.classList.remove("highlight"));
    selectedGenre.forEach(id => document.getElementById(id).classList.add("highlight"));
    clearBtn();
    
}

function clearBtn() {
    let clear = document.getElementById("clear");

    if (!clear) {
        clear = document.createElement("div");
        clear.classList.add("tag", "highlight");   
        clear.id = "clear";
        clear.innerText = "Clear All";

        clear.addEventListener("click", () => {
            selectedGenre = [];
            setGenres();
            getMovies(POPULAR_URL);
        });

        tagsEl.append(clear);
    } else {
        clear.classList.add("highlight");
    }
}


form.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = search.value;
    selectedGenre = [];
    setGenres();
    getMovies(searchTerm ? `${SEARCH_URL}&query=${searchTerm}` : POPULAR_URL);
});


prev.addEventListener("click", () => !prev.classList.contains("disabled") && pageCall(prevPage));
next.addEventListener("click", () => !next.classList.contains("disabled") && pageCall(nextPage));

function pageCall(page) {
    const url = new URL(lastURL);
    url.searchParams.set("page", page);
    getMovies(url.toString());
}


const menuToggle = document.getElementById("menu-toggle");
const searchToggle = document.getElementById("search-toggle");
const navbar = document.getElementById("navbar");
const searchForm = document.querySelector(".search-form");

menuToggle.addEventListener("click", () => {
    navbar.classList.toggle("show");
    searchForm.classList.remove("show");
});

searchToggle.addEventListener("click", () => {
    searchForm.classList.toggle("show");
    navbar.classList.remove("show");
});


getMovies(POPULAR_URL);


function getColor(vote) {
    if(vote >= 8) {
        return "green";
    } else if(vote >= 5) {
        return "orange";
    } else {
        return "red";
    }
}
