import { StyleSheet } from '@react-pdf/renderer';

export function styles (nCol = 1) {
   const styles = StyleSheet.create({
        page: {
            padding: 10
        },
        table: {
            display: "table",
            width: "auto",
            borderStyle: "solid",
            borderColor: '#bfbfbf',
            borderWidth: 1,
            borderRightWidth: 0,
            borderBottomWidth: 0
        },
        tableRow: {
            margin: "auto",
            flexDirection: "row"
        },
        tableColHeader: {
            width: `${100/nCol}%`,
            borderStyle: "solid",
            borderColor: '#bfbfbf',
            borderBottomColor: '#000',
            borderWidth: 1,
            borderLeftWidth: 0,
            borderTopWidth: 0
        },
        tableCol: {
            width: `${100/nCol}%`,
            borderStyle: "solid",
            borderColor: '#bfbfbf',
            borderWidth: 1,
            borderLeftWidth: 0,
            borderTopWidth: 0
        },
        tableCellHeader: {
            margin: "auto",
            padding: 5,
            fontSize: 12,
            fontWeight: 500
        },
        tableCell: {
            margin: "auto",
            padding: 5,
            fontSize: 10
        }
    });    

    return styles;
}
