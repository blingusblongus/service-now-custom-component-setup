import { handleCase } from '../../utils/utils.js';

const TableComponent = ({ rows, fields, dispatch, editLocation, properties }) => {

    fields = fields.split(/,\s*/);

    //handle empty field arguments
    if (fields.length < 2 && fields[0] === '') {
        fields = Object.keys(rows[0]);
    }

    const {
        thFontSize,
        tdFontSize,
        tdBorder,
        tableStyles,
        containerStyles,
        thStyles,
        tdStyles,
        unSnake,
    } = properties;

    const handleCase = (str) => {
        let words = str.split(/_/).map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        return words.join(' ');
    }
    const combinedThStyles = {fontSize: thFontSize, ...JSON.parse(thStyles)};
    const combinedTdStyles = {fontSize: tdFontSize, border: tdBorder, ...JSON.parse(tdStyles)};

    return (
        <div className="table-container" style={JSON.parse(containerStyles)}>
            <table style={(tableStyles && JSON.parse(tableStyles))}>
                <tr>
                    {fields.map(field => {
                        let header = unSnake ? handleCase(field) : field;
                        return <th style={combinedThStyles}>{header}</th>
                    })}
                </tr>

                {rows.map((row, i) => {
                    return <tr key={i}>
                        {fields.map((field, j) => {
                            if (editLocation.rowIndex === i && editLocation.field === field) {
                                return <td style={combinedTdStyles}>
                                    <input
                                        className="td-input"
                                        value={row[field]}
                                        on-blur={(e) => dispatch('CELL_BLUR', {
                                            location: {
                                                field: field,
                                                sys_id: row.sys_id,
                                                newValue: e.target.value,
                                            },
                                            newValue: e.target.value,
                                        })}
                                        autofocus
                                    />
                                </td>
                            } else {
                                return <td key={j}
                                    style={combinedTdStyles}
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