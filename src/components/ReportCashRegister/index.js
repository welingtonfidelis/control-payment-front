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
import Switch from 'react-switch';

import api from '../../services/api';
import Load from '../Load/Load';
import Swal from '../SweetAlert/SwetAlert';
import ReportDonationPdf from '../Donation/index';

import './styles.scss';

export default function DonationByDate() {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [donationDate, setDonationDate] = useState([]);
    const [registerValue, setRegisterValue] = useState([]);
    const [cashregisters, setCashRegisters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [typeGroup, setTypeGroup] = useState(true);
    const [typeIn, setTypeIn] = useState(true);
    const [typeOut, setTypeOut] = useState(true);
    const [typeDonation, setTypeDonation] = useState(true);
    const [totalDonation, setTotalDonation] = useState(0);
    const options1 = {
        chart: {
            id: "Registro do mês"
        },
        xaxis: {
            categories: donationDate
        },
        title: {
            text: `Registros de caixa do mês de 
                ${format(startDate, 'MMMM - yyyy', { locale: ptBR })} à  
                ${format(endDate, 'MMMM - yyyy', { locale: ptBR })}`
        }
    };

    const series1 = [{
        name: "Total de doações neste mẽs",
        data: registerValue,
    }];

    useEffect(() =>{
        console.log(typeIn);
        
    }, [typeIn]);

    async function handleSearch() {
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const start = format(startDate, 'yyyy-MM-dd');
            const end = format(endDate, 'yyyy-MM-dd');

            const resp = await api.get(`/cashregister/byfilter`, {
                headers: { token }, params: { start, end, type: 'in, out' }
            });
            const { status } = resp.data;

            if (status) {
                const { response } = resp.data;

                console.log(response);

                // let tmp = 0;
                // response.forEach((el) => {
                //     tmp += el.value;
                // });

                // setTotalDonation(tmp);
                // setDonations(response);
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
    // useEffect(() => {
    //     handleBuildData();
    // }, [donations, typeGroup]);

    // function handleBuildData() {
    //     const arrayValue = [], arrayPaidIn = [], arrayCtrl = {},
    //         dtFormat = typeGroup ? 'MMMM - yyyy' : 'dd/MM/yyyy';
    //     let index = 0;

    //     donations.forEach(element => {
    //         const paidIn = format(new Date(element.paidIn), dtFormat);
    //         if (arrayCtrl[paidIn]) {
    //             arrayValue[arrayCtrl[paidIn].index] += element.value;
    //         }
    //         else {
    //             arrayCtrl[paidIn] = { index };
    //             arrayValue.push(element.value);
    //             arrayPaidIn.push(paidIn);
    //             index++;
    //         }
    //     });

    //     setDonationValue(arrayValue);
    //     setDonationDate(arrayPaidIn);
    // }

    return (
        <>
            {/* <ReportDonationPdf
                startDate={startDate}
                endDate={endDate}
                receives={donations}
            >
            </ReportDonationPdf> */}
            <div className="flex-col-h">
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

                <FormGroup row>
                    <FormControlLabel
                        control={
                            <Checkbox 
                                checked={typeIn} 
                                onChange={event => setTypeIn(event.target.checked)} 
                                value={typeIn} 
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
                            />
                        }
                        label="Doações"
                    />
                </FormGroup>
            </div>

            {/* <div className="bar-chart">
                <Chart
                    options={options1}
                    series={series1}
                    type="bar"
                    height={window.innerHeight - 297}
                />
            </div> */}
        </>
    )
}