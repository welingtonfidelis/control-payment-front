import React, { useState, useEffect } from 'react';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import Chart from "react-apexcharts";
import Switch from 'react-switch';

import api from '../../services/api';
import Load from '../../components/Load/Load';
import Swal from '../../components/SweetAlert/SwetAlert';

import './styles.scss';

export default function ReportByDate() {
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
                ${format(startDate, 'MMMM - yyyy', { locale: ptBR })} à  
                ${format(endDate, 'MMMM - yyyy', { locale: ptBR })}`
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
            const start = format(startDate, 'yyyy-MM-dd');
            const end = format(endDate, 'yyyy-MM-dd');

            const resp = await api.get(`/donation/bydate?start=${start}&end=${end}`, {
                headers: { token }
            });
            const { status } = resp.data;

            if (status) {
                const { response } = resp.data;

                setDonations(response);
            }
            else {
                Swal.swalErrorInform();
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
            dtFormat = typeGroup ? 'MMMM - yyyy' : 'dd/MM/yyyy';
        let index = 0;

        donations.forEach(element => {
            const paidIn = format(new Date(element.paidIn), dtFormat);
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
        <>
            <div className="flex-row-w container-select-date">
                <div className="content-select-date-left">
                    <Load id="divLoading" loading={loading} />

                    <div className="content-select-date">
                        <label htmlFor="dateStart">Data inicial</label>
                        <div className="keyboardpicker-modal-taxpayer">
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
                                <KeyboardDatePicker
                                    className="nomargin-datepicker"
                                    
                                    format="dd/MM/yyyy"
                                    value={startDate}
                                    onChange={date => setStartDate(date)}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    cancelLabel="SAIR"
                                />
                            </MuiPickersUtilsProvider>
                        </div>
                    </div>
                    <div className="content-select-date">
                        <label htmlFor="dateEnd">Data inicial</label>
                        <div className="keyboardpicker-modal-taxpayer">
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
                                <KeyboardDatePicker
                                    className="nomargin-datepicker"
                                    
                                    format="dd/MM/yyyy"
                                    value={endDate}
                                    onChange={date => setEndDate(date)}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    cancelLabel="SAIR"
                                />
                            </MuiPickersUtilsProvider>
                        </div>
                    </div>
                </div>

                <div className="content-select-date-right">
                    <div
                        className="btn-search"
                        onClick={() => handleSearch()}
                    >
                        Buscar
                    </div>
                    <label className="switch-report-search">
                        <Switch
                            onChange={() => setTypeGroup(!typeGroup)}
                            checked={typeGroup}
                            onColor='#0e78fa'
                        />
                        <span>Agrupar por {typeGroup ? 'mês' : 'dia'}</span>
                    </label>
                </div>
            </div>

            <div className="bar-chart">
                <Chart
                    options={options1}
                    series={series1}
                    type="bar"
                    height={window.innerHeight - 297}
                />
            </div>
        </>
    )
}