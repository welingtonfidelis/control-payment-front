import React, { useState, useEffect } from 'react';
import Receive from '../Receive';

import api from '../../services/api';
import Load from '../Load/Load';

export default function ReceiveByMonth() {
    const [receives, setReceives] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function getInfo() {
            setLoading(true);
            
            try {
                const token = localStorage.getItem('token');
    
                let resp = await api.get('/receive/month', {
                    headers: { token }
                });
                const { status } = resp.data;
                
                if(status){
                    const { response } = resp.data;
                    setReceives(response);
                }
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        };
        getInfo();

    }, []);

    return (
        <div>
            <Load loading={loading} />
            <Receive receives={receives}/>
        </div>
    )
}