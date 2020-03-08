import React, { useState, useEffect } from 'react';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import {
    Checkbox, FormGroup, FormControlLabel
} from '@material-ui/core'
import DateFnsUtils from "@date-io/date-fns";
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import Chart from "react-apexcharts";

import api from '../../services/api';
import Load from '../Load/Load';
import Swal from '../SweetAlert/SwetAlert';
import ReportPDF from '../ReportCashRegisterPDF/index';

import './styles.scss';

export default function DonationByDate() {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [registerOpt, setRegisterOpt] = useState([]);
    const [cashregisters, setCashRegisters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [typeIn, setTypeIn] = useState(true);
    const [typeOut, setTypeOut] = useState(true);
    const [typeDonation, setTypeDonation] = useState(true);
    const [totalIn, setTotalIn] = useState(0);
    const [totalOut, setTotalOut] = useState(0);
    const options1 = {
        chart: {
            id: "Registros de caixa",
            stacked: true,
        },
        title: {
            text: `Registros de caixa no período de  
                ${format(startDate, 'dd/MM/yyyy', { locale: ptBR })} à  
                ${format(endDate, 'dd/MM/yyyy', { locale: ptBR })}
                (Entr. total: R$${totalIn} - Saída total: R$${totalOut})`
        },
        plotOptions: {
            bar: {
                horizontal: false,
            },
        },
        legend: {
            position: 'right',
            offsetY: 60
        },
        xaxis: {
            categories: ['Entrada', 'Saída']
        }
    };

    const series1 = registerOpt;

    useEffect(() => {
        console.log(typeIn);

    }, [typeIn]);

    async function handleSearch() {
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const start = format(startDate, 'yyyy-MM-dd');
            const end = format(endDate, 'yyyy-MM-dd');

            const resp = await api.get(`/cashregister/byfilter`, {
                headers: { token }, params: { start, end, typeIn, typeOut, typeDonation }
            });
            const { status } = resp.data;

            if (status) {
                const { response } = resp.data;
                setCashRegisters(response);
            }
            else {
                Swal.swalErrorInform();
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    //dispara carregamento dos dados para o gráfico quando a busca é finalizada
    useEffect(() => {
        handleBuildData();
    }, [cashregisters]);

    function handleBuildData() {
        const arrayValue = [
            {
                name: 'Doação',
                data: [0, 0]
            },
            {
                name: 'Entrada',
                data: [0, 0]
            },
            {
                name: 'Saída',
                data: [0, 0]
            },
        ];

        cashregisters.forEach(element => {
            switch (element.type) {
                case 'don':
                    arrayValue[0].data[0] += element.value;
                    setTotalIn(totalIn + element.value);
                    break;
                case 'in':
                    arrayValue[1].data[0] += element.value;
                    setTotalIn(totalIn + element.value);
                    break;
                case 'out':
                    arrayValue[2].data[1] += element.value;
                    setTotalOut(totalOut + element.value);
                    break;

                default:
                    break;
            }
        });

        setRegisterOpt(arrayValue);
    }

    return (
        <>
            <ReportPDF
                startDate={startDate}
                endDate={endDate}
                receives={cashregisters}
            >
            </ReportPDF>
            <div className="flex-col-h container-select-date">
                <div className="flex-row-w ">
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
                    </div>
                </div>

                <FormGroup row>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={typeIn}
                                onChange={event => setTypeIn(event.target.checked)}
                                value={typeIn}
                                color='primary'
                            />
                        }
                        label="Entrada"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={typeOut}
                                onChange={event => setTypeOut(event.target.checked)}
                                value={typeOut}
                                color='primary'
                            />
                        }
                        label="Saída"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={typeDonation}
                                onChange={event => setTypeDonation(event.target.checked)}
                                value={typeDonation}
                                color='primary'
                            />
                        }
                        label="Doações"
                    />
                </FormGroup>
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