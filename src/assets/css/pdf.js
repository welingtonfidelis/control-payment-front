import { StyleSheet } from '@react-pdf/renderer';

export function styles (nCol = 1, index) {
   const styles = StyleSheet.create({
        page: {
            padding: 10
        },
        divTitle: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        },
        imgTitle: {
            width: 100
        },
        title: {
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
        tableColCount: {
            width: '5%',
            borderStyle: "solid",
            borderBottomColor: '#000',
            borderWidth: 1,
            borderLeftWidth: 0,
            borderTopWidth: 0,
            color: index >= 0 ? '' : '#fff',
            borderColor: index >= 0 ? '#bfbfbf' : '',
            backgroundColor: index >= 0 ? (index % 2? '#fff' : '#d3e6f9') : '#4093f9',
        },
        tableColHeader: {
            width: `${(95/nCol)}%`,
            borderStyle: "solid",
            borderBottomColor: '#000',
            borderWidth: 1,
            borderLeftWidth: 0,
            borderTopWidth: 0,
            backgroundColor: '#4093f9',
            color: '#fff'
        },
        tableCol: {
            width: `${95/nCol}%`,
            borderStyle: "solid",
            borderColor: '#bfbfbf',
            borderWidth: 1,
            borderLeftWidth: 0,
            borderTopWidth: 0,
            backgroundColor: index % 2? '#fff' : '#d3e6f9'
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
        },
        footer:{
            justifyContent: 'center',
            alignItems: 'flex-end',
            fontSize: 11,
            backgroundColor: '#4093f9',
            color: '#fff',
            padding: 5,
        }
        
    });    

    return styles;
}
