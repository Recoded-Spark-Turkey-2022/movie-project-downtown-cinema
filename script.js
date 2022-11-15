"use strict";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");

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

const renderMovies = (movies) => {
  const carouselContinar = document.querySelector(".carouselContinar");
  const upperSection = document.querySelector(".upperSection");
  const carouselSlide = document.createElement("div");
  carouselSlide.className = "carouselSlide";
  let x = 0;
  movies.map((movie, i) => {
    const movieDiv = document.createElement("img");

    movieDiv.setAttribute("src", `${BACKDROP_BASE_URL + movie.backdrop_path}`);
    movieDiv.setAttribute("alt", `${movie.title} poster">`);

    movieDiv.setAttribute("class", "slideImag");
    movieDiv.setAttribute("id", `image${i + 1}`);
    x++;

    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });

    carouselSlide.appendChild(movieDiv);
  });

  carouselContinar.appendChild(carouselSlide);
  upperSection.appendChild(carouselContinar);

  const btnPrev = document.createElement("button");
  btnPrev.id = "btnPrev";
  const btnNext = document.createElement("button");
  btnNext.id = "btnNext";
  btnPrev.innerHTML = `&lt;`;
  btnNext.innerHTML = `&gt;`;
  carouselContinar.appendChild(btnPrev);
  carouselContinar.appendChild(btnNext);

  const carouselImage = document.querySelectorAll(".carouselSlide img");

  let counter = 0;
  const size = carouselImage[0].clientWidth;

  btnNext.addEventListener("click", () => {
    if (counter >= x - 1) return;
    carouselSlide.style.transition = "transform 0.4s ease-in-out";
    counter++;
    carouselSlide.style.transform = "translateX(" + -size * counter + "px)";
  });

  btnPrev.addEventListener("click", () => {
    if (counter <= 0) return;
    carouselSlide.style.transition = "transform 0.4s ease-in-out";
    counter--;
    carouselSlide.style.transform = "translateX(" + -size * counter + "px)";
  });
};

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

const autorun2 = async () =>{
  let url = undefined
  const urlArr = ["movie/top_rated","movie/popular","movie/upcoming"]
  for(let i=0;i<3;i++){
    url = constructUrl(urlArr[i]);
    fetch(url)
    .then((res) =>res.json())
    .then((api)=> renderHorizontalSection(api.results))
  }
}

let genreIds = []
const autorun3 =()=> {
  const url = `${constructUrl("genre/movie/list")}&language=en-US`;
  fetch(url)
  .then((res) =>res.json())
  .then((api)=> api.genres.forEach(element => {genreIds.push(element)} ))
}

function checkGenre (genreIdCalled){
  for(let i = 0; genreIds.length; i++ ){
    if(genreIdCalled[0]===genreIds[i].id) 
    return genreIds[i].name
  }
}

const autorun4 =()=> {
  const url = `${constructUrl("person/popular")}&language=en-US&page=1`;
  fetch(url)
  .then((res) =>res.json())
  .then((api)=> api.results.map((actors)=>console.log(actors.name)))
}


document.addEventListener("DOMContentLoaded", ()=>{
  autorun()
  autorun2()
  autorun3()
  autorun4()
});





