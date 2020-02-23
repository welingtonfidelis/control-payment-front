import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

import api from '../../services/api';
import Load from '../Load/Load';
import Swal from '../SweetAlert/SwetAlert';

import './styles.scss';
import ImageProfile from '../../assets/images/user.png';

export default function ReportByTaxpayer() {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [optTaxpayer, setOptTaxpayer] = useState([]);
    const [taxpayer, setTaxpayer] = useState([]);
    const [loading, setLoading] = useState(false);
    const [donations, setDonations] = useState([]);
    const [token] = useState(localStorage.getItem('token'));

    useEffect(() => {
        async function getInfo() {
            setLoading(true);

            try {
                let resp = await api.get('/taxpayer', {
                    headers: { token }
                });

                resp = resp.data

                let tmp = [];
                (resp.response).forEach(el => {
                    tmp.push({ value: el.id, label: el.name, payment: el.Payment.value });
                });
                setOptTaxpayer(tmp)

            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        }

        getInfo();
    }, [token]);

    async function handleSearch() {
        setLoading(true);

        try {
            let taxpayerTmp = [];
            taxpayer.forEach(el => {
                taxpayerTmp.push(el.value);
            });
            taxpayerTmp = JSON.stringify(taxpayerTmp);

            let resp = await api.get(`/donation/bytaxpayer`, {
                headers: { token },
                params: {
                    start: format(startDate, 'yyyy-MM-dd'),
                    end: format(endDate, 'yyyy-MM-dd'),
                    arrayTaxpayerId: taxpayerTmp
                }
            });
            const { status } = resp.data;

            if (status) {
                const { response } = resp.data;
                let arrayCtrl = [];

                response.forEach(el => {
                    if (arrayCtrl[el.TaxpayerId]) {
                        arrayCtrl[el.TaxpayerId].donation.push({
                            id: el.id,
                            value: el.value,
                            paidIn: format(new Date(el.paidIn), 'dd/MM/yyyy'),
                            observation: el.observation
                        });
                    }
                    else {
                        arrayCtrl[el.TaxpayerId] = {
                            id: el.TaxpayerId,
                            name: el.Taxpayer.name,
                            donation: [{
                                id: el.id,
                                value: el.value,
                                paidIn: format(new Date(el.paidIn), 'dd/MM/yyyy'),
                                observation: el.observation
                            }]
                        }
                    }
                });
                arrayCtrl = arrayCtrl.filter(el => {
                    if (el) return el;
                })
                console.log(arrayCtrl);

                setDonations(arrayCtrl);

            }
            else {
                Swal.swalErrorInform();
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    return (
        <>
            <div className="flex-col-h container-report-taxpayer">
                <Load id="divLoading" loading={loading} />

                <div className="content-report-taxpayer">
                    <label htmlFor="taxpayersId">Contribuinte</label>
                    <Select
                        className="select-default"
                        onChange={data => setTaxpayer(data)}
                        value={taxpayer}
                        isMulti
                        id="taxpayersId"
                        options={optTaxpayer}
                        classNamePrefix="select_report_taxpayer"
                    />
                </div>

                <div className="flex-row-w container-select-date">
                    <div className="content-select-date-left">
                        <div className="content-select-date">
                            <label htmlFor="dateStart">Data inicial</label>
                            <div className="keyboardpicker-modal-taxpayer">
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
                                    <KeyboardDatePicker
                                        className="nomargin-datepicker"
                                        id="date-picker-dialog"
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
                                        id="date-picker-dialog"
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
            </div>

            <ul className="simple-list-3">
                {donations.map(el => {
                    const { donation } = el;
                    return <>
                        <li key={(el.id)}>
                            <div className="flex-row-w">
                                <div className="image-profile-mini">
                                    <img src={ImageProfile} alt="Foto perfil" />
                                </div>

                                <div className="simple-info-1">
                                    <h2>{el.name}</h2>
                                </div>
                            </div>

                            <div className="simple-list-3-container">
                                {donation.map(elem => {
                                    return <div key={(elem.id)} className="simple-list-3-content">
                                        <div style={{ flex: 1 }}>{elem.paidIn}</div>
                                        <div style={{ flex: 1 }}>R${elem.value}</div>
                                        <div style={{ flex: 2 }}>{elem.observation}</div>
                                    </div>
                                })}
                            </div>

                        </li>
                    </>
                })}
            </ul>
        </>
    )
}