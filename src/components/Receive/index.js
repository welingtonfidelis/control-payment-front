import React from 'react';
import dateFormat from 'dateformat';
import { PDFDownloadLink, BlobProvider } from '@react-pdf/renderer';

import { PdfDocument } from '../../services/Pdf/receive';

import './styles.scss';

import ImageLogo from '../../assets/logo-patas.png';

export default function Receive({ receives }) {
    console.log(receives);
    const today = new Date();

    return (
        <div>
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
                            R$ <strong>{value}</strong>,
                                    referente à contribuição do mês de
                            <strong> {dateFormat(today, 'mmmm')}</strong>.</p>
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

            {/* <BlobProvider
                document={<PdfDocument/>}
            >
                {({ url }) => (
                   <a href={url} target="_blank">Open in new tab</a>
                )}
            </BlobProvider> */}

            {/* <PDFDownloadLink
                document={<PdfDocument receives={receives}/>}
                fileName="teste.pdf"
                style={{
                    textDecoration: "none",
                    padding: "10px",
                    color: "#4a4a4a",
                    backgroundColor: "#f2f2f2",
                    border: "1px solid #4a4a4a"
                }}
            >
                BAIXAR PDF
            </PDFDownloadLink> */}
        </div>
    )
}