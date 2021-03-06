import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Receive from '../Receive';

import api from '../../services/api';
import Load from '../Load/Load';
import Swal from '../SweetAlert/SwetAlert';

import './styles.scss';

export default function ReceivaByTaxpayer() {
    const [taxpayer, setTaxpayer] = useState([]);
    const [receives, setReceives] = useState([]);
    const [optTaxpayer, setOptTaxpayer] = useState([]);
    const [loading, setLoading] = useState(false);
    const [token] = useState(localStorage.getItem('token'));

    useEffect(()=>{
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

            let resp = await api.get(`/receive/bytaxpayer`, {
                headers: { token },
                params: { 
                    arrayTaxpayerId:taxpayerTmp 
                }
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
        <div className="flex-col-h">
            <div className="flex-row-w container-select-date">
                <Load  id="divLoading" loading={loading} />
    
                <div className="content-receive-taxpayer">
                    <label htmlFor="taxpayersId">Contribuinte</label>
                    <Select
                        className="select-default"
                        onChange={data => setTaxpayer(data)}
                        value={taxpayer}
                        isMulti
                        id="taxpayersId"
                        options={optTaxpayer}
                        classNamePrefix="select_receive_taxpayer"
                    />
                </div>
                    
                <div className="btn-search" onClick={() => handleSearch()}>Buscar</div>
            </div>
            <Receive receives={receives} />
        </div>
    )
}