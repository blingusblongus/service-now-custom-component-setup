import TableComponent from './TableComponent/TableComponent';
const view = (state, { updateState, dispatch }) => {
	const { properties, tableData } = state;
	const {fields} = properties;
	
	return (
		<view>
			<div className="text-center">Hello {properties.userName}</div>	
			{tableData && <TableComponent rows={tableData} fields={fields}/>}
		</view>
	);

};

export default view;