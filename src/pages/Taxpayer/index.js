import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import MenuDrop from '../../components/MenuDropDown/OptionList';
import Load from '../../components/Load/Load';

import './styles.scss';

import api from '../../services/api';

import ImageProfile from '../../assets/images/user.png';

export default function Taxpayer() {
  const history = useHistory();
  const [list, setList] = useState([]); //lista de representantes variável (de acordo com busca no input de pesquisa)
  const [listFull, setListFull] = useState([]); //lista de representantes sempre completa
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);

  //carega lista de representantes cadastrados
  useEffect(() => {
    getTaxpayers();
  }, [])

  //filtra representantes por nomes digitados na busca
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

  async function getTaxpayers() {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let resp = await api.get('/taxpayer', {
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
    history.push('/main/modaltaxpayer');
  }

  //recarrega lista de representantes quando há exclusão
  function handleRefreshList() {
    getTaxpayers();
  }

  return (
    <div className="content">
      <Load  id="divLoading" loading={loading} />

      <div className="search-bar">
        <input
          placeholder="Procurar representante"
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
        {list.map(taxpayer =>
          <li key={(taxpayer.id).toString()} data-id={taxpayer.id}>
            <div className="image-profile-mini">
              <img src={ImageProfile} alt="Foto perfil" />
            </div>

            <div className="simple-info-1">
              <h2>{taxpayer.name}</h2>
              <span>{taxpayer.cellphone}</span>
            </div>

            <div>
              <MenuDrop type="taxpayer" id={taxpayer.id} refresh={handleRefreshList} />
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}
