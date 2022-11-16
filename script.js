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
            <h3 class="Overview">Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
        </div>
        </div>
            <h3 id="Actors">Actors:</h3>
            <ul id="actors" class="list-unstyled"></ul>
    </div>
  <div class="all_actors">
  <div class="actors_pro">
  <img src="https://media.allure.com/photos/5a2ff4afdd0c5b5b96b21692/4:3/w_2220,h_1665,c_limit/GettyImages-884266074.jpg" class="img_actor">
  <h3 class="sia">sia</h3>
  </div>
  <div class="actors_pro">
  <img src="https://media.allure.com/photos/5a2ff4afdd0c5b5b96b21692/4:3/w_2220,h_1665,c_limit/GettyImages-884266074.jpg" class="img_actor">
  <h3 class="sia">sia</h3>
  </div>
  <div class="actors_pro">
  <img src="https://media.allure.com/photos/5a2ff4afdd0c5b5b96b21692/4:3/w_2220,h_1665,c_limit/GettyImages-884266074.jpg" class="img_actor">
  <h3 class="sia">sia</h3>
  </div>
  <div class="actors_pro">
  <img src="https://media.allure.com/photos/5a2ff4afdd0c5b5b96b21692/4:3/w_2220,h_1665,c_limit/GettyImages-884266074.jpg" class="img_actor">
  <h3 class="sia">sia</h3>
  </div>
  <div class="actors_pro">
  <img src="https://media.allure.com/photos/5a2ff4afdd0c5b5b96b21692/4:3/w_2220,h_1665,c_limit/GettyImages-884266074.jpg" class="img_actor">
  <h3 class="sia">sia</h3>
  </div>

  </div>
`;
};

// const autorun2 = async () => {
//   let url = undefined;
//   const urlArr = ["movie/top_rated", "movie/popular", "movie/upcoming"];
//   for (let i = 0; i < 3; i++) {
//     url = constructUrl(urlArr[i]);
//     fetch(url)
//       .then((res) => res.json())
//       .then((api) => testing(api.results));
//   }
// };

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



document.addEventListener("DOMContentLoaded", async () => {
  await autorun3();
  autorun()
  // autorun2()
  // autorun4()
  movieBranch();
  movieBranchV2();
  renderMoviesSortable(28)
});

async function movieBranch() {
  // const allButtonsDiv = document.createElement("div");
  // allButtonsDiv.className = "allButtons";
  let navGenre = document.getElementById(`navs`)
  
  genreIds.map((movie) => {
    //Secondary Buttonss
    let btn2 = document.createElement("button");
    let list = document.createElement("li")

    btn2.textContent = `${movie.name}`;
    btn2.type = "button";
    btn2.className = "button-78";
    btn2.value = `${movie.id}`;
  
    list.innerHTML=btn2.outerHTML
    navGenre.appendChild(list)

    list.addEventListener("click", () => {
      console.log("test")
      renderMoviesSortable(btn2.value);
    });

    //Main Buttons
    let btn = document.createElement("button");
    btn.textContent = `${movie.name}`;
    btn.type = "button";
    btn.className = "button-78";
    btn.value = `${movie.id}`;

  //   btn.addEventListener("click", () => {
  //     renderMoviesSortable(btn.value);
  //   });
  //   allButtonsDiv.appendChild(btn);
  });
  // BUTTON_CONTAINER.appendChild(allButtonsDiv);
}

const secondCardContainer = document.createElement("div");
secondCardContainer.className = "cardContainer2";
const renderMoviesSortable = async (genreID) => {
  let url = undefined
  let moviesChosen = [];
  
  if(genreID == 0) url = constructUrl("movie/top_rated")
  else if (genreID==1) url = constructUrl("movie/popular")
  else if (genreID==2) url = constructUrl("movie/upcoming")
  else  url = `${constructUrl("discover/movie")}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${genreID}&with_watch_monetization_types=flatrate`;
  

  const data = await fetch(url);
  moviesChosen = (await data.json()).results;

  console.log({ moviesChosen });
  const newDiv = document.createElement("div");
  newDiv.className = "moviesDiv"

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

function testing(objects){
  console.log(objects)
}
function movieBranchV2() {
  const allButtonsDiv = document.createElement("div");
  allButtonsDiv.className = "allButtons";

  const mainButtonsData = [{id:0 , name:"top_rated"},{id:1 , name:"Popular"},{id:2 , name:"Upcoming"}]
  
  mainButtonsData.map((movie) => {
    //Main Buttons
    let btn = document.createElement("button");
    btn.textContent = `${movie.name}`;
    btn.type = "button";
    btn.className = "button-78";
    btn.value = `${movie.id}`;

    btn.addEventListener("click", () => {
      renderMoviesSortable(btn.value);
    });
    allButtonsDiv.appendChild(btn);
  });
  BUTTON_CONTAINER.appendChild(allButtonsDiv);
}

