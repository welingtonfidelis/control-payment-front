import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import dateFormat from 'dateformat'
import Receive from '../Receive';

import api from '../../services/api';
import Load from '../Load/Load';

import './styles.scss';

export default function ReceivaByTaxpayer() {
    const [taxpayer, setTaxpayer] = useState([]);
    const [receives, setReceives] = useState([]);
    const [optTaxpayer, setOptTaxpayer] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

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
              console.log(tmp);
              
        
            } catch (error) {
              console.log(error);
            }
            setLoading(false);
          }

          getInfo();
    }, []);

    async function handleSearch() {
        setLoading(true);

        console.log(taxpayer);
        
        try {
            let taxpayerTmp = [];
            taxpayer.forEach(el => {
                taxpayerTmp.push(el.value);
            });
            taxpayerTmp = JSON.stringify(taxpayerTmp);

            let resp = await api.get(`/receive/bytaxpayer?arrayTaxpayerId=${taxpayerTmp}`, {
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
            <div className="flex-row-w container-receive-taxpayer">
                <Load  id="divLoading" loading={loading} />
    
                <div className="content-receive-taxpayer">
                    <label htmlFor="taxpayersId">Data inicial</label>
                    <Select
                        className="select-default"
                        onChange={data => setTaxpayer(data)}
                        value={taxpayer}
                        isMulti
                        id="taxpayersId"
                        options={optTaxpayer}
                        classNamePrefix="select"
                    />
                </div>
                    
                <div className="btn-new-medium btn-receive-search" onClick={() => handleSearch()}>Buscar</div>
            </div>
            <Receive receives={receives} />
        </div>
    )
}