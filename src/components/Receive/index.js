import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale'
import {
    PDFDownloadLink, Image,
    Page, Text, View, Document,
    StyleSheet, PDFViewer
} from '@react-pdf/renderer';
import { GetApp } from '@material-ui/icons';
import Switch from 'react-switch';

import './styles.scss';

export default function Receive({ receives }) {
    const ImageLogo = localStorage.getItem('logoOng');
    const month = format(new Date(), 'MMMM', { locale: ptBR });
    const year = format(new Date(), 'yyyy');
    const [receiveCopy, setReceiveCopy] = useState(false);

    const styles = StyleSheet.create({
        page: {
            padding: 10,
            fontFamily: 'Times-Roman'
        },
        body: {
            flexDirection: 'row',
            height: '25vh'
        },
        containerCopyClient: {
            flex: 2,
            borderStyle: "solid",
            borderColor: '#bfbfbf',
            borderWidth: 1,
            borderRadius: 5,
            flexDirection: 'column',
            fontSize: 10,
            marginBottom: 5,
            padding: 5,
        },
        containerCopyOng: {
            flex: 1,
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
            marginBottom: 3,
            alignItems: 'center',
            justifyContent: 'center',
        },
        headerText: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        image: {
            width: 70,
            paddingRight: 10,
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
        footerObs: {
            fontSize: 8,
            paddingLeft: '70%'
        },
        h1: {
            textAlign: 'center',
            marginBottom: 2,
        },
        h2: {
            fontSize: 10
        },
    });

    //canhoto do pdf
    const CopyOngPdf = ({ rec }) => {
        const { Address, Payment, Ong } = rec;
        const { street, number, district } = Address;
        const { value } = Payment;

        if (receiveCopy) {
            return (
                <View key={rec.id} style={styles.containerCopyOng}>
                    <View style={styles.header}>
                        <Image
                            cache={false}
                            style={styles.image}
                            src={ImageLogo}
                        />
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
                        <Text>{"\n"}</Text>
                        <Text>Passos/MG, ____/____/{year}</Text>
                        <Text>{"\n"}</Text>
                        <Text>__________________________________</Text>
                        <Text>Representante {Ong.name}</Text>
                    </View>
                </View>
            )
        }
        else return (<></>);
    }

    const MyDocument = () => (
        <Document>
            <Page style={styles.page}>
                {receives.map((rec, index) => {
                    const { Address, Payment, Ong } = rec;
                    const { street, number, district } = Address;
                    const { value } = Payment;
                    const hourStart = format(new Date(Payment.hourStart), "HH:mm");
                    const hourEnd = format(new Date(Payment.hourEnd), "HH:mm");

                    const municipallaw = Ong.municipallaw
                        ? `Utilidade Pública Municipal Lei nº ${Ong.municipallaw}`
                        : '';
                    const statelaw = Ong.statelaw
                        ? `Utilidade Pública Municipal Lei nº ${Ong.statelaw}`
                        : '';

                    return (
                        <View style={styles.body}>

                            <CopyOngPdf rec={rec}></CopyOngPdf>

                            <View key={rec.id} style={styles.containerCopyClient}>
                                <View style={styles.header}>
                                    <Image
                                        cache={false}
                                        style={styles.image}
                                        src={ImageLogo}
                                    />
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
                                    <Text>{"\n"}</Text>
                                    <Text>Passos/MG, ____/____/{year}</Text>
                                    <Text>{"\n"}</Text>
                                    <Text>__________________________________</Text>
                                    <Text>Representante {Ong.name}</Text>
                                    <Text>{"\n"}</Text>
                                    <View style={styles.footerObs}>
                                        <Text>*Receber entre {hourStart} e {hourEnd}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                    )
                })}
            </Page>
        </Document >
    );

    const PDF = () => (
        // <PDFViewer style={{ width: '100%', height: '50vh' }}>
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

            <label className="switch-report-search">
                <Switch
                    onChange={() => setReceiveCopy(!receiveCopy)}
                    checked={receiveCopy}
                    onColor='#0e78fa'
                />
                <span>{receiveCopy ? 'Com ' : 'Sem '} canhoto</span>
            </label>

            <ul className={"simple-list-2"} id="printme">
                {receives.map(rec => {
                    const { Address, Payment, Ong } = rec;
                    const { street, number, district } = Address;
                    const { value } = Payment;
                    const hourStart = format(new Date(Payment.hourStart), "HH:mm");
                    const hourEnd = format(new Date(Payment.hourEnd), "HH:mm");

                    const municipallaw = Ong.municipallaw
                        ? `Utilidade Pública Municipal Lei nº ${Ong.municipallaw}`
                        : '';
                    const statelaw = Ong.statelaw
                        ? `Utilidade Pública Municipal Lei nº ${Ong.statelaw}`
                        : '';

                    return <li key={rec.id} className="flex-row-w">
                        <div
                            className="receive-copy-ong"
                            style={{ display: receiveCopy ? 'block' : 'none' }}>

                            <div>
                                <img src={ImageLogo} alt="Sua logo" />
                            </div>

                            <div className="receive-content">
                                <h3>RECIBO</h3>
                                <p>Recebi de <strong>{rec.name}</strong>, a quantia de
                                R$ <strong>{value}</strong>, referente à contribuição do mês
                                de <strong> {month}</strong>.</p>
                                <p>Endereço: <strong>{street}, {number}, {district}</strong>.</p>
                            </div>

                            <div className="receive-footer">
                                <p>Passos/MG, ____/____/{year}</p>
                                <br></br>
                                <p>__________________________________________</p>
                                <p>Representante da {Ong.name}</p>
                            </div>
                        </div>

                        <div className="receive-copy-client">
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
                                <p>Passos/MG, ____/____/{year}</p>
                                <br></br>
                                <p>__________________________________________</p>
                                <p>Representante {Ong.name}</p>
                                <p className="receive-footer-obs">*Receber entre {hourStart} e {hourEnd}</p>
                            </div>
                        </div>
                    </li>
                }
                )}
            </ul>

        </div>
    )
}