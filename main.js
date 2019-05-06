const {
	read,
	write,
	prettyprint
} = require('./utils')


// slicing down to just the first couple rows to make your life easier for now
var csvData = read('cities.csv') //.slice(0, 20)


function compareCharacters(c1, c2) {
	return (c1 - c2) / Math.abs(c1 - c2) || 0;
}

function sortByName(string1, string2) {
	var length = (string1.length < string2.length) ? string1.length : string2.length;

	var pos;
	for (var i = 0; i < length; i++) {
		var [c1, c2] = [string1.charCodeAt(i), string2.charCodeAt(i)];
		pos = compareCharacters(c1, c2);

		if (pos !== 0) {
			console.log(pos, String.fromCharCode(c1), String.fromCharCode(c2));
			break;
		} else
			console.log(string1, string1);

	}
	return pos;
}

/*
 * Creates an array of states based off of region
 */
function filterReigonData(csv) {
	var regions = getListOf("REGION", csv);
	////console.log(regions);
	var regionData = regions.map(function (region) {
		return {
			name: region,
			states: getStateData(region, csv).sort((a, b) => sortByName(a.name, b.name))
		};
	});

	return regionData;
}

/*
 * Gets a list of all availiable values from the given key from the specified object
 * It filters through the given an array and returns a list of the items in it without duplicates
 * key: the function filters down the array to objects with this key
 * csv: the object data to filter through and orgagnise 
 */
function getListOf(key, csv) {
	return csv.map(function (data) {
		// restructures the array to return only the items from the given key
		return data[key];
	}).filter(removeDuplicates);
}

/*
 * Removes duplicate items from an array
 */
function removeDuplicates(item, index, data) {

	// removes duplicates from the array
	if (data.indexOf(item) == index)
		return true;
	return false;
}

/*
 * Creates a "State" Object from the cencus data.
 * regionName: name of the region you would like a list of states for
 * csv: the raw cencus data
 */
function getStateData(regionName, csv) {
	// filters out the states for the specified region
	var area = csv.filter(function (state) {
		return state.REGION === regionName;
	});

	// gets a list of all the states in the region
	var states = getListOf("STATE", area);

	// reformatsthe data so it fits into the markdown function
	var stateData = states.map(function (stateName) {
		return {
			name: stateName,
			cities: organizeCityData(stateName, csv)
		};
	});

	return stateData;
}

/*
 * It gives you an array of cities from the specified date from the csv data
 * stateName: name of the state to build the cities array for
 * csv: csv cencus data
 */
function organizeCityData(stateName, csv) {
	return csv.map(function (data) {
			// builds a temp object including the cities state to make filtering easier
			return {
				state: data.STATE,
				name: data.CITY.split(",")[0],
				population: parseInt(data.POPULATION)
			};
		})
		.filter(removeDuplicates)
		.filter(function (city) {
			// narrows it down to only the cities for the specififed state
			return city.state == stateName;
		})
		.map(function (stateArray) {
			// takes the filtered data and then reorganizes it into the format for markdown and removes the "state" attribute
			return {
				name: stateArray.name,
				population: stateArray.population
			}
		});
}

(function main() {
	var regions = filterReigonData(csvData);
	write("testoftotallitness.md", regions);
})();

// function degubRegionData(regionData) {
// 	return regionData.map(function (i) {
// 		return {
// 			r: i.region,
// 			s: i.states.map(function (i) {
// 				return i.name + " : " + i.cities.map(function (j) {
// 					return j.name + " | " + j.population;
// 				}).join(" , ");
// 			}).join(" , ")
// 		}
// 	});
// }