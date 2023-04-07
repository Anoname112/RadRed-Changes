var changedPokemon = [];

window.onload = function () {
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
	
}

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

function filterChanged () {
	refresh();
}

function showHide (bool) {
	const details = document.getElementById("res").querySelectorAll("details");
	
	details.forEach(function (detail) {
		detail.open = bool;
	});
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
						'<table class="stats">' +
							'<tr><td class="right">HP:</td><td class="left">&nbsp;' + smogon['baseStats']['hp'] + '</td></tr>' +
							'<tr><td class="right">ATK:</td><td class="left">&nbsp;' + smogon['baseStats']['atk'] + '</td></tr>' +
							'<tr><td class="right">DEF:</td><td class="left">&nbsp;' + smogon['baseStats']['def'] + '</td></tr>' +
							'<tr><td class="right">SPA:</td><td class="left">&nbsp;' + smogon['baseStats']['spa'] + '</td></tr>' +
							'<tr><td class="right">SPD:</td><td class="left">&nbsp;' + smogon['baseStats']['spd'] + '</td></tr>' +
							'<tr><td class="right">SPE:</td><td class="left">&nbsp;' + smogon['baseStats']['spe'] + '</td></tr>' +
						'</table>' +
						'<div><a href="https://dex.pokemonshowdown.com/pokemon/' + smogon['name'] + '" target="_blank">more..</a></div>' +
					'</div>' +
					'<div class="data">' +
						'<div class="fighting bold">RadRed</div>' +
						'<div>' + typesStr(radred['types']) + '</div>' +
						'<div>' + abilitiesStr(radred['abilities']) + '</div>' +
						'<div>Base stats:</div>' +
						'<table class="stats">' +
							'<tr><td class="right">HP:</td><td class="left">&nbsp;' + statStr(smogon['baseStats']['hp'], radred['baseStats']['hp']) + '</td></tr>' +
							'<tr><td class="right">ATK:</td><td class="left">&nbsp;' + statStr(smogon['baseStats']['atk'], radred['baseStats']['atk']) + '</td></tr>' +
							'<tr><td class="right">DEF:</td><td class="left">&nbsp;' + statStr(smogon['baseStats']['def'], radred['baseStats']['def']) + '</td></tr>' +
							'<tr><td class="right">SPA:</td><td class="left">&nbsp;' + statStr(smogon['baseStats']['spa'], radred['baseStats']['spa']) + '</td></tr>' +
							'<tr><td class="right">SPD:</td><td class="left">&nbsp;' + statStr(smogon['baseStats']['spd'], radred['baseStats']['spd']) + '</td></tr>' +
							'<tr><td class="right">SPE:</td><td class="left">&nbsp;' + statStr(smogon['baseStats']['spe'], radred['baseStats']['spe']) + '</td></tr>' +
						'</table>' +
						'<div><a href="https://dex.radicalred.net/pokemon/' + radred['name'] + '" target="_blank">more..</a></div>' +
					'</div>' +
				'</details>';
		}
	}
	
	document.getElementById("res").innerHTML = str;
}
