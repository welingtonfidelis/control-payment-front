import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";
import dateFormat from 'dateformat';

import './styles.scss';

import api from '../../services/api';

export default function Dashboard() {
    const [donationDate, setDonationDate] = useState([]);
    const [donationValue, setDonationValue] = useState([]);
    const [agentSale, setAgentSale] = useState([]);
    const [agentName, setAgentName] = useState([]);
    const [payment, setPayment] = useState([]);

    //seta formato de data para padrão brasileiro
    dateFormat.i18n = {
        dayNames: [
            'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab',
            'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'
        ],
        monthNames: [
            'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto',
            'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ],
        timeNames: [
            'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
        ]
    };

    useEffect(() => {
        const donations = [
            { createdAt: '2020-01-01 15:20:00', value: 50.60 },
            { createdAt: '2020-01-03 15:20:00', value: 75.60 },
            { createdAt: '2020-01-05 15:20:00', value: 50.60 },
            { createdAt: '2020-01-07 15:20:00', value: 95.60 },
            { createdAt: '2020-01-10 15:20:00', value: 170.60 },
            { createdAt: '2020-01-12 15:20:00', value: 120.60 },
            { createdAt: '2020-01-15 15:20:00', value: 250.60 },
        ];

        const payments = [
            { id: 1, value: 50.25, expiration: 15, 
                taxpayer: {name: 'Contribuinte 1', phone1: '(35) 9999991516'}},
            { id: 2, value: 50.25, expiration: 19, 
                taxpayer: {name: 'Contribuinte 2', phone1: '(35) 9999991516'}},
            { id: 3, value: 50.25, expiration: 19, 
                taxpayer: {name: 'Contribuinte 3', phone1: '(35) 9999991516'}},
            { id: 4, value: 50.25, expiration: 22, 
                taxpayer: {name: 'Contribuinte 4', phone1: '(35) 9999991516'}},
            { id: 5, value: 50.25, expiration: 23, 
                taxpayer: {name: 'Contribuinte 5', phone1: '(35) 9999991516'}},
        ]

        const arrayTmp1 = [], arrayTmp2 = [];
        donations.forEach(element => {
            arrayTmp1.push(element.value);
            arrayTmp2.push(dateFormat(new Date(element.createdAt), 'dd/mm/yyyy'));
        });
        setDonationValue(arrayTmp1);
        setDonationDate(arrayTmp2);

        setPayment(payments);
    }, [])

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