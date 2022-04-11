import TableComponent from './TableComponent/TableComponent';

const view = (state, { updateState, dispatch }) => {
    const { properties, tableData, editRow } = state;
    const { fields } = properties;

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