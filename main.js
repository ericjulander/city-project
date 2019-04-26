const { read , write, prettyprint } = require('./utils')


// slicing down to just the first couple rows to make your life easier for now
var csvData = read('cities.csv').slice(0,20) 


/* --- Your awesome code here --- */

console.log(csvData);


/*
 * Creates an array of states based off of region
 */
function filterReigonData(csv){
	var regions = getListOf("REGION",csv);
	console.log(regions);
	var regionData = regions.map(function(region){
		return {region: region, states:getStateData(region, csv)};
	});
	
	console.log(regionData[1].states);
}

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
		return csv.map(function(data){
			return {state: data.STATE, name: data.CITY, pop:data.POPULATION};
	}).filter(function(item, index, data){
		if(data.indexOf(item) == index)
			return true;
		return false;
	}).filter(function(state){
		return state.state == stateName;
	});
	});
	//console.log(stateData);
	return stateData;
}
/*
 * Creates an array of cities based off of region
 */
function filterState(stateName){}

/*
 * Creates a city object for the state array
 */
function createCityData(stateName){}

/*
 * Prints the reigonal data
 */
function printStateData(){}

(function main(){
	filterReigonData(csvData);
})();