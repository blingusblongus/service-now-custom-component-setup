import { createCustomElement, actionTypes } from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import axios from 'axios';
import styles from './styles.scss';
// import { createHttpEffect } from '@servicenow/ui-effect-http';
import view from './src/view';


const USER_FETCHED = 'USER_FETCHED';
const {COMPONENT_RENDERED} = actionTypes;

//////////////////// GET TABLE
// the function we want to comprise the effect
async function httpEffect(url, options, coeffects) {
	const { dispatch, properties } = coeffects;
	const {tableName, limit, fields, queries} = properties;

	// build REST params
	url += `${tableName}?sysparm_limit=${limit}&sysparm_fields=${fields}`;

	let queryArr = queries.split(',');
	if(queries[0] !== ''){
		for(let query of queryArr){
			url += `&${query}`;
		}
	}

	dispatch('FETCH_STARTED');
	try {
		const result = await axios.get(url, {
				// headers: {
				// 	"Authorization": "Basic YWRtaW46ZGFoNGVGMkRUWUJ0",
				// }
			})
		dispatch('FETCH_SUCCEEDED', result);
	}catch(e){
		dispatch('FETCH_FAILED', e, {}, true)
	}
}

// the effect itself
function createHttpEffect(url, options) {
	return {
		effect: httpEffect,
		args: [url, options]
	}
}

const fetchUserEffect = createHttpEffect('api/now/table/');

// handler for fetch success
const handleFetchUserSucceeded = ({action}) => console.log(action.payload);

// handler for fetch fail
const handleFetchUserFailed = ({action}) => console.log('User fetch failed!')

createCustomElement('x-792462-properties-test', {
	renderer: { type: snabbdom },
	view,
	styles,
	properties: {
		userName: { default: 'default user' },
		tableName: { default: 'sys_user' },
		fields: { default: '' },
		limit: { default: '10'},
		queries: { default: 'active=true'}
	},
	actionHandlers: {
		// dispatched within component view or COMPONENT_CONNECTED action handler
		[COMPONENT_RENDERED]: fetchUserEffect,
		// ['USER_FETCHED']: fetchUserEffect,
		// success
		FETCH_SUCCEEDED: ({action, state, updateState}) => {
			handleFetchUserSucceeded({action});
			// this is probably not ideal but it seems to work
			if(state.tableData) return;
			updateState({tableData: action.payload.data.result});
		},
		// fail
		FETCH_FAILED: handleFetchUserFailed,
	}
});
