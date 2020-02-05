import React, { useEffect } from 'react';
import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
    Font
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
    },
    image: {
        width: '60%',
        padding: 10,
        backgroundColor: 'grey',
    },
    textWrapper: {
        width: '40%',
        height: '100%',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 50,
        paddingVertical: 30,
    },
    text: {
        fontFamily: 'Oswald',
        color: '#212121',
    },
});

// Font.register({
//     family: 'Oswald',
//     src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf',
// });

export function PdfDocument({ receives }) {
    console.log(receives);

    return (
        <Document>
            <Page style={styles.page} page>
                <View style={styles.image}>
                    <Text>Olá</Text>
                </View>
            </Page>
        </Document>

    )
}