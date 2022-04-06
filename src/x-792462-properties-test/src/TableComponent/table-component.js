import { createCustomElement, actionTypes } from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
// import styles from './styles.scss';

const view = (state, updateState) => {

}

createCustomElement('table-component', {
	renderer: { type: snabbdom },
	view,
	// styles,
});