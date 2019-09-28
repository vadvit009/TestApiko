let numOfPage = window.localStorage.getItem("numOfPage");
let ActiveChoose = window.localStorage.getItem("ActiveChoose");
let popularUrl = `https://api.themoviedb.org/3/tv/popular?api_key=720802f83a2886db550d2ddd6c059871&language=en-US&page=`;
let topRattedUrl = `https://api.themoviedb.org/3/tv/top_rated?api_key=720802f83a2886db550d2ddd6c059871&language=en-US&page=`;
let imgUrl = "https://image.tmdb.org/t/p/w185_and_h278_bestv2";
let pageNumber = document.getElementById("pageNumber");
let choose = document.getElementById("choose");
let cards = document.getElementById("cards");

pageNumber.addEventListener("click", function(e) {
  numOfPage = e.target.innerText;
  window.localStorage.setItem("numOfPage", numOfPage);
  window.location.reload();
});

let modal = document.querySelector("div.modal-content");
let exampleModal1 = document.getElementById("exampleModal1").children[0]
  .children[0];
let episodModal = document.getElementById("episodModal").children[0]
  .children[0];
let url = ActiveChoose + numOfPage;
choose.addEventListener("click", function(e) {
  if (e.target.innerHTML === "Popular TV Shows") {
    ActiveChoose = popularUrl;
    window.localStorage.setItem("ActiveChoose", ActiveChoose);
    window.location.reload();
  } else if (e.target.innerHTML === "Top Rated TV Shows") {
    ActiveChoose = topRattedUrl;
    window.localStorage.setItem("ActiveChoose", ActiveChoose);
    window.location.reload();
  }
});

let arrOfPop = [];
let request = new XMLHttpRequest();
request.open("GET", url);
request.responseType = "json";
request.send();
request.onload = function() {
  arrOfPop.push(request.response.results);
  for (let i = 0; i < arrOfPop[0].length; i++) {
    let tv_id = arrOfPop[0][i].id;
    let idUrlInfo = `https://api.themoviedb.org/3/tv/${tv_id}?api_key=720802f83a2886db550d2ddd6c059871&language=en-US`;
    cards.innerHTML +=
      '<div class="card col-6 col-sm-4 col-md-3 border-0">' +
      `<img class="card-img-top mx-auto" alt="photoOfTVShow" src="${imgUrl +
        arrOfPop[0][i].backdrop_path}">` +
      '<div class="card-body">' +
      `<h5 class="card-title">#${arrOfPop[0][i].id} <br>${
        arrOfPop[0][i].name
      }</h5>` +
      `<p class="card-text text-truncate text-muted">${
        arrOfPop[0][i].overview
      }</p>` +
      `<a href="${idUrlInfo}" class="btn btn-warning w-100 url" data-toggle="modal" data-target="#exampleModal">More Details</a>` +
      "</div>" +
      "</div > ";
  }

  let urlOfInfo = "";
  cards.addEventListener("click", function(e) {
    urlOfInfo = e.target.attributes[0].value;
    let req = new XMLHttpRequest();
    req.open("GET", urlOfInfo);
    req.responseType = "json";
    req.send();
    req.onload = function() {
      modal.children[0].children[0].innerHTML = req.response.name;
      modal.children[1].innerHTML = `<img class="float-left m-3" alt="photoPoster" src="${imgUrl +
        req.response.backdrop_path}">`;
      modal.children[1].innerHTML += "<p>" + req.response.overview + "</p>";
      modal.children[1].innerHTML +=
        "<p>Number Of Episodes = " + req.response.number_of_episodes + "</p>";
      modal.children[1].innerHTML +=
        "<p>Number Of Seasons = " + req.response.number_of_seasons + "</p>";
      modal.children[1].innerHTML += '<div class="list-group" id="season">';
      for (let i = 0; i < req.response.seasons.length; i++) {
        modal.children[1].children[4].innerHTML +=
          ' <a href="#" data-toggle="modal" data-dismiss="modal" data-target="#exampleModal1" class="list-group-item list-group-item-action">' +
          req.response.seasons[i].name +
          "</a>";
      }

      let season = document.getElementById("season");
      let partOfIdUrl = urlOfInfo.replace(
        "https://api.themoviedb.org/3/tv/",
        ""
      );
      let tv_id = partOfIdUrl.replace(
        "?api_key=720802f83a2886db550d2ddd6c059871&language=en-US",
        ""
      );

      season.addEventListener("click", function(e) {
        let season_number = e.target.innerText.replace("Season ", "");
        let urlOfSeason = `https://api.themoviedb.org/3/tv/${tv_id}/season/${season_number}?api_key=720802f83a2886db550d2ddd6c059871&language=en-US`;
        for (let i = 0; i < season.children.length; i++) {
          season.children[i].attributes[0].value = urlOfSeason;
        }
        let req = new XMLHttpRequest();
        req.open("GET", urlOfSeason);
        req.responseType = "json";
        req.send();
        req.onload = function() {
          exampleModal1.children[0].children[0].innerHTML = req.response.name;
          exampleModal1.children[1].innerHTML = `<img class="float-left m-3" alt="photoPoster" src="${imgUrl +
            req.response.poster_path}">`;
          exampleModal1.children[1].innerHTML +=
            "<p>" + req.response.overview + "</p>";
          exampleModal1.children[1].innerHTML +=
            "<p>Season number = " + req.response.season_number + "</p>";
          exampleModal1.children[1].innerHTML +=
            "<p>Number of Episodes = " + req.response.episodes.length + "</p>";
          exampleModal1.children[1].innerHTML +=
            '<div class="list-group" id="episod">';
          for (let i = 0; i < req.response.episodes.length; i++) {
            exampleModal1.children[1].children[4].innerHTML +=
              ' <a href="#" data-toggle="modal" data-dismiss="modal" data-target="#episodModal" class="list-group-item list-group-item-action">' +
              req.response.episodes[i].name +
              "</a>";
          }

          let episod = document.getElementById("episod");
          episod.addEventListener("click", function(e) {
            for (let i = 0; i < episod.children.length; i++) {
              let episode_number = 1 + i;
              let episodUrl = `https://api.themoviedb.org/3/tv/${tv_id}/season/${season_number}/episode/${episode_number}?api_key=720802f83a2886db550d2ddd6c059871&language=en-US`;
              episod.children[i].attributes[0].value = episodUrl;
            }

            let req = new XMLHttpRequest();
            req.open("GET", e.target.attributes[0].value);
            req.responseType = "json";
            req.send();
            req.onload = function() {
              episodModal.children[0].children[0].innerHTML = req.response.name;
              episodModal.children[1].innerHTML = `<img class="float-left m-3" alt="photoPoster" src="${imgUrl +
                req.response.still_path}">`;
              episodModal.children[1].innerHTML +=
                "<p>" + req.response.overview + "</p>";
              episodModal.children[1].innerHTML +=
                "<p>Season number = " + req.response.season_number + "</p>";
              episodModal.children[1].innerHTML +=
                "<p>Episode Number = " + req.response.episode_number + "</p>";
              episodModal.children[1].innerHTML +=
                '<div class="list-group" id="episod">';
            };
          });
        };
      });
    };
  });
};
