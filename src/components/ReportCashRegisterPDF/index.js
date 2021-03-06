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

    let totalIn = 0, totalOut = 0;
    const MyDocument = () => (
        <Document>
            <Page style={styles().page}>
                <View style={styles().divTitle}>
                    <Image
                        src={ImageLogo}
                        style={styles().imgTitle}
                    />
                    <Text style={styles().title}>Relatório de Registro de Caixa - {startDate} à {endDate}</Text>
                </View>
                <View style={styles().table}>
                    <View style={styles().tableRow}>
                        <View style={styles().tableColCount}>
                            <Text style={styles().tableCell}>nº</Text>
                        </View>
                        <View style={styles(4).tableColHeader}>
                            <Text style={styles().tableCellHeader}>Tipo</Text>
                        </View>
                        <View style={styles(4).tableColHeader}>
                            <Text style={styles().tableCellHeader}>Data e hora</Text>
                        </View>
                        <View style={styles(4).tableColHeader}>
                            <Text style={styles().tableCellHeader}>Descrição</Text>
                        </View>
                        <View style={styles(4).tableColHeader}>
                            <Text style={styles().tableCellHeader}>Valor</Text>
                        </View>
                    </View>

                    {receives.map((el, index) => {
                        const { value, paidIn, description, type } = el;

                        let typeDsc = '';
                        switch (type) {
                            case 'in':
                                typeDsc = 'Entrada';
                                totalIn += value;
                                break;

                            case 'don':
                                typeDsc = 'Doação';
                                totalIn += value;
                                break;

                            case 'out':
                                typeDsc = 'Saída';
                                totalOut += value;
                                break;
                        
                            default:
                                break;
                        }

                        return (
                            <View key={typeDsc + el.id} style={styles().tableRow}>
                                <View style={styles(null, index).tableColCount}>
                                    <Text style={styles(null, index).tableCell}>{index + 1}</Text>
                                </View>
                                <View style={styles(4, index).tableCol}>
                                    <Text style={styles().tableCell}>{typeDsc}</Text>
                                </View>
                                <View style={styles(4, index).tableCol}>
                                    <Text style={styles().tableCell}>{format(new Date(paidIn), 'dd/MM/yyyy')}</Text>
                                </View>
                                <View style={styles(4, index).tableCol}>
                                    <Text style={styles().tableCell}>{description}</Text>
                                </View>
                                <View style={styles(4, index).tableCol}>
                                    <Text style={styles().tableCell}>{util.maskValue(value)}</Text>
                                </View>
                            </View>
                        )
                    })}
                </View>
                <View style={styles().footer}>
                    <Text>Total de entrada: {util.maskValue(totalIn)}</Text>
                    <Text>Total de saída: {util.maskValue(totalOut)}</Text>
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
                fileName={`caixa_${startDate}-${endDate}.pdf`}>
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