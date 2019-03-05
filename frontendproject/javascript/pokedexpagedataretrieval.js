// Javascript code for retrieving pokemon data

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

// Http request

var pokemon_table = $('pokemontable');

var page = getQueryVariable('page');

var xmlhttp = new XMLHttpRequest();
var url = 'https://intern-pokedex.myriadapps.com/api/v1/pokemon?page=' + page;
var pokemon_details;

xmlhttp.onreadystatechange = function() {
	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		pokemon_details = JSON.parse(xmlhttp.responseText);
		
		// In future: populate table function for pokemon_table
		console.log(pokemon_details);
	}
}

xmlhttp.open('GET', url, true);
xmlhttp.send();


