import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Load from '../../components/Load/Load';

import './styles.scss';

import api from '../../services/api';
import ReceiveBydate from '../../components/ReceiveByDate';
import ReceiveByMonth from '../../components/ReceiveByMonth';
import ReceiveByTaxpayer from '../../components/ReceiveByTaxpayer';

export default function User() {
    const history = useHistory();
    const [list, setList] = useState([]); //lista de usuários variável (de acordo com busca no input de pesquisa)
    const [listFull, setListFull] = useState([]); //lista de usuários sempre completa
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(false);

    //carega lista de usuários cadastrados
    useEffect(() => {
        // getUsers();
    }, [])


    async function getUsers() {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            let resp = await api.get('/user', {
                headers: { token }
            });

            resp = resp.data;
            if (resp.status) {
                setListFull(resp.response);
                setList(resp.response);
            }
        }
        catch (error) {
            console.log(error);
        }
        setLoading(false);

    }

    const [selectTab, setSelectTab] = useState(<ReceiveByMonth />);
    function handleSwitTab(opt) {
        let select = '';
        switch (opt) {
            case 1:
                select = <ReceiveByMonth />;
                break;

            case 2:
                select = <ReceiveBydate />;
                break;

            case 3:
                select = <ReceiveByTaxpayer />;
                break;

            default:
                break;
        }

        setSelectTab(select);
    };

    return (
        <div className="content">
            <Load loading={loading} />

            <div className="select-tab">
                <div onClick={() => handleSwitTab(1)}>Mês atual</div>
                <div onClick={() => handleSwitTab(2)}>Escolher data</div>
                <div onClick={() => handleSwitTab(3)}>Escolher contribuinte</div>
            </div>

            {selectTab}
        </div>
    )
}
