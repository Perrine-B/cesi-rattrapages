const app = {
  userSearch: "",
  currentFilm: {},
  resultsSection: document.getElementsByClassName("results-section")[0],
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

  getRandomNumber: function (maxRange) {
    return Math.floor(Math.random() * maxRange);
  },
  generateDOMELement: function (balise, classes, content) {
    const element = document.createElement(balise);
    element.classList.add(...classes);
    if (balise === "img") {
      element.src = content;
    } else {
      element.innerText = content;
    }
    return element;
  },
  /** Transformation de la section résultats */
  cleanResultSection: function () {
    const placeholder = document.getElementsByClassName("search-placeholder");
    const previousMovie = document.getElementsByClassName("displayed-movie");
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
  generateMovieCard: function (movie) {
    app.cleanResultSection();

    // Génére une nouvelle réponse
    const researchContainer = app.generateDOMELement(
      "div",
      ["displayed-movie"],
      ""
    );

    const movieTitle = app.generateDOMELement(
      "h1",
      ["title", "is-2"],
      movie.Title
    );
    const movieYear = app.generateDOMELement("p", ["m-4"], movie.Year);
    const movieImage = app.generateDOMELement("img", [], movie.Poster);

    researchContainer.append(movieTitle, movieYear, movieImage);
    app.resultsSection.append(researchContainer);
  },
  generateError: function () {
    app.cleanResultSection();
    const errorContainer = app.generateDOMELement("div", ["error-section"], "");
    const errorTitle = app.generateDOMELement(
      "p",
      ["title", "is-2"],
      "Film not found"
    );
    const surprisedFish = app.generateDOMELement(
      "img",
      ["error-img"],
      "./assets/img/surprise.jpg"
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
    try {
      const results = await fetch(
        `http://www.omdbapi.com/?apikey=a52bbcae&type=movie&s=${app.userSearch}&r=json`
      );
      if (results.status === 200) {
        results.json().then(function (response) {
          if (response.Search === undefined) {
            app.generateError();
          }
          // On check si la réponse n'est pas vide
          if (response.Search.length !== 0) {
            const randomChosenFilm = app.getRandomNumber(
              response.Search.length - 1
            );
            app.generateMovieCard(response.Search[randomChosenFilm]);
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
  }
};

document.addEventListener("DOMContentLoaded", app.init);
