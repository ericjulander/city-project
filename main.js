const { read , write, prettyprint } = require('./utils')


// slicing down to just the first couple rows to make your life easier for now
var csvData = read('cities.csv').slice(0,20) 


/* --- Your awesome code here --- */

//console.log(csvData);


/*
 * Creates an array of states based off of region
 */
function filterReigonData(csv){
	var regions = getListOf("REGION",csv);
	//console.log(regions);
	var regionData = regions.map(function(region){
		return {region: region, states:getStateData(region, csv)};
	});
	
	//console.log(regionData[1]);
	return regionData;
}

/*
 * Gets a list of all availiable values from the given key from the given object
 */
function getListOf(key, csv){
	return csv.map(function(data){
		return data[key];
	}).filter(function(item, index, data){
		if(data.indexOf(item) == index)
			return true;
		return false;
	});
}

/*
 * Creates a "State" Object from the cencus data.
 
 * The state object  
 */
function getStateData(regionName, csv){
	var area =  csv.filter(function(state){
		return state.REGION === regionName;
	}).map(function(item){
		return  item
	});
	
	var states = getListOf("STATE", area);
	var stateData = states.map(function(stateName){
		return {state: stateName, cities: csv.map(function(data){
			return {state: data.STATE, name: data.CITY, pop:data.POPULATION};
	}).filter(function(item, index, data){
		if(data.indexOf(item) == index)
			return true;
		return false;
	}).filter(function(state){
		return state.state == stateName;
	}).map(function(stateArray){
		return {name: stateArray.name, pop: stateArray.pop}
		})};
	});
	return stateData;
}


function convertCities(state){
	console.log(state.cities);
	var text = "\n## "+state.state;
	if(state.cities.length > 1){
	text += state.cities.reduce(function(list, city, index){
		if(index === 1)
			list = "\n" + city.name.split(",")[0] + " | " + city.pop;
		console.log("List", list);
		return list + "\n" + city.name.split(",")[0] + " | " + city.pop;
	});
	}else{
		text += "\n" + state.cities[0].name.split(",")[0] + " | " + state.cities[0].pop;
	}
	
	return text;
}

function converStates(region){
	console.log(region.states);
	return region.states.reduce(function(list, state, index){
		console.log(state.state);
		if(index === 1){
			list =   convertCities(state);
			return list;
		}
		return list + convertCities(state);
	});
}

function convertToMDTable(regionData){
	return regionData.reduce(function(list, region, index){
		console.log(region.region, index);
		if(index === 1)
			
			list = "\n# "+region.region+"\n"+converStates(region);
		return list + "\n# "+region.region+"\n"+converStates(region);
	});
}

/*
 * Prints the reigonal data
 */
function printStateData(regionData){
	var text = convertToMDTable(regionData);
	console.log(text);
}



(function main(){
	var regions = filterReigonData(csvData);
	printStateData(regions);
})();