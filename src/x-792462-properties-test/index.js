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
			<div on-click={()=>dispatch(USER_FETCHED)}>Hello {properties.userName}</div>
			{tableData && <pre>{JSON.stringify(tableData, null, 2)}</pre>}
			{tableData && <TableComponent rows={tableData}/>}
		</view>
	);

};

// the function we want to comprise the effect
async function httpEffect(url, options, coeffects) {
	const {action, dispatch} = coeffects;

	dispatch('FETCH_STARTED');
	try {
		// const result = await fetch(url, options);
		// const data = await result.body.getReader().read()

		const result = await axios.get('/api/now/table/sys_user?sysparm_limit=10&sysparm_fields=first_name', {
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
const fetchUserEffect = createHttpEffect('/api/now/table/sys_user?sysparm_limit=10&sysparm_fields=first_name', {});

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
		fields: { default: 'first_name' },

	},
	actionHandlers: {
		// dispatched within component view or COMPONENT_CONNECTED action handler
		[COMPONENT_RENDERED]: fetchUserEffect,
		['USER_FETCHED']: fetchUserEffect,
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
