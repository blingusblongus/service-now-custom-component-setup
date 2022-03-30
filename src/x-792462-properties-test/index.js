import { createCustomElement, actionTypes } from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
// import { createHttpEffect } from '@servicenow/ui-effect-http';
import view from './src/view';
import { 
	fetchTableEffect, 
	handleFetchTableSucceeded, 
	handleFetchTableFailed 
} from './actions/fetchTable';

const { COMPONENT_RENDERED } = actionTypes;

createCustomElement('x-792462-properties-test', {
	renderer: { type: snabbdom },
	view,
	styles,
	properties: {
		userName: { default: 'default user' },
		tableName: { default: 'sys_user' },
		fields: { default: '' },
		limit: { default: '25' },
		queries: { default: '' }
	},
	actionHandlers: {
		// dispatched within component view or COMPONENT_CONNECTED action handler
		[COMPONENT_RENDERED]: fetchTableEffect,
		// success
		FETCH_SUCCEEDED: ({ action, state, updateState }) => {
			handleFetchTableSucceeded({ action });
			// this is probably not ideal but it seems to work
			if (state.tableData) return;
			updateState({ tableData: action.payload.data.result });
		},
		// fail
		FETCH_FAILED: handleFetchTableFailed,
	}
});
