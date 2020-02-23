import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale'
import {
    PDFDownloadLink, Image,
    Page, Text, View, Document,
    StyleSheet, PDFViewer
} from '@react-pdf/renderer';
import { GetApp } from '@material-ui/icons';
import './styles.scss';

export default function Receive({ receives }) {
    const ImageLogo = localStorage.getItem('logoOng');
    const month = format(new Date(), 'MMMM', {locale: ptBR})

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
            padding: 5,
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
                    const { Address, Payment, Ong } = rec;
                    const { street, number, district } = Address;
                    const { value } = Payment;

                    const municipallaw = Ong.municipallaw
                        ? `Utilidade Pública Municipal Lei nº ${Ong.municipallaw}`
                        : '';
                    const statelaw = Ong.statelaw
                        ? `Utilidade Pública Municipal Lei nº ${Ong.statelaw}`
                        : '';

                    return (
                        <View key={rec.id} style={styles.container}>
                            <View style={styles.header}>
                                {/* <Image 
                                    cache={false} 
                                    style={styles.image} 
                                    src={ImageLogo} 
                                /> */}
                                <View style={styles.headerText}>
                                    <Text>CNPJ <Text style={styles.h1}>{Ong.cnpj}</Text></Text>
                                    <Text>{municipallaw}</Text>
                                    <Text>{statelaw}</Text>
                                    <Text>{Ong.email}</Text>
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
                                <Text>Passos/MG, ____/____/_______</Text>
                                <Text>{"\n"}</Text>
                                <Text>__________________________________</Text>
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
            {/* <PDF /> */}

            <ul className="simple-list-2">
                {receives.map(rec => {
                    const { Address, Payment, Ong } = rec;
                    const { street, number, district } = Address;
                    const { value } = Payment;

                    const municipallaw = Ong.municipallaw
                        ? `Utilidade Pública Municipal Lei nº ${Ong.municipallaw}`
                        : '';
                    const statelaw = Ong.statelaw
                        ? `Utilidade Pública Municipal Lei nº ${Ong.statelaw}`
                        : '';

                    return <li key={rec.id}>
                        <div className="receive-header flex-row-w">
                            <img src={ImageLogo} alt="Sua logo" />
                            <div></div>
                            <div>
                                <div>CNPJ <strong>{Ong.cnpj}</strong></div>
                                <div>{municipallaw}</div>
                                <div>{statelaw}</div>
                                <strong>{Ong.email}</strong>
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
                            <p>Passos/MG, ____/____/_______</p>
                            <br></br>
                            <p>__________________________________________</p>
                            <p>Representante da {Ong.name}</p>
                        </div>
                    </li>
                }
                )}
            </ul>
        </div>
    )
}