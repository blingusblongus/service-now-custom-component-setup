const TableComponent = ({ rows }) => {
    const fields = Object.keys(rows[0]);
    console.log(rows);
    console.log(fields);
    return (
        <div class="table-container">
            <table>
                <tr>
                    {fields.map(field => {
                        return <th>{field}</th>
                    })}
                </tr>
                {rows.map((row, i) => {
                    return <tr key={i}>
                        {fields.map((field, i) => {
                            return <td key={i}>{row[field]}</td>
                        })}
                    </tr>
                })}
            </table>
        </div>
    )
}

export default TableComponent;