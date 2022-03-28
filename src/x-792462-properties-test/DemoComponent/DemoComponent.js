import { createCustomElement } from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
// import BasicNestedComponent from './basic-nested-component/BasicNestedComponent';
import { thing } from './basic-nested-component/thing';
import { BasicNestedComponent } from './basic-nested-component/BasicNestedComponent'

const view = (state, { updateState }) => {

	const { properties } = state;
	console.log(state);

	const handleClick = () => {
		updateState({
			value: state.value + Number(properties.increment),
		})
	}



	return (
		<view>
			<div on-click={handleClick}>FEED ME</div>
			<div>Value: {state.value || properties.initialValue}</div>
			<div>Increment: {properties.increment}</div>
			<BasicNestedComponent />
			<div style={{display: 'flex', justifyContent: 'center'}}>
				<div
					style={{
						...style.box,
						backgroundColor: `hsl(29deg,80%,80%)`,
						height: state.value + 'px',
					}}
				>
					<span>:)</span>
				</div>
			</div>

		</view>
	);

};

const style = {
	h1: {
		textAlign: 'center'
	},
	box: {
		width: '100px',
		height: '100px',
		backgroundColor: 'rgb(255, 150, 150)',
		// opacity: .3,
		margin: '20px auto',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		transform: 'rotate(90deg)',
		fontSize: '4rem',
		borderRadius: '1rem',
		filter: 'drop-shadow(2px -2px 1px black)',
		transition: 'height 2s'
	},
	dayLabel: {
		width: '50%',
	},
	// centered: {
	// 	margin: 'auto',
	// },
	textCenter: {
		textAlign: 'center',
	},
	happyBox: {
		verticalAlign: 'center',
	}
}

createCustomElement('x-792462-properties-test', {
	renderer: { type: snabbdom },
	view,
	styles,
	properties: {
		text: { default: 'Hello Nick' },
		name: { default: 5 },
		initialValue: { default: 100 },
		increment: { default: 20 },
	},
	initialState: {
		value: 100,
		boxWidth: 100,
	},
});
