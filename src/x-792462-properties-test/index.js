import { createCustomElement, actionTypes } from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import axios from 'axios';

import view from './src/view';
import {
	fetchTableEffect,
	handleFetchTableSucceeded,
	handleFetchTableFailed,
	createHttpEffect,
} from './actions/fetchTable';

const { COMPONENT_RENDERED } = actionTypes;


const newView = (state, {updateState}) => {
	const getStuff = async () => {
		let result = await axios.get('api/now/table/sys_user?sysparm_limit=100');
		const response = 
		updateState({tableData: result});
	}

	if(!state.tableData){
		getStuff();
	}

  return (
	<div><pre>{state.tableData}</pre></div>
  )
}

createCustomElement('x-792462-properties-test', {
	renderer: { type: snabbdom },
	view: newView,
	styles,
	properties: {
		userName: { default: 'default user' },
		tableName: { default: 'sys_user' },
		fields: { default: 'user_password, first_name' },
		limit: { default: '25' },
		queries: { default: '' },
		editLocation: {
			default: {
				rowIndex: null,
				field: null,
			}
		},
		shouldRender: {
			default: true
		},
		tdFontSize: {
			default: '12px'
		},
		tdBorder: {
			default: '1px solid lightgray',
		},
		thFontSize: {
			default: '26px'
		},
		tableStyles: {
			default: '{"padding":"20px", "width":"100%"}'
		},
		thStyles: {
			default: '{}',
		},
		tdStyles: {
			default: '{}',
		},
		unSnake: {
			default: true,
		},
		containerStyles: {
			default: '{}'
		}
	},
	actionHandlers: {
		// dispatched within component view or COMPONENT_CONNECTED action handler
		// [COMPONENT_RENDERED]: createHttpEffect('api/now/table/', { type: 'GET' }),
		FETCH_TABLE: () => {
			createHttpEffect('api/now/table/', { type: 'GET' })
		},
		// success
		FETCH_SUCCEEDED: ({ action, state, updateState }) => {
			handleFetchTableSucceeded({ action });
			// this is not ideal but prevents infinite rerenders
			// does an extra REST call, and doesn't hot update in UI builder
			const actionResult = action.payload.data.result;
			// if (state.tableData) return;
			updateState({ tableData: actionResult });
		},
		CELL_CLICKED: ({ action }) => {
			console.log(action.payload)
		},
		CELL_BLUR: ({ action, state, updateProperties, updateState, dispatch }) => {
			console.log('cell blur')
			console.log(action.payload)

			const update = async () => {
				const {location} = action.payload;
				const {field, newValue, sys_id} = location;
				try {
					const result = await axios.put(`api/now/table/${state.properties.tableName}/${sys_id}`, 
						{[field]: newValue});
					console.log('SUCCESS,', result);
					updateProperties({editLocation: {
						rowIndex: null,
						field: null,
					}})
					dispatch('FETCH_TABLE');
				} catch (err) {
					console.error(err);
				}
			}

			updateProperties({shouldRender: true});
			update();
		},
		EDIT_CELL: ({ action, updateProperties }) => {
			console.log(action.payload);
			updateProperties({
				editLocation: action.payload
			})
		},
		// fail
		FETCH_FAILED: handleFetchTableFailed,
	}
});
