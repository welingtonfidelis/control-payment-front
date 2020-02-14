import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import dateFormat from 'dateformat';

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
                    start: startDate,
                    end: endDate,
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
                            paidIn: dateFormat(el.paidIn, 'dd/mm/yyyy'),
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
                                paidIn: dateFormat(el.paidIn, 'dd/mm/yyyy'),
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

                <div className="flex-row-w content-report-div2">
                    <div className="content-report-taxpayer">
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
                    <div className="content-report-taxpayer">
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

                    <div
                        className="btn-new-medium btn-report-search"
                        onClick={() => handleSearch()}
                    >
                        Buscar
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
                                    return <div key={elem.id} className="simple-list-3-content">
                                        <div style={{flex: 1}} id="list3content" >{elem.paidIn}</div>
                                        <div style={{flex: 1}} id="list3content" >R${elem.value}</div>
                                        <div style={{flex: 2}} id="list3content" >{elem.observation}</div>
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