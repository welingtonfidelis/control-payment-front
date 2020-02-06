import React, { useEffect, useState } from 'react';
import dateFormat from 'dateformat';
import { useHistory } from 'react-router-dom';
import MenuDrop from '../../components/MenuDropDown/OptionList';
import Load from '../../components/Load/Load';

import './styles.scss';

import api from '../../services/api';

import ImageProfile from '../../assets/user.png';

export default function Donation() {
    const history = useHistory();
    const [list, setList] = useState([]); //lista de usuários variável (de acordo com busca no input de pesquisa)
    const [listFull, setListFull] = useState([]); //lista de usuários sempre completa
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(false);

    //carega lista de usuários cadastrados
    useEffect(() => {
        getDonations();
    }, [])

    //filtra usuários por nomes digitados na busca
    useEffect(() => {
        if (filter !== '') {
            const filtred = listFull.filter((obj) => {
                const { Taxpayer } = obj, { Address } = Taxpayer;

                obj.search = (Taxpayer.name ? Taxpayer.name.toLowerCase() : '')
                    + ' ' + (Taxpayer.phone1 ? Taxpayer.phone1 : '')
                    + ' ' + (Taxpayer.phone2 ? Taxpayer.phone2 : '')
                    + ' ' + (Address.street ? Address.street.toLowerCase() : '')
                    + ' ' + (Address.district ? Address.district.toLowerCase() : '')
                    + ' ' + (Address.state ? Address.state.toLowerCase() : '')
                    + ' ' + (Address.city ? Address.city.toLowerCase() : '')
                    + ' ' + (obj.value ? obj.value : '')
                    + ' ' + (obj.paidIn ? obj.paidIn : '')

                return ((obj.search).indexOf(filter.toLowerCase()) > -1);
            })

            setList(filtred);
        }
        else setList(listFull);

    }, [filter])

    async function getDonations() {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            let resp = await api.get('/donation', {
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

    //abre modal para cadastro de novo usuário
    function handleModal() {
        history.push('/main/modalDonation');
    }

    //recarrega lista de usuários quando há exclusão
    function handleRefreshList(){
        getDonations();
    }

    return (
        <div className="content">
            <Load loading={loading} />

            <div className="search-bar">
                <input
                    placeholder="Procurar doação"
                    value={filter}
                    onChange={event => setFilter(event.target.value)}
                />

                <div className="btn-new-medium" title="Cadastrar nova doação">
                    <div type="button" id="btn" onClick={() => handleModal()}>
                        NOVO
                    </div>
                </div>

            </div>

            <ul className="simple-list-1">
                {list.map(donation => {
                    const { Taxpayer } = donation;
                    const today = new Date(donation.paidIn);

                    return <li key={donation.id} data-id={donation.id}>
                        <div className="image-profile-mini">
                            <img src={ImageProfile} alt="Foto perfil" />
                        </div>

                        <div className="simple-info-1">
                            <h2>{Taxpayer.name}</h2>
                            <span>
                                R$ {donation.value} - 
                                 {dateFormat(today, 'dd/mm/yyyy HH:MM')}
                            </span>
                        </div>

                        <div>
                            <MenuDrop type="donation" id={donation.id} refresh={handleRefreshList}/>
                        </div>
                    </li>
                })}
            </ul>
        </div>
    )
}
