import React, { useState } from 'react';
import { format } from 'date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";
import { ptBR } from 'date-fns/locale';
import Receive from '../Receive';

import api from '../../services/api';
import Swal from '../SweetAlert/SwetAlert'
import Load from '../Load/Load';

import './styles.scss';

export default function ReceivaByDate() {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [receives, setReceives] = useState([]);
    const [loading, setLoading] = useState(false);

    async function handleSearch() {
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const start = format(startDate, 'yyyy-MM-dd');
            const end = format(endDate, 'yyyy-MM-dd');

            let resp = await api.get(`/receive/bydate?start=${start}&end=${end}`, {
                headers: { token }
            });
            const { status } = resp.data;

            if (status) {
                const { response } = resp.data;
                setReceives(response);
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
            <div className="flex-row-w container-select-date">
                <Load id="divLoading" loading={loading} />

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
                    < div
                        className="btn-search"
                        onClick={() => handleSearch()}
                    >
                        Buscar
                    </div>
                </div>
            </div>
            <Receive receives={receives} />
        </>
    )
}