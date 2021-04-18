const app = {
  userSearch: "",
  currentFilm: {},
  resultsSection: document.getElementsByClassName("results-section")[0],
  currentPage: 1,
  /** Actions au démarrage de l'app */
  init: function () {
    console.log("Bienvenue, un cookie avec votre popcorn?");

    // Elements à écouter
    const submitButton = document.getElementsByClassName("submit")[0];
    const userInput = document.getElementById("userInput");
    // Ecouteurs
    submitButton.addEventListener("click", app.handleClickOnSubmitButton);
    userInput.addEventListener("keyup", app.handleUserInput);

    const placeholder = app.generateDOMELement(
      "img",
      ["search-placeholder"],
      "./assets/img/popcorn.png"
    );
    app.resultsSection.append(placeholder);
  },
  /** Utilitaires */
  generateDOMELement: function (balise, classes, content = "", alt = "") {
    const element = document.createElement(balise);
    element.classList.add(...classes);
    if (balise === "img") {
      if (content === "N/A") {
        element.src = "./assets/img/popcorn.png";
      } else {
        element.src = content;
      }

      element.alt = alt;
    } else {
      element.innerText = content;
    }
    return element;
  },
  /** Transformation de la section résultats */
  cleanResultSection: function () {
    const placeholder = document.getElementsByClassName("search-placeholder");
    const previousMovie = document.getElementsByClassName("displayed-movies");
    const errorSection = document.getElementsByClassName("error-section");
    if (placeholder.length !== 0) {
      app.resultsSection.removeChild(placeholder[0]);
    }
    if (previousMovie.length !== 0) {
      app.resultsSection.removeChild(previousMovie[0]);
    }
    if (errorSection.length !== 0) {
      app.resultsSection.removeChild(errorSection[0]);
    }
  },
  generateResponseContainer: function (responseLength) {
    app.cleanResultSection();
    // Récupère le nombre de résultats renvoyés
    let containerTitle = "";
    if (responseLength === 1) {
      containerTitle = `Votre recherche a renvoyé ${responseLength} réponse`;
    } else {
      containerTitle = `Votre recherche a renvoyé ${responseLength} réponses`;
    }

    const title = app.generateDOMELement(
      "p",
      ["research-title", "is-6"],
      containerTitle
    );

    const researchContainer = app.generateDOMELement(
      "div",
      ["displayed-movies"],
      ""
    );
    researchContainer.appendChild(title);
    app.resultsSection.append(researchContainer);
  },
  generateMovieCard: function (movie) {
    let researchContainer = document.getElementsByClassName(
      "displayed-movies"
    )[0];
    if (researchContainer === undefined) {
      app.generateError();
    }

    const movieCard = app.generateDOMELement("div", ["card"], "");

    // Movie image container
    const moviePictureContainer = app.generateDOMELement("div", ["card-image"]);
    const moviePictureWrapper = app.generateDOMELement("figure", [
      "image",
      "is-3by4"
    ]);
    const movieImage = app.generateDOMELement(
      "img",
      [],
      movie.Poster,
      movie.Title
    );

    moviePictureWrapper.appendChild(movieImage);
    moviePictureContainer.appendChild(moviePictureWrapper);

    // Movie content container
    const movieContentContainer = app.generateDOMELement("div", [
      "card-content"
    ]);
    const movieInfoWrapper = app.generateDOMELement("div", ["media-content"]);

    const movieTitle = app.generateDOMELement(
      "p",
      ["title", "is-6"],
      movie.Title
    );
    const movieYear = app.generateDOMELement(
      "p",
      ["subtitle", "is-6"],
      movie.Year
    );

    movieInfoWrapper.append(movieTitle, movieYear);
    movieContentContainer.appendChild(movieInfoWrapper);

    // Final gathering
    movieCard.append(moviePictureContainer, movieContentContainer);
    researchContainer.append(movieCard);
    app.resultsSection.append(researchContainer);
  },
  generateError: function () {
    app.cleanResultSection();
    const errorContainer = app.generateDOMELement("div", ["error-section"]);
    const errorTitle = app.generateDOMELement(
      "p",
      ["title", "is-2"],
      "Aucun résultat trouvé"
    );
    const surprisedFish = app.generateDOMELement(
      "img",
      ["error-img"],
      "./assets/img/surprise.jpg",
      "no-film-found"
    );

    errorContainer.append(errorTitle, surprisedFish);
    app.resultsSection.append(errorContainer);
  },
  /** Gestionnaire d'évènements */
  handleUserInput: function (e) {
    app.userSearch = e.target.value;
  },
  handleClickOnSubmitButton: async function (e) {
    e.preventDefault();
    app.currentPage = 1;
    try {
      const results = await fetch(
        `http://www.omdbapi.com/?apikey=a52bbcae&page=${app.currentPage}&type=movie&s=${app.userSearch}&r=json`
      );
      if (results.status === 200) {
        results.json().then(function (response) {
          if (response.Search === undefined) {
            app.generateError();
          }
          // On check si la réponse n'est pas vide
          if (response.Search.length !== 0) {
            app.currentPage += 1;
            app.generateResponseContainer(response.totalResults);
            response.Search.forEach(movie => app.generateMovieCard(movie));
            document.addEventListener("scroll", app.handleScrollOnResultList);
          } else {
            app.generateError();
          }
        });
      } else {
        app.generateError();
      }
    } catch (e) {
      console.log(e);
      app.generateError();
    }
  },
  // Génère de nouveaux résultats au scroll (limité à 30 - probablement dû à l'API)
  handleScrollOnResultList: async function (e) {
    if (
      window.innerHeight + window.scrollY ===
      app.resultsSection.offsetHeight + 15
    ) {
      try {
        const results = await fetch(
          `http://www.omdbapi.com/?apikey=a52bbcae&page=${app.currentPage}&type=movie&s=${app.userSearch}&r=json`
        );
        if (results.status === 200) {
          results.json().then(function (response) {
            if (response.Search.length !== 0) {
              response.Search.forEach(movie => app.generateMovieCard(movie));
              app.currentPage += 1;
            }
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
};

document.addEventListener("DOMContentLoaded", app.init);
