import {createCustomElement} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';

const view = (state, {updateState}) => {
	const {properties} = state;

	return (
		<div>{properties.name}</div>
	);
};

createCustomElement('x-792462-properties-test', {
	renderer: {type: snabbdom},
	view,
	styles,
	properties: {
		text: {default: 'Hello Nick'},
		name: {default: 3}
	}
});
