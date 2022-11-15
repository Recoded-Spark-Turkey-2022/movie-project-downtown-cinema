"use strict";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");
const BUTTON_CONTAINER = document.querySelector("#buttons-container");

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  renderMovie(movieRes);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const cardContainer = document.createElement("div");
cardContainer.className = "cardContainer";
const renderMovies = (movies) => {
  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.className = "card";
    movieDiv.innerHTML = ` 
        <img class="img1" src="${BACKDROP_BASE_URL + movie.poster_path}" alt="${
      movie.title
    } poster">
        <div class="title">${movie.title}</div>
        <div class="text">${movie.overview}</div>
        <div class="catagory">${checkGenre(
          movie.genre_ids
        )} <i class="fas fa-film"></i></div>
        <div class="views">${
          movie.vote_average
        } <i class="fa fa-star" aria-hidden="true"></i> </div>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    cardContainer.appendChild(movieDiv);
  });
};
CONTAINER.appendChild(cardContainer);

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie) => {
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + movie.backdrop_path
             }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
              movie.release_date
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
        </div>
        </div>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled"></ul>
    </div>`;
};

const autorun2 = async () => {
  let url = undefined;
  const urlArr = ["movie/top_rated", "movie/popular", "movie/upcoming"];
  for (let i = 0; i < 3; i++) {
    url = constructUrl(urlArr[i]);
    fetch(url)
      .then((res) => res.json())
      .then((api) => renderHorizontalSection(api.results));
  }
};

let genreIds = [];
const autorun3 = async () => {
  const url = `${constructUrl("genre/movie/list")}&language=en-US`;
  await fetch(url)
    .then((res) => res.json())
    .then((api) =>
      api.genres.forEach((element) => {
        genreIds.push(element);
      })
    );
};

function checkGenre(genreIdCalled) {
  for (let i = 0; genreIds.length; i++) {
    if (genreIdCalled[0] === genreIds[i].id) return genreIds[i].name;
  }
}

function checkGenreV2(genreIdCalled) {
  for (let i = 0; genreIds.length; i++) {
    if (genreIdCalled === genreIds[i].id) return genreIds[i].name;
  }
}

const autorun4 = () => {
  const url = `${constructUrl("person/popular")}&language=en-US&page=1`;
  fetch(url)
    .then((res) => res.json())
    .then((api) => api.results.map((actors) => console.log(actors.name)));
};

const scroller = document.createElement("div");
scroller.className = "myScroll";
CONTAINER.appendChild(scroller);
const renderHorizontalSection = (movies) => {
  const homeMidContainer = document.createElement("div");
  homeMidContainer.className = "homeMidContainer";
  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.className = "movie";

    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
        <h3>Rat${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    homeMidContainer.appendChild(movieDiv);
  });
  scroller.appendChild(homeMidContainer);
};
CONTAINER.appendChild(scroller);

document.addEventListener("DOMContentLoaded", async () => {
  await autorun3();
  // autorun()
  // autorun2()
  // autorun4()
  movieBranch();
  renderMoviesSortable(28)
});

async function movieBranch() {
  const allButtonsDiv = document.createElement("div");
  allButtonsDiv.className = "allButtons";
  // CONTAINER.textContent= ``
  genreIds.map((movie) => {
    let btn = document.createElement("button");
    btn.textContent = `${movie.name}`;
    btn.type = "button";
    btn.className = "button-78";
    btn.value = `${movie.id}`;
    console.log(btn);
    btn.addEventListener("click", () => {
      renderMoviesSortable(btn.value);
    });
    allButtonsDiv.appendChild(btn);
  });
  BUTTON_CONTAINER.appendChild(allButtonsDiv);
}

const secondCardContainer = document.createElement("div");
secondCardContainer.className = "cardContainer2";
const renderMoviesSortable = async (genreID) => {
  let moviesChosen = [];
  const url = `${constructUrl(
    "discover/movie"
  )}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${genreID}&with_watch_monetization_types=flatrate`;
  const data = await fetch(url);
  moviesChosen = (await data.json()).results;

  console.log({ moviesChosen });
  const newDiv = document.createElement("div");

  moviesChosen.map((movie) => {
    // checkGenre(movie.genre_ids)
    const movieDiv = document.createElement("div");
    movieDiv.className = "card";

    movieDiv.innerHTML = ` 
        <a href="#">
          <img class="img1" src="${
            BACKDROP_BASE_URL + movie.poster_path
          }" alt="${movie.title} poster">
          <div class="title">${movie.title}</div>
          <div class="text">${movie.overview}</div>
          <a href="#"><div class="catagory">${checkGenre(
            movie.genre_ids
          )} <i class="fas fa-film"></i></div></a>
          <a href="#"><div class="views">${
            movie.vote_average
          } <i class="fa fa-star" aria-hidden="true"></i> </div></a>
        </a>`;

    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    newDiv.appendChild(movieDiv);
    newDiv.setAttribute("children", newDiv.childElementCount);
  });
  secondCardContainer.innerHTML = " ";
  secondCardContainer.appendChild(newDiv);

  // CONTAINER.innerHTML = "";
  CONTAINER.appendChild(secondCardContainer);
  // renderMoviesSortable(28);
};

// const secondCardContainer = document.createElement("div")
// secondCardContainer.className="cardContainer2"
// let moviesChosen = []
// const renderMoviesSortable = async (genreID) => {
//   const url = `${constructUrl("discover/movie")}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${genreID}&with_watch_monetization_types=flatrate`;
//   await fetch(url)
//   .then((res) =>res.json())
//   .then((api)=> api.results.forEach(element =>{ moviesChosen.push(element)}))

//   moviesChosen.map((movie) => {
//     // checkGenre(movie.genre_ids)
//     const movieDiv = document.createElement("div");
//     movieDiv.className = "card"

//     const imgTag = document.createElement("img")
//     imgTag.className = "img1"
//     imgTag.src = `${BACKDROP_BASE_URL + movie.poster_path}`

//     const titleDiv = document.createElement("div")
//     titleDiv.className = "title"
//     titleDiv.textContent = `${movie.title}`

//     const textDiv = document.createElement("div")
//     textDiv.className = "text"
//     textDiv.textContent = `${movie.overview}`

//     const categoryDiv = document.createElement("div")
//     categoryDiv.className = "catagory"
//     categoryDiv.textContent=`${checkGenre(movie.genre_ids)}`

//     const viewsDiv = document.createElement("div")
//     viewsDiv.className = "views"
//     viewsDiv.textContent = `${movie.vote_average}`

//     // movieDiv.append(imgTag,titleDiv,textDiv,categoryDiv,viewsDiv)
//     movieDiv.appendChild(imgTag)
//     movieDiv.appendChild(titleDiv)
//     movieDiv.appendChild(textDiv)
//     movieDiv.appendChild(categoryDiv)
//     movieDiv.appendChild(viewsDiv)

//     // movieDiv.innerHTML =`
//     //   <a href="#">
//     //     <img class="img1" src="${BACKDROP_BASE_URL + movie.poster_path}" alt="${movie.title} poster">
//     //     <div class="title">${movie.title}</div>
//     //     <div class="text">${movie.overview}</div>
//     //     <a href="#"><div class="catagory">${checkGenre(movie.genre_ids)} <i class="fas fa-film"></i></div></a>
//     //     <a href="#"><div class="views">${movie.vote_average} <i class="fa fa-star" aria-hidden="true"></i> </div></a>
//     //   </a>`;

//     console.log(movie)

//     movieDiv.addEventListener("click", () => {
//       movieDetails(movie);
//     });
//     secondCardContainer.appendChild(movieDiv);
//   });
// };
