import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    PDFDownloadLink, Image,
    Page, Text, View, Document,
    StyleSheet, PDFViewer
} from '@react-pdf/renderer';
import { GetApp } from '@material-ui/icons';

import util from '../../services/util';

import { styles } from '../../assets/css/pdf';

export default function ReportDonation({ receives, startDate, endDate }) {
    startDate = format(new Date(startDate), 'dd/MM/yyyy', { locale: ptBR });
    endDate = format(new Date(endDate), 'dd/MM/yyyy', { locale: ptBR });
    const ImageLogo = `${process.env.PUBLIC_URL}/${localStorage.getItem('logoOng')}`;

    let totalDonation = 0;
    const MyDocument = () => (
        <Document>
            <Page style={styles.page}>
                <View style={styles().divTitle}>
                    <Image
                        src={ImageLogo}
                        style={styles().imgTitle}
                    />
                    <Text style={styles().title}>Relatório de Doações - {startDate} à {endDate}</Text>
                </View>
                <View style={styles().table}>
                    <View style={styles().tableRow}>
                        <View style={styles().tableColCount}>
                            <Text style={styles().tableCell}>nº</Text>
                        </View>
                        <View style={styles(3).tableColHeader}>
                            <Text style={styles().tableCellHeader}>Data e hora</Text>
                        </View>
                        <View style={styles(3).tableColHeader}>
                            <Text style={styles().tableCellHeader}>Nome</Text>
                        </View>
                        <View style={styles(3).tableColHeader}>
                            <Text style={styles().tableCellHeader}>Valor</Text>
                        </View>
                    </View>

                    {receives.map((el, index) => {
                        const { value, paidIn, Taxpayer } = el;
                        const { name } = Taxpayer;
                        totalDonation += value;

                        return (
                            <View key={el.id} style={styles().tableRow}>
                                <View style={styles(null, index).tableColCount}>
                                    <Text style={styles(null, index).tableCell}>{index + 1}</Text>
                                </View>
                                <View style={styles(3, index).tableCol}>
                                    <Text style={styles().tableCell}>{format(new Date(paidIn), 'dd/MM/yyyy')}</Text>
                                </View>
                                <View style={styles(3, index).tableCol}>
                                    <Text style={styles().tableCell}>{name}</Text>
                                </View>
                                <View style={styles(3, index).tableCol}>
                                    <Text style={styles().tableCell}>{util.maskValue(value)}</Text>
                                </View>
                            </View>
                        )
                    })}
                </View>
                <View style={styles().footer}>
                    <Text>Total de doações: {util.maskValue(totalDonation)}</Text>
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