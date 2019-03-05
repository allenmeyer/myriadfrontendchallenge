// Javascript code for retriving data of a single pokemon

// Helper functions
var $ = function(id) { return document.getElementById(id); };

function getQueryVariable(variable) { // source: https://css-tricks.com/snippets/javascript/get-url-variables/
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if(pair[0] == variable) {
			return pair[1];
		}
	}
	return false;
}

// Http request for individual pokemon data

// TODO: add onclick to pokemon table elements that redirects to pokemonpage.php?id=#
var pokemonid = getQueryVariable('id');

var xmlhttp = new XMLHttpRequest();
var url = 'https://intern-pokedex.myriadapps.com/api/v1/pokemon/' + id;
var pokemon_details;

xmlhttp.onreadystatechange = function() {
	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		pokemon_details = JSON.parse(xmlhttp.responseText);
		
		// In future: populate an html element with pokemon data
		console.log(pokemon_details);
	}
}

xmlhttp.open('GET', url, true);
xmlhttp.send();
