const TableComponent = ({ rows, fields, dispatch, editLocation, properties }) => {

    fields = fields.split(/,\s*/);

    //handle empty field arguments
    if (fields.length < 2 && fields[0] === '') {
        fields = Object.keys(rows[0]);
    }

    const {
        tableBoxShadow,
        thFontSize,
    } = properties;

    return (
        <div class="table-container" >
            <table style={{boxShadow: tableBoxShadow}}>
                <tr>
                    {fields.map(field => {
                        return <th style={{fontSize: thFontSize }}>{field}</th>
                    })}
                </tr>

                {rows.map((row, i) => {
                    return <tr key={i}>
                        {fields.map((field, j) => {

                            if (editLocation.rowIndex === i && editLocation.field === field) {
                                return <input
                                    value={row[field]}
                                    on-blur={(e) => dispatch('CELL_BLUR', {
                                        location: {
                                            field: field,
                                            sys_id: row.sys_id,
                                            newValue: e.target.value,
                                        },
                                        newValue: e.target.value,
                                    })}
                                />
                            } else {
                                return <td key={j}
                                    on-click={() => dispatch('EDIT_CELL', { rowIndex: i, field: field })}
                                >
                                    {row[field]}
                                </td>
                            }
                        })}
                    </tr>
                })}
            </table>
        </div>
    )
}

export default TableComponent;