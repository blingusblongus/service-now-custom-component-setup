import { createCustomElement, actionTypes } from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';

const view = (state) => {
    const {rowData, fields} = state.properties;
    console.log(rowData)

    return <tr>
    {fields.map((field, i) => {
        return <td key={i}>{rowData[field]}</td>
    })}
    </tr>
}

createCustomElement('table-row', {
	renderer: { type: snabbdom },
	view,
    properties: {
        editMode: {
            default: false,
        },
        rowData: {
            default: null,
        },
        fields: {
            default: null,
        }
    }
	// styles,
});