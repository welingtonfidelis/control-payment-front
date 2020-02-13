import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import dateFormat from 'dateformat'
import Chart from "react-apexcharts";
import Switch from 'react-switch';

import api from '../../services/api';
import Load from '../../components/Load/Load';

import './styles.scss';

export default function ReceivaByDate() {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [donationDate, setDonationDate] = useState([]);
    const [donationValue, setDonationValue] = useState([]);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [typeGroup, setTypeGroup] = useState(true);
    const options1 = {
        chart: {
            id: "Doação do mês"
        },
        xaxis: {
            categories: donationDate
        },
        title: {
            text: `Doações do mês de 
                ${dateFormat(startDate, 'mmmm - yyyy')} à  
                ${dateFormat(endDate, 'mmmm - yyyy')}`
        }
    };

    const series1 = [{
        name: "Total de doações neste mẽs",
        data: donationValue,
    }];

    async function handleSearch() {
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const start = dateFormat(startDate, 'yyyy-mm-dd');
            const end = dateFormat(endDate, 'yyyy-mm-dd');

            const resp = await api.get(`/donation/bydate?start=${start}&end=${end}`, {
                headers: { token }
            });
            const { status } = resp.data;

            if (status) {
                const { response } = resp.data;

                setDonations(response);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    //dispara carregamento dos dados para o gráfico quando a busca (setDonations) é finalizado
    useEffect(() => {
        handleBuildData();
    }, [donations, typeGroup]);

    function handleBuildData() {
        const arrayValue = [], arrayPaidIn = [], arrayCtrl = {},
            dtFormat = typeGroup ? 'mmmm - yyyy' : 'dd/mm/yyyy';
        let index = 0;

        donations.forEach(element => {
            const paidIn = dateFormat(new Date(element.paidIn), dtFormat);
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
    }

    return (
        <div className="content">
            <div className="flex-col-h">
                <div className="flex-row-w container-report-date">

                    <div className="content-report-left">
                        <Load id="divLoading" loading={loading} />

                            <div className="content-report-date">
                                <label htmlFor="dateStart">Data inicial</label>
                                <DatePicker
                                    id="dateStart"
                                    locale="pt"
                                    onChange={date => setStartDate(date)}
                                    selected={startDate}
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    dateFormat="dd/MM/yyyy"
                                />
                            </div>
                            <div className="content-report-date">
                                <label htmlFor="dateEnd">Data inicial</label>
                                <DatePicker
                                    id="dateEnd"
                                    locale="pt"
                                    onChange={date => setEndDate(date)}
                                    selected={endDate}
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    dateFormat="dd/MM/yyyy"
                                />
                            </div>

                            <div className="btn-new-medium btn-report-search" onClick={() => handleSearch()}>Buscar</div>
                

                    </div>                
                    <div className="content-report-right">
                        <label className="switch-report-search">
                            <span>Agrupar por {typeGroup ? 'mês' : 'dia'}</span>
                            <Switch
                                onChange={() => setTypeGroup(!typeGroup)}
                                checked={typeGroup}
                                onColor='#0e78fa'
                            />
                        </label>
                    </div>
                </div>

                <div className="bar-chart">
                    <Chart
                        options={options1}
                        series={series1}
                        type="bar"
                        height={window.innerHeight - 195}
                    />
                </div>
                {/* <report reports={reports} /> */}
            </div>
        </div>
    )
}