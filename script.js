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
// fetch one Actor information
const fetchActor = async (actorId) => {
  const url = constructUrl(`person/${actorId}`);
  const res = await fetch(url);

  return res.json();
};
const fetchTrailers = async(id) => {
  const url = constructUrl(`movie/${id}/videos`);
  const res = await fetch(url);
  return res.json();
};
// fetch actors movies
const fetchActorsMovies = async (actorId) => {
  const url = constructUrl(`person/${actorId}/movie_credits`);
  const res = await fetch(url);
  return res.json();
};

const fetchSimilarMovies = async (id)=> {
  const url =  constructUrl(`movie/${id}/similar`);
  const res = await fetch(url);
  return res.json()
}

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

// FOR HOME PAGE SLIDER
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
//FOR SINGLE MOVIE
const renderMovie = async (movie) => {
  const movieId = movie.id;
  //Movie Details
  const urlDetails = `${constructUrl(
    `/movie/${movieId}`
  )}&language=en-US&page=1`;
  const dataDetails = await fetch(urlDetails);
  const moviesDetails = await dataDetails.json();

  //Production Company 
  const productionCompany = moviesDetails.production_companies;
  console.log(productionCompany);

    //Actors
  const urlActors = `${constructUrl(
    `/movie/${movieId}/credits`
  )}&language=en-US&page=1`;
  const dataActors = await fetch(urlActors);
  const moviesActors = (await dataActors.json()).cast;
  let director = undefined;
  let singleMovieActors = [];
  for (let i = 0; moviesActors.length; i++) {
    if (moviesActors[i].known_for_department === "Acting")
      singleMovieActors.push(moviesActors[i]);
    // if(moviesActors[i].known_for_department ==="Directing") {
    //   director = moviesActors[i].name
    //   console.lof("test")
    //   break;}
    if (singleMovieActors.length === 5) break;
  }
  //For video  
  


  CONTAINER.innerHTML = `
  <div class="movie-card">
  
  <div class="containersmall">
    
      <img  "singleMoviePoster" src=${
        BACKDROP_BASE_URL + movie.poster_path
      } alt="cover" class="cover" /></a>

    <div class="hero" >

    <img class = "singleMovieImg" src=${
      BACKDROP_BASE_URL + movie.backdrop_path
    } alt="cover" class="cover" />


      <div class="details">
      
        <div class="title1">${movie.title} </div>  
        
        <span class="singleRating">${
          moviesDetails.vote_average
        } <i class="fa fa-star" aria-hidden="true"></i></span><span class="likes">${
    movie.vote_count
  } <i class="fa fa-heart" aria-hidden="true"></i></span><span class="languages">${
    moviesDetails.original_language
  } <i class="fa fa-globe" aria-hidden="true"></i></span>
        
      </div> <!-- end details -->
      
  </div> <!-- end hero -->
    
  <div class="description">
      
      <div class="column1">
        <span class="tag">    <img class="logos" src=${
          BACKDROP_BASE_URL + moviesDetails.production_companies[0].logo_path
        } alt="cover"  /></span>
      </div> <!-- end column1 -->
      
      <div class="column2">
        
        <p>${movie.overview} </p> 
      </div>`;

  //Actors
  const avatars = document.createElement("div");
  const avatarContainer = document.createElement("div")
  avatarContainer.className=`anything`;
  // const column2 = document.querySelector(".column2");
  avatars.className = "avatars";
  singleMovieActors.map((singleactor) => {
    const actorsInMovie = document.createElement("div");
    actorsInMovie.className = "actorsInMovie";
    actorsInMovie.innerHTML = `<img   src="${BACKDROP_BASE_URL + singleactor.profile_path}" alt="${singleactor.name}" class="actorsInMovieImg" >`;
        
    avatars.appendChild(actorsInMovie);
    const actorsInMovieImg = document.getElementsByClassName;
    actorsInMovie.addEventListener("click", async () => {
      const singleAcotrPage = await fetchActor(singleactor.id);
      const ActorMovies1 = await fetchActorsMovies(singleactor.id);
      CONTAINER.innerHTML = "";
    
      singleAcotr(singleAcotrPage);
      actormovies(ActorMovies1);
    });
  });
  avatarContainer.appendChild(avatars);
  CONTAINER.appendChild(avatarContainer) 

  //Trailer
  const movieTrailers = await fetchTrailers(movie.id);
  const trailer = document.createElement("div");
  trailer.id = "trailerdiv";

  const trailerKey = movieTrailers.results[0].key;
  const trailerDiv = document.getElementById("trailer");
  const trailerArea = document.createElement("div");
  trailerArea.className = "trailer";
  trailerArea.innerHTML = `<iframe class = "trailerinside" width="700" height="450" src="https://www.youtube.com/embed/${trailerKey}"></iframe>`;

  trailer.appendChild(trailerArea);
  CONTAINER.appendChild(trailer);

  //Similar Movies

  const similarmociesfetch = await fetchSimilarMovies(movie.id);
  const selectedMovies = similarmociesfetch.results.slice(0, 6);
  console.log(selectedMovies)

  // console.log(similarMovies)
  const similarMovieContainers = document.createElement("div");
  similarMovieContainers.className = "cardContainer7";
  const newDiv = document.createElement("div");
  newDiv.className = "moviesDiv";
  selectedMovies.map((movie) => {
    console.log(movie)
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
  similarMovieContainers.innerHTML = " ";
  similarMovieContainers.appendChild(newDiv);


  CONTAINER.appendChild(similarMovieContainers);
  


};


// MORE AUTORUN
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
  autorun();
  // autorun2()
  // autorun4()
  movieBranch();
  movieBranchV2();
  renderMoviesSortable(14);
});
//MAIN MOVIE BRANCH
async function movieBranch() {
  // const allButtonsDiv = document.createElement("div");
  // allButtonsDiv.className = "allButtons";
  let navGenre = document.getElementById(`navs`);

  genreIds.map((movie) => {
    //Secondary Buttonss
    let btn2 = document.createElement("button");
    let list = document.createElement("li");

    btn2.textContent = `${movie.name}`;
    btn2.type = "button";
    btn2.className = "button-78";
    btn2.value = `${movie.id}`;

    list.innerHTML = btn2.outerHTML;
    navGenre.appendChild(list);

    list.addEventListener("click", () => {
      console.log("test");
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
  let url = undefined;
  let moviesChosen = [];

  if (genreID == 0) url = constructUrl("movie/top_rated");
  else if (genreID == 1) url = constructUrl("movie/popular");
  else if (genreID == 2) url = constructUrl("movie/upcoming");
  else
    url = `${constructUrl(
      "discover/movie"
    )}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${genreID}&with_watch_monetization_types=flatrate`;

  const data = await fetch(url);
  moviesChosen = (await data.json()).results;

  console.log({ moviesChosen });
  const newDiv = document.createElement("div");
  newDiv.className = "moviesDiv";

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

function testing(objects) {
  console.log(objects);
}
// start form here
const actorBtn = document.querySelector(".Actor");
actorBtn.addEventListener("click", (e) => {
  CONTAINER.innerHTML = ``;

  const url = constructUrl(`person/popular`);
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      //console.log(data.results);
      const rowDiv = document.createElement("div");
      rowDiv.setAttribute("class", "rowcards");
      if (data.results) {
        data.results.map((actorBlock) => {
          if (actorBlock.known_for.length > 0) {
            const actorDiv = document.createElement("div");
            actorDiv.setAttribute("class", "cards");

            actorDiv.innerHTML = `
      <div class="innercard">
      <img src="${BACKDROP_BASE_URL + actorBlock.profile_path}" alt="${
              actorBlock.name
            } actor">
      <div class="card-body">
  
      <h3 class="card-title text-black">${actorBlock.name}</h3>
        <div class="mt-3 text-start">Gender: <b>${
          actorBlock.gender === 1 ? "Female" : "Male"
        }</b> </div>
        <div class="mt-3 text-start">Popularity: <b>${
          actorBlock.popularity
        }</b></div>
      </div>
    </div>`;
            actorDiv.addEventListener("click", async () => {
              const singleAcotrPage = await fetchActor(actorBlock.id);
              const ActorMovies1 = await fetchActorsMovies(actorBlock.id);
              CONTAINER.innerHTML = "";

              singleAcotr(singleAcotrPage);
              actormovies(ActorMovies1);
            });
            rowDiv.append(actorDiv);
            CONTAINER.appendChild(rowDiv);
          }
        });
      }
    });
});
function movieBranchV2() {
  const allButtonsDiv = document.createElement("div");
  allButtonsDiv.className = "allButtons";

  const mainButtonsData = [
    { id: 0, name: "Top Rated" },
    { id: 1, name: "Popular" },
    { id: 2, name: "Upcoming" },
  ];

  mainButtonsData.map((movie) => {
    //Main Buttons
    let btn = document.createElement("button");
    btn.textContent = `${movie.name}`;
    btn.type = "button";
    btn.className = "button-1";
    btn.value = `${movie.id}`;

    btn.addEventListener("click", () => {
      renderMoviesSortable(btn.value);
    });
    allButtonsDiv.appendChild(btn);
  });
  BUTTON_CONTAINER.appendChild(allButtonsDiv);
}
const singleAcotr = (acotr) => {
  const maindiv = document.createElement("div");
  maindiv.className = "card";

  const biography = document.createElement("div")
  biography.className =`Biography`
  biography.innerHTML = `<h1>${acotr.name}</h2>
  <p>Date of Birth:  ${acotr.birthday}</p>
  <p>${acotr.biography}</p>`

  const anotherdiv = document.createElement("div")
  anotherdiv.className =`upContainer`


  maindiv.innerHTML = `   <a href="#">
      <img class="img1" src="${
        BACKDROP_BASE_URL + acotr.profile_path
      }" alt="${acotr.name} poster">
      <div class="title">${acotr.name}</div>
      <div class="text">${acotr.birthday}</div>
      <a href="#"><div class="catagory">${acotr.gender === 1 ? "Female" : "Male"} <i class="fas fa-film"></i></div></a>
      <a href="#"><div class="views">${
        acotr.popularity
      } <i class="fa fa-star" aria-hidden="true"></i> </div></a>
    </a>`;


    anotherdiv.appendChild(maindiv);
    anotherdiv.appendChild(biography);
    CONTAINER.appendChild(anotherdiv)
};

const actormovies = (movies) => {
  
  const moviediv = document.createElement("div");
  movies.cast.map((movie) => {
    moviediv.setAttribute("class", "moviesactordiv");
    const Moviescard = document.createElement("div");
    Moviescard.setAttribute("class", "card");

    Moviescard.innerHTML = ` 
    <a href="#">
      <img class="img1" src="${BACKDROP_BASE_URL + movie.poster_path}" alt="${
      movie.title
    } poster">
      <div class="title">${movie.title}</div>
      <div class="text">${movie.overview}</div>
      <a href="#"><div class="catagory">${checkingGenreForSingleActor(
        movie.genre_ids
      )} <i class="fas fa-film"></i></div></a>
      <a href="#"><div class="views">${
        movie.vote_average
      } <i class="fa fa-star" aria-hidden="true"></i> </div></a>
    </a>`;
    moviediv.appendChild(Moviescard);
    Moviescard.addEventListener("click", () => {
      movieDetails(movie);
    });
    console.log(movie);
  });
  CONTAINER.appendChild(moviediv);
};

function checkingGenreForSingleActor(genreIdCalled) {
  let genre = undefined;
  genreIdCalled.forEach((id) => {
    console.log(id);
    for (let i = 0; genreIds.length; i++) {
      if (id === genreIds[i].id) {
        genre = genreIds[i].name;
        break;
      }
    }
  });
  return genre;
}

// srech function start from here
const API_KEY = `87b7a72219e91c516dfe252a080dfc25`;
async function get_movie_by_search(search_term) {
  const resp = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${search_term}`
  );
  const respData = await resp.json();
  return respData.results;
}

const forminput = document.getElementById("sreach");
forminput.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    const text = e.target.value;
    const moviesname = await get_movie_by_search(text);
    CONTAINER.innerHTML = "";

    sreachpage(moviesname);
  }
});

function sreachpage(moviess) {
  const sreachDivResult = document.createElement("div");

  sreachDivResult.setAttribute("class", "sreachDivResult");
  moviess.forEach((movie) => {
    console.log(movie.id);
    const SearchSingleMovie = document.createElement("div");
    SearchSingleMovie.setAttribute("class", "card");
    SearchSingleMovie.innerHTML = ` 
    
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

    sreachDivResult.appendChild(SearchSingleMovie);

    SearchSingleMovie.addEventListener("click", () => {
      movieDetails(movie);
    });
  });
  CONTAINER.appendChild(sreachDivResult);
}

// srech function end from here