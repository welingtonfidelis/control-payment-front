import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useHistory } from 'react-router-dom';
import MenuDrop from '../../components/MenuDropDown/OptionList';

import api from '../../services/api';
import Load from '../../components/Load/Load';
import Swal from '../../components/SweetAlert/SwetAlert';

import './styles.scss';
import ImageCashIn from '../../assets/images/cashregister_in.png';
import ImageCashOut from '../../assets/images/cashregister_out.png';

export default function Donation() {
    const history = useHistory();
    const [list, setList] = useState([]); //lista de usuários variável (de acordo com busca no input de pesquisa)
    const [listFull, setListFull] = useState([]); //lista de usuários sempre completa
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(false);

    //carega lista de usuários cadastrados
    useEffect(() => {
        getCashRegisters();
    }, [])

    //filtra usuários por nomes digitados na busca
    useEffect(() => {
        if (filter !== '') {
            const filtred = listFull.filter((obj) => {
                obj.search = 
                    + ' ' + (obj.description ? obj.description : '')
                    + ' ' + (obj.type ? obj.type : '')
                    + ' ' + (obj.value ? obj.value : '')
                    + ' ' + (obj.paidIn ? obj.paidIn : '')

                return ((obj.search).indexOf(filter.toLowerCase()) > -1);
            })

            setList(filtred);
        }
        else setList(listFull);

    }, [filter])

    async function getCashRegisters() {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            let resp = await api.get('/cashregister', {
                headers: { token }
            });

            resp = resp.data;
            if (resp.status) {
                setListFull(resp.response);
                setList(resp.response);
                console.log(resp.response);
                
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
        history.push('/main/modalcashregister');
    }

    //recarrega lista de usuários quando há exclusão
    function handleRefreshList(){
        getCashRegisters();
    }

    return (
        <div className="content">
            <Load  id="divLoading" loading={loading} />

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
                {list.map(cashregister => {
                    const today = new Date(cashregister.paidIn);

                    return <li key={cashregister.id} data-id={cashregister.id}>
                        <div className="image-cashregister-mini">
                            <img 
                            src={cashregister.type === 'in' ? 
                                ImageCashIn : 
                                ImageCashOut} 
                                alt="Foto perfil" 
                            />
                        </div>

                        <div className="simple-info-1">
                            <h2>{cashregister.description}</h2>
                            <span>
                                R$ {cashregister.value} - 
                                 {format(today, 'dd/MM/yyyy')}
                            </span>
                        </div>

                        <div>
                            <MenuDrop type="cashregister" id={cashregister.id} refresh={handleRefreshList}/>
                        </div>
                    </li>
                })}
            </ul>
        </div>
    )
}
