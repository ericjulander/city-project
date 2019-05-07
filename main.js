const {
	read,
	write,
	prettyprint
} = require('./utils')

/*
 * determines if the 1 item comes before or after the second (1 = after, -1 = before, 0 = same )
 */
function getPosition(c1, c2) {
	return (c1 - c2) / Math.abs(c1 - c2) || 0;
}

/*
 * Array function that sorts two strings alphabetically 
 */
function sortByName(string1, string2) {
	var length = (string1.length < string2.length) ? string1.length : string2.length;
	var pos;
	// loops until it finds the correct placenment for the specified work
	for (var i = 0; i < length; i++) {
		// gets the the character at the specified position in the array
		var [c1, c2] = [string1.charCodeAt(i), string2.charCodeAt(i)];
		// determines the correct order of the two items
		pos = getPosition(c1, c2);
		//leaves the loop when it finds one character that is different and places it
		if (pos !== 0) break;
	}
	return pos;
}

/*
 * Sorts items according to a predefined list
 * list (array): The order items need to go into
 * items (array): Items that need to be reordered
 * keys (array) [optional]: Subitems of the item to be compared with the predefined list instead of the entire item itself
 * 
 */
function sortAccordingToList(list, items, keys) {
	var sortedList =
		list.map(function (listItem) {
			// filters all items which match the key in the current list-item
			var match = items.filter(function (item, index) {
				// if a keys array was provided it will filter out which keys match the current list-item. If no keys were provided, it will compare the current item to the list-item
				var matches = (Array.isArray(keys)) ? keys[index] === listItem : (item === listItem);
				return matches;
			});

			return match;
		});
	return sortedList;
}

/*
 * Creates an array of states based off of region
 */
function filterReigonData(csv) {
	var regions = getListOf("REGION", csv);

	var properOrder = ["Pacific", "Mountain", "Midwest", "South", "Northeast"];
	var regionData = regions.map(function (region) {
		return {
			name: region,
			states: getStateData(region, csv).sort((a, b) => sortByName(a.name, b.name))
		};
	});

	// orders the region data properly and then collapses the array
	regionData = sortAccordingToList(properOrder, regionData, regionData.map(a => a.name)).map(a => a[0]);

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
		}).sort(function (city1, city2) {
			var [c1, c2] = [city1.population, city2.population];
			// determines if the 1 population is greater than the other (1 greater, -1 less, 0 same equal)
			return getPosition(c1, c2);
		})
		.map(function (stateArray) {
			// takes the filtered data and then reorganizes it into the format for markdown and removes the "state" attribute
			return {
				name: stateArray.name,
				population: stateArray.population
			}
		});
}

/*
 * Gets the CSV data, formats itm  and then prints it to the markdown file
 */
(function main() {
	// slicing down to just the first couple rows to make your life easier for now
	var csvData = read('cities.csv') //.slice(0, 20)
	var regions = filterReigonData(csvData);
	// write the md file
	write("cencus-data.md", regions);
})();