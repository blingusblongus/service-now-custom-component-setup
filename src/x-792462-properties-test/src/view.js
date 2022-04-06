import TableComponent from './TableComponent/TableComponent';
import axios from 'axios';
import './table-row/table-row.js';
import './table-cell/table-cell.js';

const view = (state, { updateState, dispatch }) => {
	const { properties, tableData, editRow } = state;
	const {fields} = properties;

    /* 
    ALTERNATE METHOD TO USING COMPONENT_RENDERED ACTION HANDLER & createHttpRequest()
    Requires proxy set and logged in to CLI
    
    axios.get(`api/now/table/sys_user?sysparm_limit=10&sysparm_fields=first_name`)
        .then(response => {
            if(state.tableData) return;
            updateState({tableData: response.data.result})
        })
        .catch(err => console.log(err));
	*/

    // const testPut = async () => {
    //     const options = {
    //         type: 'PUT',
    //         body: {
    //             'first_name': 'survey_edited'
    //         },
    //         sys_id: '005d500b536073005e0addeeff7b12f4'
    //     }

    //     try{
    //         const result = await axios.put(`api/now/table/sys_user/${options.sys_id}`, options.body);
    //         console.log('SUCCESS,', result);
    //     }catch(err){
    //         console.error(err);
    //     }
    // }

    // testPut();
    
	return (
		<view>
			<div className="text-center">Hello {properties.userName}</div>	
			{tableData && <TableComponent 
                rows={tableData} 
                fields={fields} 
                dispatch={dispatch}
                editLocation={state.properties.editLocation}
                properties={properties}
                />}
		</view>
	);

};

export default view;