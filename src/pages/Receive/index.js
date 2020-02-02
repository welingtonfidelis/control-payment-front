import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import MenuDrop from '../../components/MenuDropDown/OptionList';
import Load from '../../components/Load/Load';

import './styles.scss';

import api from '../../services/api';
import ReceiveBydate from '../../components/ReceiveByDate';
import ReceiveByMonth from '../../components/ReceiveByMonth';
import ReceiveByTaxpayer from '../../components/ReceiveByTaxpayer';
import ImageProfile from '../../assets/user.png';

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

    return (
        <div className="content">
            <Load loading={loading} />


        </div>
    )
}
