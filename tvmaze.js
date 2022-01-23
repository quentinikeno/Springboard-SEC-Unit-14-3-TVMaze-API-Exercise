/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
	// TODO: Make an ajax request to the searchShows api.  Remove
	// hard coded data.
	const returnArray = [];
	try {
		const response = await axios.get(
			"https://api.tvmaze.com/search/shows",
			{
				params: { q: query },
			}
		);
		for (let result of response.data) {
			let {
				id,
				name,
				summary,
				image: { original: image },
			} = result.show;
			//For shows with no image, use the tv missing image
			image = image || "https://tinyurl.com/tv-missing";
			returnArray.push({ id, name, summary, image });
		}
		return returnArray;
	} catch (error) {
		alert("Something went wrong!  Show not found!");
	}
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
	const $showsList = $("#shows-list");
	$showsList.empty();

	for (let show of shows) {
		let $item = $(
			`<div class="col-md-6 col-lg-3 Show mb-3" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <img class="card-img-top" src="${show.image}">
             <p class="card-text">${show.summary}</p>
             <button type="button" class="btn btn-secondary episodesBtn" data-toggle="modal" data-target="#reg-modal">Episodes</button>
           </div>
         </div>
       </div>
      `
		);

		$showsList.append($item);
	}
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
	evt.preventDefault();

	let query = $("#search-query").val();
	if (!query) return;

	$("#episodes-area").hide();

	let shows = await searchShows(query);

	populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
	// TODO: get episodes from tvmaze
	//       you can get this by making GET request to
	//       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
	// TODO: return array-of-episode-info, as described in docstring above
	const returnArray = [];
	const response = await axios.get(
		`https://api.tvmaze.com/shows/${id}/episodes`
	);
	for (let result of response.data) {
		const { id, name, season, number } = result;
		returnArray.push({ id, name, season, number });
	}
	return returnArray;
}

//Next, write a function, populateEpisodes, which is provided an array of episodes info, and populates that into the #episodes-list part of the DOM.
function populateEpisodes(episodes) {
	const $episodesArea = $("#episodes-area");
	const $episodesList = $("#episodes-list");
	$episodesList.empty();
	for (let episode of episodes) {
		const { id, name, season, number } = episode;
		const $item = $(
			`<li data-episode-id="${id}">${name} (season ${season}, number ${number})</li>`
		);
		$episodesList.append($item);
	}
	$episodesArea.show();
}

$("#shows-list").on(
	"click",
	".episodesBtn",
	async function handleEpisodesButton() {
		//get the show ID from the HTML data
		const showId = $(this).parents().eq(1).data("show-id");
		const episodes = await getEpisodes(showId);
		populateEpisodes(episodes);
	}
);
