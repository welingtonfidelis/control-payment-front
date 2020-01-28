import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Edit, Delete, ExpandMore, ExpandLess } from '@material-ui/icons';
import swal from '../SweetAlert/SwetAlert';
import api from '../../services/api';

import './styles.scss';

export default function User(props) {
  const { type, id, refresh } = props;
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);

  async function handleOpt(opt) {
    switch(opt){
      //atualização/detalhes
      case 'upd':
        history.push(`/main/modal${type}`, {id});
        break;

      case 'del':
        const resp = await swal.swalConfirm('Excluir', 'Tem certeza que deseja excluir esta informação?');
        if(resp){
          try {
            const token = localStorage.getItem('token');
            await api.delete(`/${type}/${id}`, {
              headers: {token}
            });
          } catch (error) {
            console.log(error);
          }
        }
        refresh();
        break;

      default:
        break;
    }

    setShowMenu(false);
  }

  return (
    <div>
      <div className="menu-call" onClick={() => setShowMenu(!showMenu)}>
        { showMenu ? <ExpandLess/> : <ExpandMore />}
      </div>

      {
        showMenu
          ? (
            <div className="menu-list" >
              <div onClick={() => handleOpt('upd')}>
                <Edit />
                <div>
                  Detalhes
                </div>
              </div>

              <div onClick={() => handleOpt('del')}>
                <Delete color="error" />
                <div>
                  Excluir
                </div>
              </div>
            </div>
          )
          : (
            null
          )
      }
    </div>
  );
}