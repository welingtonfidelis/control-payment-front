import React, { useState, useEffect } from 'react';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import {
    PDFDownloadLink, Image,
    Page, Text, View, Document,
    StyleSheet, PDFViewer
} from '@react-pdf/renderer';
import { GetApp, Landscape } from '@material-ui/icons';
import DateFnsUtils from "@date-io/date-fns";
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import Chart from "react-apexcharts";
import Switch from 'react-switch';

import api from '../../services/api';
import Load from '../Load/Load';
import Swal from '../SweetAlert/SwetAlert';

import {styles} from '../../assets/css/pdf';
import './styles.scss';

export default function ListTaxpayer() {
    const [taxpayer, setTaxpayer] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        async function getInfo() {
            setLoading(true);

            try {
                let resp = await api.get('/taxpayer', {
                    headers: { token }
                });

                const { status } = resp.data;

                if (status) {
                    const { response } = resp.data;
                    setTaxpayer(response);
                }
                else {
                    Swal.swalErrorInform();
                }

            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        }

        getInfo();
    }, [token]);

    const MyDocument = () => (
        <Document>
            <Page orientation="landscape" style={styles().page}>
                {/* <Image
                    cache={false}
                    src={ImageLogo}
                /> */}
                <Text style={styles().title}>Relatório de Contribuintes {"\n\n"}</Text>
                <View style={styles().table}>
                    <View style={styles().tableRow}>
                        <View>
                            <Text style={styles().tableCell}></Text>
                        </View>
                        <View style={styles(8).tableColHeader}>
                            <Text style={styles().tableCellHeader}>Nome</Text>
                        </View>
                        <View style={styles(8).tableColHeader}>
                            <Text style={styles().tableCellHeader}>Nascimento</Text>
                        </View>
                        <View style={styles(8).tableColHeader}>
                            <Text style={styles().tableCellHeader}>Endereço</Text>
                        </View>
                        <View style={styles(8).tableColHeader}>
                            <Text style={styles().tableCellHeader}>Telefone 1</Text>
                        </View>
                        <View style={styles(8).tableColHeader}>
                            <Text style={styles().tableCellHeader}>Telefone 2</Text>
                        </View>
                        <View style={styles(8).tableColHeader}>
                            <Text style={styles().tableCellHeader}>Telefone E-mail</Text>
                        </View>
                        <View style={styles(8).tableColHeader}>
                            <Text style={styles().tableCellHeader}>Valor Contrib.</Text>
                        </View>
                        <View style={styles(8).tableColHeader}>
                            <Text style={styles().tableCellHeader}>Dia Receb.</Text>
                        </View>
                    </View>

                    {taxpayer.map((el, index) => {
                        const { Address, Payment } = el;
                        const cep = Address.cep ? Address.cep : '';
                        const street = Address.street ? Address.street : '';
                        const complement = Address.complement ? Address.complement : '';
                        const district = Address.district ? Address.district : '';
                        const city = Address.city ? Address.city : '';
                        const state = Address.state ? Address.state : '';
                        const number = Address.number ? Address.number : '';

                        return (
                            <View key={el.id} style={styles().tableRow}>
                                <View style={styles(8).tableCol, {width: '2%'}}>
                                    <Text style={styles().tableCell}>{index + 1}</Text>
                                </View>
                                <View style={styles(8).tableCol}>
                                    <Text style={styles().tableCell}>{el.name}</Text>
                                </View>
                                <View style={styles(8).tableCol}>
                                    <Text style={styles().tableCell}>{format(new Date(el.birth), 'dd/MM/yyyy')}</Text>
                                </View>
                                <View style={styles(8).tableCol}>
                                    <Text style={styles().tableCell}>{cep}, {street}, {complement}, {number}, {district}, {city}-{state}</Text>
                                </View>
                                <View style={styles(8).tableCol}>
                                    <Text style={styles().tableCell}>{el.phone1}</Text>
                                </View>
                                <View style={styles(8).tableCol}>
                                    <Text style={styles().tableCell}>{el.phone1}</Text>
                                </View>
                                <View style={styles(8).tableCol}>
                                    <Text style={styles().tableCell}>{el.email}</Text>
                                </View>
                                <View style={styles(8).tableCol}>
                                    <Text style={styles().tableCell}>R$ {Payment.value}</Text>
                                </View>
                                <View style={styles(8).tableCol}>
                                    <Text style={styles().tableCell}>{Payment.expiration}</Text>
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
                            <Text style={styles.tableCell}>0</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    )

    const PDF = () => (
        // <PDFViewer style={{ width: '100%', height: '50vh' }}>
        //     <MyDocument/>
        // </PDFViewer>

        <div id="pdf-div" className="btn-new-medium">
            <GetApp />
            <PDFDownloadLink
                document={<MyDocument />}
                fileName={`contribuintes.pdf`}>
                {({ blob, url, loading, error }) => (loading ? 'Carregando...' : 'Baixar PDF')}
            </PDFDownloadLink>
        </div>
    );

    return (
        <>
            <PDF />

            <div className="div-report-listtaxpayer">
                <Load id="divLoading" loading={loading} />
                <table className="table-report-listtaxpayer">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nome</th>
                            <th>Nascimento</th>
                            <th>Endereço</th>
                            <th>Telefone 1</th>
                            <th>Telefone 2</th>
                            <th>E-mail</th>
                            <th>Valor Contrib.</th>
                            <th>Dia Receb.</th>
                        </tr>
                    </thead>

                    <tbody>
                        {taxpayer.map((el, index) => {
                            const { Address, Payment } = el;
                            const cep = Address.cep ? Address.cep : '';
                            const street = Address.street ? Address.street : '';
                            const complement = Address.complement ? Address.complement : '';
                            const district = Address.district ? Address.district : '';
                            const city = Address.city ? Address.city : '';
                            const state = Address.state ? Address.state : '';
                            const number = Address.number ? Address.number : '';

                            return <>
                                <tr key={el.id}>
                                    <td>{index + 1}</td>
                                    <td>{el.name}</td>
                                    <td>{format(new Date(el.birth), 'dd/MM/yyyy')}</td>
                                    <td>{cep}, {street}, {complement}, {number}, {district}, {city}-{state}</td>
                                    <td>{el.phone1}</td>
                                    <td>{el.phone1}</td>
                                    <td>{el.email}</td>
                                    <td>R$ {Payment.value}</td>
                                    <td>{Payment.expiration}</td>
                                </tr>
                            </>
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}