import { createCustomElement, actionTypes } from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';

const view = (state, {updateState}) => {
    const {content} = state.properties
    console.log(state.editMode)

    return <td>{content}</td>;
}

createCustomElement('table-cell', {
	renderer: { type: snabbdom },
	view,
    editMode: false,
    properties: {
        editMode: {
            default: false,
        },
        rowData: {
            default: null,
        },
        content: {
            default: null,
        }
    }
	// styles,
});