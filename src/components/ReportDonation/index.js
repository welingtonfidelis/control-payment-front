import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    PDFDownloadLink, Image,
    Page, Text, View, Document,
    StyleSheet, PDFViewer
} from '@react-pdf/renderer';
import { GetApp } from '@material-ui/icons';

export default function ReportDonation({ receives, startDate, endDate }) {
    startDate = format(new Date(startDate), 'dd/MM/yyyy', { locale: ptBR });
    endDate = format(new Date(endDate), 'dd/MM/yyyy', { locale: ptBR });
    const ImageLogo = localStorage.getItem('logoOng');

    const styles = StyleSheet.create({
        page: {
            padding: 10,
            fontFamily: 'Times-Roman',
            fontSize: 10
        },
        title: {
            textAlign: 'center',
            fontSize: 14
        },
        table: {
            display: "table",
            width: "auto",
        },
        tableRow: {
            margin: "auto",
            flexDirection: "row",
        },
        tableRowI: {
            margin: "auto",
            flexDirection: "row",
            backgroundColor: '#e8f2ff'
        },
        tableRowJ: {
            margin: "auto",
            flexDirection: "row",
            backgroundColor: '#cee4ff'
        },
        tableColTitle: {
            width: "33%",
            borderRightWidth: 1,
            borderLeft: 1,
            borderWidth: 1,
            backgroundColor: '#a7ffbe',
            fontSize: 12
        },
        tableCol: {
            width: "33%",
            borderStyle: "solid",
            borderWidth: 1,
            borderTopWidth: 0
        },
        tableCell: {
            margin: "auto",
            marginTop: 5,
        }
    });

    let totalDonation = 0;

    const MyDocument = () => (
        <Document>
            <Page style={styles.page}>
                {/* <Image
                    cache={false}
                    src={ImageLogo}
                /> */}
                <Text style={styles.title}>Relatório de Doações - {startDate} à {endDate}{"\n\n"}</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableColTitle}>
                            <Text style={styles.tableCell}>Data e hora</Text>
                        </View>
                        <View style={styles.tableColTitle}>
                            <Text style={styles.tableCell}>Nome</Text>
                        </View>
                        <View style={styles.tableColTitle}>
                            <Text style={styles.tableCell}>Valor</Text>
                        </View>
                    </View>

                    {receives.map((el, index) => {
                        const { value, paidIn, Taxpayer } = el;
                        const { name } = Taxpayer;
                        totalDonation += value;

                        return (
                            <View key={el.id} style={index % 2 ? styles.tableRowI : styles.tableRowJ}>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{format(new Date(paidIn), 'dd/MM/yyyy hh:mm')}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{name}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>R$ {value}</Text>
                                </View>
                            </View>
                        )
                    })}

                    <View style={styles.tableRow}>
                        <View style={styles.tableColTitle}>
                            <Text style={styles.tableCell}></Text>
                        </View>
                        <View style={styles.tableColTitle}>
                            <Text style={styles.tableCell}>Total</Text>
                        </View>
                        <View style={styles.tableColTitle}>
                            <Text style={styles.tableCell}>R$ {totalDonation}</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    )

    const PDF = () => (
        // <PDFViewer style={{ width: '100%', height: '50vh' }}>
        //     <MyDocument />
        // </PDFViewer>

        <div id="pdf-div" className="btn-new-medium">
            <GetApp />
            <PDFDownloadLink
                document={<MyDocument />}
                fileName={`doacoes_${startDate}-${endDate}.pdf`}>
                {({ blob, url, loading, error }) => (loading ? 'Carregando...' : 'Baixar PDF')}
            </PDFDownloadLink>
        </div>
    );

    return (
        <div>
            <PDF />
        </div>
    )
}