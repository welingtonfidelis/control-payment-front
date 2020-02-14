import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import MenuDrop from '../../components/MenuDropDown/OptionList';

import api from '../../services/api';
import Load from '../../components/Load/Load';
import Swal from '../../components/SweetAlert/SwetAlert';

import './styles.scss';
import ImageProfile from '../../assets/images/user.png';

export default function User() {
    const history = useHistory();
    const [list, setList] = useState([]); //lista de usuários variável (de acordo com busca no input de pesquisa)
    const [listFull, setListFull] = useState([]); //lista de usuários sempre completa
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(false);

    //carega lista de usuários cadastrados
    useEffect(() => {
        getUsers();
    }, [])

    //filtra usuários por nomes digitados na busca
    useEffect(() => {
        if (filter !== '') {
            const filtred = listFull.filter((obj) => {
                obj.search = (obj.name ? obj.name.toLowerCase() : '')
                    + ' ' + (obj.cellphone ? obj.cellphone.toLowerCase() : '')
                    + ' ' + (obj.email ? obj.email.toLowerCase() : '')
                    + ' ' + (obj.Address.street ? obj.Address.street.toLowerCase() : '')
                    + ' ' + (obj.Address.district ? obj.Address.district.toLowerCase() : '')
                    + ' ' + (obj.Address.state ? obj.Address.state.toLowerCase() : '')
                    + ' ' + (obj.Address.city ? obj.Address.city.toLowerCase() : '')

                return ((obj.search).indexOf(filter.toLowerCase()) > -1);
            })

            setList(filtred);
        }
        else setList(listFull);

    }, [filter])

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
            else {
                Swal.swalErrorInform();
            }
        }
        catch (error) {
            console.log(error);
        }
        setLoading(false);
        
    }

    //abre modal para cadastro de novo usuário
    function handleModal() {
        history.push('/main/modaluser');
    }

    //recarrega lista de usuários quando há exclusão
    function handleRefreshList(){
        getUsers();
    }

    return (
        <div className="content">
            <Load  id="divLoading" loading={loading} />

            <div className="search-bar">
                <input
                    placeholder="Procurar usuário"
                    value={filter}
                    onChange={event => setFilter(event.target.value)}
                />

                <div className="btn-new-medium" title="Cadastrar novo usuário">
                    <div type="button" id="btn" onClick={() => handleModal()}>
                        NOVO
                    </div>
                </div>

            </div>

            <ul className="simple-list-1">
                {list.map(user =>
                    <li key={(user.id).toString()} data-id={user.id}>
                        <div className="image-profile-mini">
                            <img src={ImageProfile} alt="Foto perfil" />
                        </div>

                        <div className="simple-info-1">
                            <h2>{user.name}</h2>
                            <span>{user.cellphone}</span>
                        </div>

                        <div>
                            <MenuDrop type="user" id={user.id} refresh={handleRefreshList}/>
                        </div>
                    </li>
                )}
            </ul>
        </div>
    )
}
