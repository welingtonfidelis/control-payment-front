import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import dateFormat from 'dateformat'
import Receive from '../Receive';

import api from '../../services/api';
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
            const start = dateFormat(startDate, 'yyyy-mm-dd');
            const end = dateFormat(endDate, 'yyyy-mm-dd');

            let resp = await api.get(`/receive/bydate?start=${start}&end=${end}`, {
                headers: { token }
            });
            const { status } = resp.data;

            if (status) {
                const { response } = resp.data;
                setReceives(response);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    return (
        <div className="flex-col-h">
            <div className="flex-row-w container-receive-date">
                <Load  id="divLoading" loading={loading} />
    
                <div className="content-receive-date">
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
                <div className="content-receive-date">
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
    
                <div className="btn-new-medium btn-receive-search" onClick={() => handleSearch()}>Buscar</div>
            </div>
            <Receive receives={receives} />
        </div>
    )
}