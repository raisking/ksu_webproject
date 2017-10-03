// might as well just define an API key in one place and reference it when needed instead of endless copy-psating
const key = 'c1f2244dfc243c17b76897f58bfd4629';
const resultsContainer = document.getElementById('results-container');
const searchContainer = document.getElementById('search-container');
const movieSearchBox = document.getElementById('movieSearchBox');
const popularContainer = document.getElementById('popularMovies');
let resultsIndex = 0, sortIndex = 0;
let searchResults, queryValue, castContainer, cast;
var resultsBoxName = 'resultsBoxList';
var apiURL, sortURL;

// function to request & display list of movie results based on search terms
function searchForMovies() {
  
  // setting up AJAX request:
  queryValue = movieSearchBox.value;
  let encodedQueryValue = encodeURI(queryValue);
  //url with API key && query value
  let url = `http://api.themoviedb.org/3/search/movie?api_key=${key}&query=${encodedQueryValue}&page=1`;
	apiURL = url;
  // AJAX request to search for movies by title
  let request = new XMLHttpRequest();
  request.open('GET', url);  

  request.onreadystatechange = function() {
    if (request.readyState === 4) {
	  // Format page
      preFormatResults('resultsList'); 
	  // Gather up JSON search results
      searchResults = JSON.parse(request.responseText).results;         
      resultsContainer.innerHTML = `<h3>${searchResults.length} Results for "${queryValue}"</h3><br/>`;
	  // Sorting movies by release date
      resultsContainer.innerHTML += `<button class='fr' onclick='sortResultsByDate()'>Sort by Release Date</button><br><br>`;
	  // Dispaly search results
      searchResults.forEach(showQueryResult);                           
		
      console.log('/search/movie parsed response: ', JSON.parse(request.responseText));
    }
  };  

  request.send();
}

movieSearchBox.addEventListener('keyup', function(event) {
  if (event.key === 'Enter') searchForMovies();
});

function preFormatResults(option) {
  if (option === 'resultsList') {
    resultsContainer.style.display = 'flex';
    resultsContainer.style.backgroundColor = 'white';
    resultsIndex = 0;
    sortIndex = 0;
    searchResults = undefined;
    castContainer = undefined;
  }
  else if (option === 'movieData') {
    resultsContainer.innerHTML = "";
    resultsContainer.style.backgroundColor = '#e9e9e9';
  }
}

function sortResultsByDate() {
  if (sortIndex % 2 === 0) {
    searchResults.sort((a, b) => {
      let releaseA = Number(a.release_date.replace(/-/g, ''));
      let releaseB = Number(b.release_date.replace(/-/g, ''));
      return releaseB - releaseA;
    });
  }
  else {
    searchResults.sort((a, b) => {
      let releaseA = Number(a.release_date.replace(/-/g, ''));
      let releaseB = Number(b.release_date.replace(/-/g, ''));
      return releaseA - releaseB;
    });
  }

  resultsContainer.innerHTML = `<h3>${searchResults.length} Results for "${queryValue}"</h3><br/>`;
  resultsContainer.innerHTML += `<button class='fr' onclick='sortResultsByDate()'>Sort by Release Date</button><br><br>`
  searchResults.forEach(showQueryResult); 

  sortIndex++;
}

// Displays summary data for a movie search result
function showQueryResult(result) {
  let title = result.title;
  let id = result.id;
  let releaseDate = `<span class='year'>(${result.release_date.slice(0,4)})</span>` || `<span class='year'>(release date unavailable)</span>`;
  //let resultDiv = document.createElement('div');
  let colorClass = (resultsIndex % 2 === 0 ) ? 'bc-light-gray' : 'bc-light-gray2';

  resultsContainer.innerHTML += `<div id="movieResult${resultsIndex}" class='${resultsBoxName} ${colorClass}' onclick='requestMovieData(${id})'>${title} ${releaseDate}</div>`;
  //resultsContainer.appendChild(resultDiv);

  resultsIndex++;
}


// View detailed data for a specified movie
function requestMovieData(id) {
  let movieData;
  let url = `http://api.themoviedb.org/3/movie/${id}?api_key=${key}&append_to_response=credits`;

  // AJAX request to retrieve movie data
  let request = new XMLHttpRequest();  
  request.open('GET', url);  

  request.onreadystatechange = function() {
    if (request.readyState === 4) {
      preFormatResults('movieData');
      displayMovieData(request);
    }
  };

  request.send();
}

// Display detailed data for a clicked on movie
function displayMovieData(request){
  movieData = JSON.parse(request.responseText);
  console.log('/movie/id parsed response: ', movieData); 

  let title = movieData.title || 'No title available';
  let overview = movieData.overview || 'No overview available.';
  let posterPath = `http://image.tmdb.org/t/p/w500${movieData.poster_path}`;
  let releaseYear = movieData.release_date ? `(${movieData.release_date.slice(0,4)})` : 'No release date available';
  let rating = movieData.vote_average ? `${movieData.vote_average} / 10` : 'No rating available';
  let runtime = movieData.runtime ? `${movieData.runtime} min` : 'No runtime available.';
  let homepageURL = movieData.homepage || '';
  let directors = movieData.credits.crew.filter( person => person.job === 'Director' );
  cast = movieData.credits.cast;

  resultsContainer.innerHTML =  movieData.poster_path ? `<img src='${posterPath}'>` : '';
  resultsContainer.innerHTML += `<h1>${title}</h1>`
                              + `<span class='color-dark-gray'>${releaseYear}</span>`
                              + `<div id='rating'>${rating}</div><br><br>`
                              + `<span>${overview}</span><br><br><br>`
                              + `<span class='fw-bold'>Runtime:</span> ${runtime}<br>`
                              + `<span class='fw-bold'>Homepage:</span> `;
  resultsContainer.innerHTML += (homepageURL !== '') ? `<a href='${homepageURL}'>${homepageURL}</a><br>` : 'No homepage available.<br>';

  appendDirectorInfo(directors);
  appendCastInfo('short');
 
  
}

function appendDirectorInfo(directors) {
  // Append director info
  resultsContainer.innerHTML += (directors.length > 1) ? `<span class='fw-bold'>Directors:</span> ` : `<span class='fw-bold'>Director:</span> `;
  for (let i = 0; i < directors.length; i++){
    resultsContainer.innerHTML += 
	`<span class='pseudolink' onclick="requestCastInfo(${directors[i].id})"><a href="#toCastDetails" style="text-decoration:none;color: inherit">${directors[i].name}</a></span>`;
    if ( i < directors.length - 1) resultsContainer.innerHTML += ', ';
  }
  resultsContainer.innerHTML += '<br>';
}

function appendCastInfo(length) {
  if (castContainer) {
    castContainer = resultsContainer.removeChild(castContainer);
  }
  castContainer = document.createElement('div');
  castContainer.id = 'castContainer';
  castContainer.innerHTML += `<span class='fw-bold'>Cast:</span><br>`;
  
  
  if (length === 'short') {
    let totalMembers = (cast.length < 10) ? cast.length : 10;
    for (let i = 0; i < totalMembers; i++){
      castContainer.innerHTML += 
	  `<span class='pseudolink' onclick="requestCastInfo(${cast[i].id})"><a href="#toCastDetails" style="text-decoration:none;color: inherit">${cast[i].name}</a></span>:  ${cast[i].character}<br>`;
	  
    }
	
    // Add button to show all cast members, if necessary
    if (cast.length > 10) {
      castContainer.innerHTML += `<br><button onclick="appendCastInfo('long')">Show Full Cast</button><br>`;
	 
	}
	
	 castContainer.innerHTML += `<br><button id="searchButton" onclick="searchForMovies();document.getElementById('btnHide').click()">Close</button>`;
	
	
  } // End of 'short' code block
  else if (length === 'long') {
    for (let i = 0; i < cast.length; i++){
      castContainer.innerHTML += 
	  `<span class='pseudolink' onclick="requestCastInfo(${cast[i].id})"><a href="#toCastDetails" style="text-decoration:none;color: inherit">${cast[i].name}</a></span>:  ${cast[i].character}<br>`;
	  
    }
	
    // Add button to show less cast members
    castContainer.innerHTML += `<br><button onclick="appendCastInfo('short')">Show Less</button><br>`;
	castContainer.innerHTML += `<button id="searchButton"onclick="searchForMovies();document.getElementById('btnHide').click()">Close</button>`;
	
  }// End of 'long' code block

  resultsContainer.appendChild(castContainer);
}

function hideResults() {
  resultsContainer.style.display = 'none';
  movieSearchBox.value = '';
}

function searchForPage1() {
  
  // setting up AJAX request:
  queryValue = movieSearchBox.value;
  let encodedQueryValue = encodeURI(queryValue);
  //url with API key && query value
  let url = `http://api.themoviedb.org/3/search/movie?api_key=${key}&query=${encodedQueryValue}&page=1`;
  apiURL = url;
  // AJAX request to search for movies by title
  let request = new XMLHttpRequest();
  request.open('GET', url);  

  request.onreadystatechange = function() {
    if (request.readyState === 4) {
	  // Format page
      preFormatResults('resultsList'); 
	  // Gather up JSON search results
      searchResults = JSON.parse(request.responseText).results;         
      resultsContainer.innerHTML = `<h3>${searchResults.length} Results for "${queryValue}"</h3><br/>`;
	  // Sorting movies by release date
      resultsContainer.innerHTML += `<button class='fr' onclick='sortResultsByDate()'>Sort by Release Date</button><br><br>`;
	  
	  // Dispaly search results
      searchResults.forEach(showQueryResult);                           
		
      console.log('/search/movie parsed response: ', JSON.parse(request.responseText));
    }
  };  

  request.send();
}

function searchForPage2() {
  
  // setting up AJAX request:
  queryValue = movieSearchBox.value;
  let encodedQueryValue = encodeURI(queryValue);
  //url with API key && query value
  let url = `http://api.themoviedb.org/3/search/movie?api_key=${key}&query=${encodedQueryValue}&page=2`;
	apiURL = url;
  // AJAX request to search for movies by title
  let request = new XMLHttpRequest();
  request.open('GET', url);  

  request.onreadystatechange = function() {
    if (request.readyState === 4) {
	  // Format page
      preFormatResults('resultsList'); 
	  // Gather up JSON search results
      searchResults = JSON.parse(request.responseText).results;         
      resultsContainer.innerHTML = `<h3>${searchResults.length} Results for "${queryValue}"</h3><br/>`;
	  // Sorting movies by release date
      resultsContainer.innerHTML += `<button class='fr' onclick='sortResultsByDate()'>Sort by Release Date</button><br><br>`;
	  
	  // Dispaly search results
      searchResults.forEach(showQueryResult);                           
		
      console.log('/search/movie parsed response: ', JSON.parse(request.responseText));
    }
  };  

  request.send();
}
function searchForPage3() {
  
  // setting up AJAX request:
  queryValue = movieSearchBox.value;
  let encodedQueryValue = encodeURI(queryValue);
  //url with API key && query value
  let url = `http://api.themoviedb.org/3/search/movie?api_key=${key}&query=${encodedQueryValue}&page=3`;
	apiURL = url;
  // AJAX request to search for movies by title
  let request = new XMLHttpRequest();
  request.open('GET', url);  

  request.onreadystatechange = function() {
    if (request.readyState === 4) {
	  // Format page
      preFormatResults('resultsList'); 
	  // Gather up JSON search results
      searchResults = JSON.parse(request.responseText).results;         
      resultsContainer.innerHTML = `<h3>${searchResults.length} Results for "${queryValue}"</h3><br/>`;
	  // Sorting movies by release date
      resultsContainer.innerHTML += `<button class='fr' onclick='sortResultsByDate()'>Sort by Release Date</button><br><br>`;
	  
	  // Dispaly search results
      searchResults.forEach(showQueryResult);                           
		
      console.log('/search/movie parsed response: ', JSON.parse(request.responseText));
    }
  };  

  request.send();
}
function searchForPage4() {
  
  // setting up AJAX request:
  queryValue = movieSearchBox.value;
  let encodedQueryValue = encodeURI(queryValue);
  //url with API key && query value
  let url = `http://api.themoviedb.org/3/search/movie?api_key=${key}&query=${encodedQueryValue}&page=4`;
	apiURL = url;
  // AJAX request to search for movies by title
  let request = new XMLHttpRequest();
  request.open('GET', url);  

  request.onreadystatechange = function() {
    if (request.readyState === 4) {
	  // Format page
      preFormatResults('resultsList'); 
	  // Gather up JSON search results
      searchResults = JSON.parse(request.responseText).results;         
      resultsContainer.innerHTML = `<h3>${searchResults.length} Results for "${queryValue}"</h3><br/>`;
	  // Sorting movies by release date
      resultsContainer.innerHTML += `<button class='fr' onclick='sortResultsByDate()'>Sort by Release Date</button><br><br>`;
	  
	  // Dispaly search results
      searchResults.forEach(showQueryResult);                           
		
      console.log('/search/movie parsed response: ', JSON.parse(request.responseText));
    }
  };
  
    request.send();
} 
function searchForPage5() {
  
  // setting up AJAX request:
  queryValue = movieSearchBox.value;
  let encodedQueryValue = encodeURI(queryValue);
  //url with API key && query value
  let url = `http://api.themoviedb.org/3/search/movie?api_key=${key}&query=${encodedQueryValue}&page=5`;
	apiURL = url;
  // AJAX request to search for movies by title
  let request = new XMLHttpRequest();
  request.open('GET', url);  

  request.onreadystatechange = function() {
    if (request.readyState === 4) {
	  // Format page
      preFormatResults('resultsList'); 
	  // Gather up JSON search results
      searchResults = JSON.parse(request.responseText).results;         
      resultsContainer.innerHTML = `<h3>${searchResults.length} Results for "${queryValue}"</h3><br/>`;
	  // Sorting movies by release date
      resultsContainer.innerHTML += `<button class='fr' onclick='sortResultsByDate()'>Sort by Release Date</button><br><br>`;
	  // Dispaly search results
      searchResults.forEach(showQueryResult);                           
		
      console.log('/search/movie parsed response: ', JSON.parse(request.responseText));
    }
  };  

  request.send();
}

function requestCastInfo(id){
	 $.getJSON("https://api.themoviedb.org/3/person/"+id+"?api_key="+key+"&language=en-US", function (jsonData)
         {
            $("#cast-container").html("");
			var template = $('#castDetailsTemplate').html();
			var html = Mustache.render(template, jsonData);
			$("#cast-container").html(html);
			$("#cast-container").fadeIn();
					 
			$("#btnHide").click(function ()
			{
				$("#cast-container").fadeOut();
			});
         });
	
}


function requestPopularMovies(){

	$.getJSON("https://api.themoviedb.org/3/discover/movie?api_key="+key+"&sort_by=popularity.desc", function (jsonData){
		
			$("#popularMoviesContainer").html("");
			var template = $('#popularMoviesTemplate').html();
			var html = Mustache.render(template, jsonData);
			$("#popularMoviesContainer").html(html);
			$("#popularMoviesContainer").fadeIn();
	});
}
function listView(){


	var i = 0;
	$("#results-container > div").each(function(){
		let colorClass = (i % 2 === 0 ) ? 'bc-light-gray' : 'bc-light-gray2';
		document.getElementById("movieResult"+i+"").className = "resultsBoxList "+colorClass+"";
		i++;
	});
	
}
function gridView(){


	var i = 0;
	$("#results-container > div").each(function(){
		let colorClass = (i % 2 === 0 ) ? 'bc-light-gray' : 'bc-light-gray2';
		document.getElementById("movieResult"+i+"").className = "resultsBoxGrid "+colorClass+"";
		i++;
	});
	
}

function testUrl(){
	
	sortURL = apiURL+"&sort_by=release_date.desc";
	searchResults.forEach(showQueryResult);
	
}
