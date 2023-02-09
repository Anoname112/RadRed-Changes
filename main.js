var changedPokemon = [];

function typeColor (type) {
	return '<span class="' + type.toLowerCase() + ' bold">' + type + '</span>';
}

function typesStr (types) {
	return typeColor(types['0']) + ((types['1']) ? ' / ' + typeColor(types['1']) : '');  
}

function abilitiesStr (abilities) {
	var str = (abilities['0']) ? '<u>' + abilities['0'] + '</u>' : '';
	str += (abilities['1']) ? ((str === '') ? '<u>' + abilities['1'] + '</u>' : ' | ' + '<u>' + abilities['1'] + '</u>') : '';
	str += (abilities['H']) ? ((str === '') ? '<u>' + abilities['H'] + '</u> [H]' : ' | ' + '<u>' + abilities['H'] + '</u> [H]') : '';
	return (str === '') ? 'None' : str; 
}

function statStr (smogonstat, radredstat) {
	if (smogonstat > radredstat) return '<span class="red bold">' + radredstat + '</span>';
	else if (smogonstat < radredstat) return '<span class="green bold">' + radredstat + '</span>';
	else return radredstat;
}

function refresh () {
	// name, types, heightm, weightkg, genderRatio/gender, abilities, baseStats
	var f = document.getElementById('filter').value.toLowerCase();
	var str = '';
	for (var i = 0; i < changedPokemon.length; i++) {
		var radredPokemon = changedPokemon[i].replace('gmax', 'mega');
		var smogon = SmogonPokedex[changedPokemon[i]];
		var radred = RadRedPokedex[radredPokemon];
		if (radred && radred['name'].toLowerCase().includes(f)) {
			str += '<details class="details">' +
					'<summary class="name">' + smogon['name'] + '</summary>' +
					'<div class="data">' +
						'<div class="poison bold">Smogon</div>' +
						'<div>' + typesStr(smogon['types']) + '</div>' +
						'<div>' + abilitiesStr(smogon['abilities']) + '</div>' +
						'<div>Base stats:</div>' +
						'<div>&nbsp;HP: ' + smogon['baseStats']['hp'] + '</div>' +
						'<div>ATK: ' + smogon['baseStats']['atk'] + '</div>' +
						'<div>DEF: ' + smogon['baseStats']['def'] + '</div>' +
						'<div>SPA: ' + smogon['baseStats']['spa'] + '</div>' +
						'<div>SPD: ' + smogon['baseStats']['spd'] + '</div>' +
						'<div>SPE: ' + smogon['baseStats']['spe'] + '</div>' +
						'<div><a href="https://dex.pokemonshowdown.com/pokemon/' + smogon['name'] + '" target="_blank">more..</a></div>' +
					'</div>' +
					'<div class="data">' +
						'<div class="fighting bold">RadRed</div>' +
						'<div>' + typesStr(radred['types']) + '</div>' +
						'<div>' + abilitiesStr(radred['abilities']) + '</div>' +
						'<div>Base stats:</div>' +
						'<div>&nbsp;HP: ' + statStr(smogon['baseStats']['hp'], radred['baseStats']['hp']) + '</div>' +
						'<div>ATK: ' + statStr(smogon['baseStats']['atk'], radred['baseStats']['atk']) + '</div>' +
						'<div>DEF: ' + statStr(smogon['baseStats']['def'], radred['baseStats']['def']) + '</div>' +
						'<div>SPA: ' + statStr(smogon['baseStats']['spa'], radred['baseStats']['spa']) + '</div>' +
						'<div>SPD: ' + statStr(smogon['baseStats']['spd'], radred['baseStats']['spd']) + '</div>' +
						'<div>SPE: ' + statStr(smogon['baseStats']['spe'], radred['baseStats']['spe']) + '</div>' +
						'<div><a href="https://dex.radicalred.net/pokemon/' + radred['name'] + '" target="_blank">more..</a></div>' +
					'</div>' +
				'</details>';
		}
	}
	
	document.getElementById("res").innerHTML = str;
}

function filterChanged () {
	refresh();
}

function showHide(bool) {
	const details = document.getElementById("res").querySelectorAll("details");
	
	details.forEach(function(detail) {
		detail.open = bool;
	});
}

document.addEventListener('DOMContentLoaded', function() {
	for (var pokemon in SmogonPokedex) {
		// start by making rrpokemon the copy of pokemon
		// if name in Smogon includes 'gmax' then the RadRed counterpart is 'mega'
		// but if mega also exist in Smogon, then the mega in Smogon should be used for comparison
		var rrpokemon = pokemon;
		if (pokemon.includes('gmax')) {
			rrpokemon = pokemon.replace('gmax', 'mega'); 
			if (rrpokemon in SmogonPokedex) pokemon = rrpokemon;
		}
		if (rrpokemon in RadRedPokedex) {
			for (var data in SmogonPokedex[pokemon]) {
				if (data in RadRedPokedex[rrpokemon]) {
					if (JSON.stringify(SmogonPokedex[pokemon][data]) !== JSON.stringify(RadRedPokedex[rrpokemon][data]) && !excluded.includes(data)) {
						if (!changedPokemon.includes(pokemon)) changedPokemon.push(pokemon);
					}
				}
			}
		}
	}
	
	refresh();
	document.getElementById('filter').focus();
	
}, false);