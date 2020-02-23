import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import './styles.scss';

import api from '../../services/api';
import Swal from '../../components/SweetAlert/SwetAlert';
import Load from '../../components/Load/Load';

export default function Dashboard() {
    const [donationDate, setDonationDate] = useState([]);
    const [donationValue, setDonationValue] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');
    const options1 = {
        chart: {
            id: "Doação do mês"
        },
        xaxis: {
            categories: donationDate
        },
        title: {
            text: `Doações do mês de ${format(new Date(), 'MMMM - yyyy', {locale: ptBR})} (Total)`
        }
    };

    const series1 = [{
        name: "Total de doações no dia",
        data: donationValue,
    }];

    useEffect(() => {
        async function getInfo() {
            setLoading(true);

            try {
                let resp = await api.get(`/donation/bymonth`, {
                    headers: { token }
                });

                resp = resp.data;

                if (resp.status) {
                    const { donation, taxpayer } = resp.response;

                    const arrayValue = [], arrayPaidIn = [], arrayCtrl = {};
                    let index = 0;

                    donation.forEach(element => {
                        const paidIn = format(new Date(element.paidIn), 'dd/MM/yyyy');
                        if (arrayCtrl[paidIn]) {
                            arrayValue[arrayCtrl[paidIn].index] += element.value;
                        }
                        else {
                            arrayCtrl[paidIn] = { index };
                            arrayValue.push(element.value);
                            arrayPaidIn.push(paidIn);
                            index++;
                        }
                    });

                    setDonationValue(arrayValue);
                    setDonationDate(arrayPaidIn);
                    setPayments(taxpayer);
                }
                else {
                    Swal.swalErrorInform();
                }

            } catch (error) {
                console.log(error)
            }

            setLoading(false);
        }
        getInfo();
    }, [])

    return (
        <div className="content">
            <Load  id="divLoading" loading={loading} />

            <div className="bar-chart">
                <Chart
                    options={options1}
                    series={series1}
                    type="bar"
                    height={window.innerHeight - 375}
                />
            </div>

            <div className="next-due">
                <ul id="nextDue">
                    {payments.map(pay => {
                        const expiration = new Date();
                        const alert = expiration.getDate() > pay.Payment.expiration ? '#ff5a5a' : ''
                        expiration.setDate(pay.Payment.expiration);

                        return <li key={pay.id} className="flex-row" >
                            <div className="flex-col col-left">
                                <span>{pay.name}</span>
                                <div className="flex-row-w">
                                    <span>{pay.phone1} - </span>
                                    <span> - {pay.phone2}</span>
                                </div>
                            </div>
                            <div className="flex-col col-right">
                                <b style={{ color: alert }}>{format(expiration, 'dd-MM-yyyy')}</b>
                                <b>R${pay.Payment.value}</b>
                            </div>
                        </li>
                    })}
                </ul>
            </div>
        </div>
    )
}