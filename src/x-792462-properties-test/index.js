import { createCustomElement } from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
// import BasicNestedComponent from './basic-nested-component/BasicNestedComponent';
import { thing } from './basic-nested-component/thing';
import { BasicNestedComponent } from './basic-nested-component/BasicNestedComponent'

const view = (state, { updateState }) => {

	console.log(thing);
	const { properties } = state;
	console.log('properties:', properties);
	console.log(state);

	const handleClick = () => {
		updateState({
			value: state.value + properties.increment,
		})
	}

	return (
		<view>
			<div on-click={handleClick}>{properties.name}</div>
			<div>Value: {state.value || properties.initialValue}</div>
			<div>Increment: {properties.increment}</div>
			<BasicNestedComponent />
		</view>
	);

};

createCustomElement('x-792462-properties-test', {
	renderer: { type: snabbdom },
	view,
	styles,
	properties: {
		text: { default: 'Hello Nick' },
		name: { default: 5 },
		initialValue: { default: 1 },
		increment: { default: 1 },
	},
	initialState: {
		value: 0,
	},
});
