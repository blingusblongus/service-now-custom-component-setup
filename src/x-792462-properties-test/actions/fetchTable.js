import axios from 'axios';

//////////////////// GET TABLE
// the function we want to comprise the effect
async function httpEffect(url, options, coeffects) {
	const { dispatch, properties } = coeffects;
	const { tableName, limit, fields, queries } = properties;
    console.log(properties)

	// build REST params
	url += `${tableName}?sysparm_limit=${limit}&sysparm_fields=${fields}`;

	// let queryArr = queries.split(/,\s*/);
	// if (queries[0] !== '') {
	// 	for (let query of queryArr) {
	// 		url += `&${query}`;
	// 	}
	// }

    url += `&sysparm_query=${queries.replace(' ', '')}`;

	dispatch('FETCH_STARTED');
	try {
		const result = await axios.get(url)
		dispatch('FETCH_SUCCEEDED', result);
	} catch (e) {
		dispatch('FETCH_FAILED', e, {}, true)
        console.log(e);
	}
}

// the effect itself
function createHttpEffect(url, options) {
	return {
		effect: httpEffect,
		args: [url, options]
	}
}

export const fetchTableEffect = createHttpEffect('api/now/table/');

// handler for fetch success
export const handleFetchTableSucceeded = ({ action }) => console.log(action.payload);

// handler for fetch fail
export const handleFetchTableFailed = ({ action }) => console.log('User fetch failed!')
