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
  generateMovieCard: function (movie) {
    const placeholder = document.getElementById("search-placeholder");
    app.resultsSection.removeChild(placeholder);

    const movieTitle = app.generateDOMELement(
      "h1",
      ["title", "is-2"],
      movie.Title
    );
    const movieYear = app.generateDOMELement("p", ["m-4"], movie.Year);
    const movieImage = app.generateDOMELement("img", [], movie.Poster);

    app.resultsSection.append(movieTitle, movieYear, movieImage);
  },
  /** Gestionnaire d'évènements */
  handleUserInput: function (e) {
    app.userSearch = e.target.value;
  },

  handleClickOnSubmitButton: async function (e) {
    e.preventDefault();
    console.log("Je prends l'appel à un ami");
    try {
      const results = await fetch(
        `http://www.omdbapi.com/?apikey=a52bbcae&type=movie&s=${app.userSearch}&r=json`
      );
      if (results.status === 200) {
        console.log("OK, j'ai trouvé un truc");

        results.json().then(function (response) {
          const randomChosenFilm = app.getRandomNumber(
            response.Search.length - 1
          );
          app.generateMovieCard(response.Search[randomChosenFilm]);
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
};

document.addEventListener("DOMContentLoaded", app.init);
