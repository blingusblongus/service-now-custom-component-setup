import axios from 'axios';

//////////////////// GET TABLE
// the function we want to comprise the effect
async function httpEffect(url, options, coeffects) {
	const { dispatch, properties, state, updateProperties } = coeffects;
	let { tableName, limit, fields, queries } = properties;


	if (!properties.shouldRender) return;

	//Make sure sys_id data is included
	if (!fields.split(/,\s*/).includes('sys_id') && fields !== '') {
		fields += ',sys_id';
	}
	console.log(fields);

	if (options.type === 'GET') {
		// build REST params
		url += `${tableName}?sysparm_limit=${limit}&sysparm_fields=${fields}`;
		url += `&sysparm_query=${queries.replace(' ', '')}`;

		dispatch('FETCH_STARTED');
		try {
			const result = await axios.get(url)
			dispatch('FETCH_SUCCEEDED', result);
		} catch (e) {
			dispatch('FETCH_FAILED', e, {}, true)
			console.log(e);
		}
	}else if(options.type === 'PUT') {
		url += `${tableName}/${options.sys_id}`;

		try{
			const result = await axios.put(url, options.body);
			console.log('PUT SUCCESS', result)
		}catch(err){
			console.error(err);
		}
	}

	updateProperties({
		shouldRender: false
	})
}

// the effect itself
export function createHttpEffect(url, options) {
	return {
		effect: httpEffect,
		args: [url, options]
	}
}

export const fetchTableEffect = createHttpEffect('api/now/table/');

// handler for fetch success
export const handleFetchTableSucceeded = ({ action }) => console.log(action.payload);

// handler for fetch fail
export const handleFetchTableFailed = ({ action }) => console.log('Table fetch failed!')
