import { createCustomElement } from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import axios from 'axios';
import styles from './styles.scss';
import { createHttpEffect } from '@servicenow/ui-effect-http';

const USER_FETCHED_SUCCESS = 'USER_FETCHED_SUCCESS'
const fetchUserEffect = createHttpEffect('api/users/')

const view = (state, { updateState }) => {
	const { properties } = state;

	const {
		userName,
	} = properties;

	console.log(state);

	// axios.get('https://dev104932.service-now.com/api/now/table/sys_user?sysparm_limit=10&sysparm_fields=first_name', {
	// 	headers: {
	// 		"Authorization": "Basic YWRtaW46ZGFoNGVGMkRUWUJ0",
	// 		"Access-Control-Allow-Origin": "http://localhost:8081",
	// 		"Access-Control-Allow-Methods": "GET",
	// 		"Access-Control-Allow-Headers": "Content-Type, Authorization"
	// 	}
	// }).then(response => console.log(response))
	// 	.catch(err => console.log(err))

	return (
		<view>
			<div>Hello {userName}</div>
		</view>
	);

};

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
		'USER_FETCHED': fetchUserEffect,
		[USER_FETCHED_SUCCESS]: ({ action, updateState }) => {
			console.log(action);
		}
	}
});
