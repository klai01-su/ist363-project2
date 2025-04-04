const API_KEY = "3c542c16c19b5905f4be99f181599119";

// const options = {
//     method: 'GET',
//     headers: {
//       accept: 'application/json',
//       Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYzU0MmMxNmMxOWI1OTA1ZjRiZTk5ZjE4MTU5OTExOSIsIm5iZiI6MTc0MzU5NTY5OC4wMTYsInN1YiI6IjY3ZWQyOGIyZjVhZTcxNDM1ZGFhZjkxNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eFVfdA_5C03V-bLRSKepRJTPEDumJOvFqe5OWkt6WgU'
//     }
//   };
  
//   fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
//     .then(res => res.json())
//     .then(res => console.log(res))
//     .catch(err => console.error(err));

const BASE_URL = "https://api.themoviedb.org/3";
const POPULAR_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + "api_key=" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const SEARCH_URL = BASE_URL + "/search/movie?" + "api_key=" + API_KEY;

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

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagsEl = document.getElementById("tags");

const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastURL = "";
var totalPages = 100;

var selectedGenre = [];
setGenres();
function setGenres() {
    tagsEl.innerHTML = "";
    genres.forEach(genre => {
        const t = document.createElement("div");
        t.classList.add("tag");
        t.id = genre.id;
        t.innerText = genre.name;
        t.addEventListener("click", () => {
            if(selectedGenre.length == 0) {
                selectedGenre.push(genre.id);
            }else {
                if(selectedGenre.includes(genre.id)) {
                    selectedGenre.forEach((id, idx) => {
                        if(id == genre.id) {
                            selectedGenre.splice(idx, 1);
                        }
                    })
                }else {
                    selectedGenre.push(genre.id);
                }
            }
            getMovies(POPULAR_URL + '&with_genres='+ encodeURI(selectedGenre.join(",")));
            highlightselection();
        })    
        tagsEl.append(t);
    })
}

function highlightselection() {
    const tags = document.querySelectorAll(".tag");
    tags.forEach(tag => {
        tag.classList.remove("highlight");
    })
    clearBtn();
    if (selectedGenre.length != 0) {
        selectedGenre.forEach(id => {
            const highlightedTag = document.getElementById(id);
            highlightedTag.classList.add("highlight");
        })
    }
}

function clearBtn() {
    let clearBtn = document.getElementById("clear");
    if (clearBtn) {
        clearBtn.classList.add("highlight");
    }else {
        let clear = document.createElement("div");
        clear.classList.add("tag", "highlight");   
        clear.id = "clear";
        clear.innerText = "Clear All";
        clear.addEventListener("click", () => {
            selectedGenre = [];
            setGenres();
            getMovies(POPULAR_URL);
        })
        tagsEl.append(clear);

    }

    
}

getMovies(POPULAR_URL);


function getMovies(url) {
  lastURL = url;
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results);
        if (data.results.length !== 0) {
            showMovies(data.results);
            currentPage = data.page;
            nextPage = currentPage + 1;
            prevPage = currentPage - 1;
            totalPages = data.total_pages;

            current.innerText = currentPage;

            if (currentPage <= 1) {
              prev.classList.add("disabled");
              next.classList.remove("disabled");

            } else if (currentPage >= totalPages) {
              prev.classList.remove("disabled");
              next.classList.add("disabled");
                
            } else {
              prev.classList.remove("disabled");
              next.classList.remove("disabled");
            }

            window.scrollTo({ top: 0, behavior: "smooth" });

        } else {
            main.innerHTML = `<h1 class="no-results">No results Found</h1>`;
        }
    })
}

function showMovies(data) {
    main.innerHTML = "";

    data.forEach(movie => {
        const { title, release_date, poster_path, vote_average, overview, id } = movie;
        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");
        movieEl.innerHTML = `
            <img src="${poster_path? IMG_URL+poster_path: "images/movie_placeholder.png" }" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average.toFixed(1)}</span>
            </div>
            
            <div class="overview">
                <h3>${title} (${release_date.substring(0, 4)})</h3>
                ${overview}
                <br/>
                <div class="watch-trailer" id="${id}">Watch Trailer</div>
            </div>
        `
        main.appendChild(movieEl);

        document.getElementById(id).addEventListener("click", () => {
          console.log(id);
          openNav(movie);
        })
    })
}
const youtubeAPI = "AIzaSyA1pVKYV2RrItwywuZ9GQ4SK0E-J4JaVkU"

// "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=whiplash%20trailer&type=video&key="

const youtubeURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=video&key=" + youtubeAPI + "&q=";

const overlayContent = document.getElementById("overlay-content");

/*
function openNav(movie) {
  let title = movie.title;
  fetch(youtubeURL + title + "movie official trailer").then(res => res.json()).then(videoData => {
    console.log(videoData.items);
    if (videoData.items) {
      document.getElementById("myNav").style.width = "100%";
      if (videoData.items.length > 0) {
        var embed = [];
        videoData.items.forEach(video => {
          let {id.videoId, snippet.title} = video;
          embed.push(`
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${id.videoId}" title="${snippet.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            `);
        })
        overlayContent.innerHTML = embed.join("");
      } else {
        overlayContent.innerHTML = `<h1 class="no-results">No results Found</h1>`;
      }
    }
  })
}
*/

function openNav(movie) {
  const title = movie.title;
  const releaseDate = movie.release_date;
  const query = encodeURIComponent(title + releaseDate + " movie official trailer");
  
  fetch(`${youtubeURL}${query}`)
    .then(res => res.json())
    .then(videoData => {
      console.log(videoData.items);
      document.getElementById("myNav").style.width = "100%";
      const overlayContent = document.getElementById("overlay-content");

      if (videoData.items && videoData.items.length > 0) {
        const embed = videoData.items.map(video => {
          const videoId = video.id.videoId;
          const videoTitle = video.snippet.title;
          return `
            <iframe width="560" height="315" 
              src="https://www.youtube.com/embed/${videoId}" 
              title="${videoTitle}" frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
            </iframe>`;
        });
        overlayContent.innerHTML = embed.join("");
      } else {
        overlayContent.innerHTML = `<h1 class="no-results">No results Found</h1>`;
      }
    })
    .catch(err => {
      console.error("YouTube API error:", err);
      document.getElementById("overlay-content").innerHTML = `<h1 class="no-results">Error fetching trailer</h1>`;
    });
}


function closeNav() {
  document.getElementById("myNav").style.width = "0%";
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

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const searchTerm = search.value;
    selectedGenre = [];
    setGenres();
    if(searchTerm) {
        getMovies(SEARCH_URL + "&query=" + searchTerm);
    }
    else {
        getMovies(POPULAR_URL);
    }
})

prev.addEventListener("click", () => {
  if (prevPage > 0) {
    pageCall(prevPage);
  }
})

next.addEventListener("click", () => {
  if (nextPage <= totalPages) {
    pageCall(nextPage);
  }
})

function pageCall(page) {
  let urlSplit = lastURL.split("?");
  let queryParams = urlSplit[1].split("&");
  let key = queryParams[queryParams.length -1].split("=");
  if (key[0] != "page") {
    let url = lastURL + "&page=" + page;
    getMovies(url);
  } else {
    key[1] = page.toString();
    let a = key.join("=");
    queryParams[queryParams.length - 1] = a;
    let b = queryParams.join("&");
    let url = urlSplit[0] + "?" + b;
    getMovies(url);
  }
}