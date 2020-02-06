import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";
import dateFormat from 'dateformat';

import './styles.scss';

import api from '../../services/api';
import Swal from '../../components/SweetAlert/SwetAlert';
import Load from '../../components/Load/Load';

export default function Dashboard() {
    const [donationDate, setDonationDate] = useState([]);
    const [donationValue, setDonationValue] = useState([]);
    const [payment, setPayment] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        getDonations();
        getReceives();

        const payments = [
            {
                id: 1, value: 50.25, expiration: 15,
                taxpayer: { name: 'Contribuinte 1', phone1: '(35) 9999991516' }
            },
            {
                id: 2, value: 50.25, expiration: 19,
                taxpayer: { name: 'Contribuinte 2', phone1: '(35) 9999991516' }
            },
            {
                id: 3, value: 50.25, expiration: 19,
                taxpayer: { name: 'Contribuinte 3', phone1: '(35) 9999991516' }
            },
            {
                id: 4, value: 50.25, expiration: 22,
                taxpayer: { name: 'Contribuinte 4', phone1: '(35) 9999991516' }
            },
            {
                id: 5, value: 50.25, expiration: 23,
                taxpayer: { name: 'Contribuinte 5', phone1: '(35) 9999991516' }
            },
        ]

        setPayment(payments);
    }, [])

    async function getDonations() {
        setLoading(true);

        try {
            let resp = await api.get(`/donation/bymonth`, {
                headers: { token }
            });

            resp = resp.data;

            if(resp.status){
                const { response } = resp;

                const arrayTmp1 = [], arrayTmp2 = [], arrayCtrl = [];
                response.forEach(element => {
                    arrayTmp1.push(element.value);
                    arrayTmp2.push(dateFormat(new Date(element.paidIn), 'dd/mm/yyyy'));
                });
                setDonationValue(arrayTmp1);
                setDonationDate(arrayTmp2);
            }
            else{
                Swal.swalErrorInform();
            }
            
        } catch (error) {
            console.log(error)
        }

        setLoading(false);
    }

    async function getReceives(){
        setLoading(true);
        const today = new Date();
        const start = dateFormat(today, 'dd/mm/yyyy');
        const end = dateFormat(new Date(today.setDate(today.getDate() + 7)), 'dd/mm/yyyy');

        try {
            let resp = await api.get(`/receive/bydate`, {
                headers: { token },
                params: { start, end}
            });

            resp = resp.data;
            console.log(resp);

            // if(resp.status){
            //     const { response } = resp;

            //     const arrayTmp1 = [], arrayTmp2 = [], arrayCtrl = [];
            //     response.forEach(element => {
            //         arrayTmp1.push(element.value);
            //         arrayTmp2.push(dateFormat(new Date(element.paidIn), 'dd/mm/yyyy'));
            //     });
            //     setDonationValue(arrayTmp1);
            //     setDonationDate(arrayTmp2);
            // }
            // else{
            //     Swal.swalErrorInform();
            // }
            
        } catch (error) {
            console.log(error)
        }

        setLoading(false);
    }

    const options1 = {
        chart: {
            id: "Doação do mês"
        },
        xaxis: {
            categories: donationDate
        },
        title: {
            text: `Doações do mês de ${dateFormat(new Date(), 'mmmm - yyyy')} (Total)`
        }
    };

    const series1 = [{
        name: "Total de doações no dia",
        data: donationValue,
    }]

    return (
        <div className="content">
            <Load loading={loading} />

            <div className="bar-chart">
                <Chart
                    options={options1}
                    series={series1}
                    type="bar"
                    height="350px"
                />
            </div>

            <div className="next-due">
                <ul>
                    {payment.map(pay => (
                        <li key={pay.id} className="flex-row">
                            <div className="flex-col col-left">
                                <span>{pay.taxpayer.name}</span>
                                <span>{pay.taxpayer.phone1}</span>
                            </div>
                            <div className="flex-col col-right">
                                <b>{dateFormat(pay.value, 'dd-mm-yyyy')}</b>
                                <b>R${pay.value}</b>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}