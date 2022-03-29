import { createCustomElement, actionTypes } from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import axios from 'axios';
import styles from './styles.scss';
// import { createHttpEffect } from '@servicenow/ui-effect-http';

import TableComponent from './src/TableComponent/TableComponent';

const USER_FETCHED = 'USER_FETCHED';
const {COMPONENT_RENDERED} = actionTypes;

const view = (state, { updateState, dispatch }) => {
	const { properties, tableData } = state;

	const {
		userName,
	} = properties;

	console.log(state);
	
	return (
		<view>
			<div className="text-center">Hello {properties.userName}</div>
			{/* {tableData && <pre>{JSON.stringify(tableData, null, 2)}</pre>} */}	
			{tableData && <TableComponent rows={tableData}/>}
		</view>
	);

};

// the function we want to comprise the effect
async function httpEffect(url, options, coeffects) {
	const {action, dispatch, properties} = coeffects;
	const {tableName, limit, fields, queries} = properties;

	

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
				headers: {
					"Authorization": "Basic YWRtaW46ZGFoNGVGMkRUWUJ0",
				}
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

//the effect handler
// const fetchUserEffect = ({state}) => {
// 	console.log(state);
// 	// let queries = '?';
// 	// for(let field of state.properties.fields.split(',')){
// 	// 	if(queries.length > 1){
// 	// 		queries += '&'
// 	// 	}
// 	// 	console.log(field);
// 	// 	queries += field + '=' + state.properties[field];
// 	// }

// 	const tableUrl = `/api/now/table/${state.tableName}?sysparm_limit=10&sysparm_fields=${state.properties.fields}`;
// 	createHttpEffect(tableUrl, {});
// }

const fetchUserEffect = createHttpEffect('api/now/table/');

// handler for fetch success
const handleFetchUserSucceeded = ({action}) => console.log(action.payload);

// handler for fetch fail
const handleFetchUserFailed = ({action}) => alert('User fetch failed!')

createCustomElement('x-792462-properties-test', {
	renderer: { type: snabbdom },
	view,
	styles,
	properties: {
		userName: { default: 'default user' },
		tableName: { default: 'sys_user' },
		fields: { default: 'first_name,last_name' },
		limit: { default: '10'},
		queries: { default: 'active=true'}
	},
	// url: '/api/now/table/sys_user',
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
