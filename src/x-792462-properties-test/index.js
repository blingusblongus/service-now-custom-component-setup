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
		fields: { default: 'user_password, first_name' },
		limit: { default: '25' },
		queries: { default: '' }
	},
	actionHandlers: {
		// dispatched within component view or COMPONENT_CONNECTED action handler
		[COMPONENT_RENDERED]: fetchTableEffect,
		// success
		FETCH_SUCCEEDED: ({ action, state, updateState }) => {
			handleFetchTableSucceeded({ action });
			// this is not ideal but prevents infinite rerenders
			// does an extra REST call, and doesn't hot update in UI builder
			const actionResult = action.payload.data.result;
			if (state.tableData) return;
			updateState({ tableData: actionResult });
		},
		// fail
		FETCH_FAILED: handleFetchTableFailed,
	}
});
