import React, { useEffect, useState } from 'react';
import dateFormat from 'dateformat';
import {
    PDFDownloadLink, Image,
    Page, Text, View, Document,
    StyleSheet, PDFViewer
} from '@react-pdf/renderer';
import { GetApp } from '@material-ui/icons';
import './styles.scss';

import ImageLogo from '../../assets/images/logo-patas.png';

export default function Receive({ receives }) {
    const today = new Date();
    const month = dateFormat(today, 'mmmm');

    const styles = StyleSheet.create({
        page: {
            padding: 10,
            fontFamily: 'Times-Roman'
        },
        container: {
            width: "50%",
            borderStyle: "solid",
            borderColor: '#bfbfbf',
            borderWidth: 1,
            borderRadius: 5,
            flexDirection: 'column',
            fontSize: 10,
            marginBottom: 5,
            padding: 5
        },
        header: {
            flexDirection: 'row',
            borderBottomWidth: 0.5,
            paddingBottom: 3,
            marginBottom: 3
        },
        headerText: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        image: {
            width: 70,
            paddingRight: 10
        },
        content: {
            borderBottomWidth: 0.5,
            paddingBottom: 3,
            marginBottom: 3
        },
        footer: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        h1: {
            textAlign: 'center',
            marginBottom: 2,
        },
        h2: {
            fontSize: 10
        }
    });

    const MyDocument = () => (
        <Document>
            <Page style={styles.page}>
                {receives.map((rec, index) => {
                    const { Address, Payment } = rec;
                    const { street, number, district } = Address;
                    const { value } = Payment;

                    return (
                        <View style={styles.container}>
                            <View style={styles.header}>
                                <Image
                                    style={styles.image}
                                    src={ImageLogo}
                                />
                                <View style={styles.headerText}>
                                    <Text>CNPJ <Text style={styles.h1}>023.778.707/0001-29</Text></Text>
                                    <Text>Utilidade Pública Municipal Lei nº 1.965/95</Text>
                                    <Text>Utilidade Pública Estadual Lei nº 22.321/16</Text>
                                    <Text>contatopatasamigas@hotmail.com</Text>
                                </View>
                            </View>

                            <View style={styles.content}>
                                <Text style={styles.h1}>RECIBO</Text>
                                <Text>
                                    Recebi de {rec.name}, a quantia de
                                    R$ {value}, referente à contribuição do mês
                                    de {month}.
                                </Text>
                                <Text>Endereço: {street}, {number}, {district}.</Text>
                            </View>

                            <View style={styles.footer}>
                                <Text>Passos/MG, {dateFormat(today, 'dd/mm/yyyy')}</Text>
                                <Text>Representante da ONG Patas Amigas</Text>
                            </View>
                        </View>
                    )
                })}
            </Page>
        </Document>
    );

    const PDF = () => (
        // <PDFViewer style={{ width: '100%', height: '100%' }}>
        //     <MyDocument />
        // </PDFViewer>

        <div id="pdf-div" className="btn-new-medium">
            <GetApp />
            <PDFDownloadLink
                document={<MyDocument />}
                fileName={`${month}.pdf`}>
                {({ blob, url, loading, error }) => (loading ? 'Carregando...' : 'Baixar PDF')}
            </PDFDownloadLink>
        </div>
    );

    return (
        <div>
            <PDF />

            <ul className="simple-list-2">
                {receives.map(rec => {
                    const { Address, Payment } = rec;
                    const { street, number, district } = Address;
                    const { value } = Payment;

                    return <li key={rec.id}>
                        <div className="receive-header flex-row-w">
                            <img src={ImageLogo} alt="Logo pagas amigas" />
                            <div></div>
                            <div>
                                <div>CNPJ <strong>023.778.707/0001-29</strong></div>
                                <div>Utilidade Pública Municipal Lei nº <strong>1.965/95</strong></div>
                                <div>Utilidade Pública Estadual Lei nº <strong>22.321/16</strong></div>
                                <strong>contatopatasamigas@hotmail.com</strong>
                            </div>
                        </div>
                        <div className="receive-content">
                            <h3>RECIBO</h3>
                            <p>Recebi de <strong>{rec.name}</strong>, a quantia de
                            R$ <strong>{value}</strong>, referente à contribuição do mês
                            de <strong> {month}</strong>.</p>
                            <p>Endereço: <strong>{street}, {number}, {district}</strong>.</p>
                        </div>

                        <div className="receive-footer">
                            <p>Passos/MG, <strong>{dateFormat(today, 'dd/mm/yyyy')}</strong></p>
                            <p>Representante da ONG Patas Amigas</p>
                        </div>
                    </li>
                }
                )}
            </ul>
        </div>
    )
}