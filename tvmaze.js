"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

//const GLOBAL_URL = "http://api.tvmaze.com/search/shows?"
const BASE_URL = "http://api.tvmaze.com";
const NO_IMAGE_FOUND = "https://previews.123rf.com/images/arcady31/arcady311303/arcady31130300032/18519959-vector-oops-symbol.jpg";


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  //const noImageFound = "https://previews.123rf.com/images/arcady31/arcady311303/arcady31130300032/18519959-vector-oops-symbol.jpg";

  const response = await axios.get(`${BASE_URL}/search/shows`, {params:{q:term}});
  console.log("got", response);
  //rename searchTerm
  return response.data.map((eachShow) =>{
    return {
      id: eachShow.show.id,
      name: eachShow.show.name,
      summary: eachShow.show.summary,
      image: eachShow.show.image ? eachShow.show.image.original : NO_IMAGE_FOUND,
    }});


}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"

              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) { 
  const response = await axios(`${BASE_URL}/shows/${id}/episodes`);

  console.log("got", response);

  return response.data.map(eachEpisode=>({
    id: eachEpisode.id,
    name: eachEpisode.name,
    season: eachEpisode.season,
    episode: eachEpisode.number,
  }));


}



/** Write a clear docstring for this function... */

function populateEpisodes(episodes) { 
  $episodesArea.empty();

  for (let episode of episodes) {
    const $episode = $(
      `<ul data-show-id="${episode.id}" class="Show col-md-12 col-lg-6 mb-4">
          <li class="text-primary">${episode.name}
          (Season ${episode.season} , Episode ${episode.episode})</li>
        </ul>
      `);

    $episodesArea.append($episode);  }

  $episodesArea.show();



}

async function getEpisodes(evt){
  evt.preventDefault();

  const showEpisodeId = $(evt.target).closest(".Show").data().showId;
  const episodes = await getEpisodesOfShow(showEpisodeId);
  populateEpisodes(episodes);


}

$showsList.on("click", ".Show-getEpisodes", getEpisodes);
