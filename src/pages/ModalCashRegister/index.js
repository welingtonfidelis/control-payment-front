import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import { RadioGroup, FormControlLabel, Radio, FormLabel } from '@material-ui/core';
import DateFnsUtils from "@date-io/date-fns";
import { ptBR } from 'date-fns/locale';

import Load from '../../components/Load/Load';
import Swal from '../../components/SweetAlert/SwetAlert';

import './styles.scss';
import api from '../../services/api';

import ImageCashIn from '../../assets/images/cashregister_in.png';
import ImageCashOut from '../../assets/images/cashregister_out.png';

export default function ModalDonation(props) {
  const history = useHistory();
  const [value, setValue] = useState('');
  const [type, setType] = useState('in');
  const [description, setDescription] = useState('');
  const [observation, setObservation] = useState('');
  const [cashregisterId, setCashRegisterId] = useState(0);
  const [paidIn, setPaidIn] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    //atualizar/detalhar entrada/saida caixa (chamada vem do dropmenu de detalhes)
    if (props.location.state) {
      getCashRegisters();
    }
  }, [])

  async function getCashRegisters() {
    const { id } = props.location.state;

    setLoading(true);
    try {
      let resp = await api.get(`/cashregister/${id}`, {
        headers: { token }
      });

      resp = resp.data

      if (resp.status) {
        const { response } = resp;

        setCashRegisterId(response.id);
        setDescription(response.description);
        setValue(response.value);
        setPaidIn(new Date(response.paidIn));
        setObservation(response.observation);

      }
      else {
        Swal.swalErrorInform();
      }

    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const data = {
      'cashregister': { value, paidIn, observation, type, description }
    }

    try {
      let query = null;

      //update
      if (cashregisterId > 0) {
        query = await api.put('/cashregister/' + cashregisterId, data, {
          headers: { token },
        });
      }
      //create
      else {
        query = await api.post('/cashregister', data, {
          headers: { token },
        });
      }

      if (query.data.status) {
        Swal.swalInform();

        closeModal();
      }
      else errorDisplay();
    }
    catch (error) {
      errorDisplay();
      console.log(error);
    }

    setLoading(false);
  }

  function closeModal() {
    history.goBack()
  }

  //avisa usuário sobre um erro ocorrido
  function errorDisplay() {
    Swal.swalErrorInform();
  }

  return (
    <div className="content">
      <Load id="divLoading" loading={loading} />

      <form className="flex-col-h modal-form" autoComplete="off" onSubmit={handleSubmit}>
        <h1 className="title-modal">CADASTRO</h1>

        <div className="flex-row-w">
          <img
            className="image-cashregister-large"
            src={type === 'in' ?
              ImageCashIn :
              ImageCashOut}
            alt="Foto perfil"
          />

          <div className="flex-col-h">
            <RadioGroup
              value={type} onChange={event => setType(event.target.value)} row>
              <FormControlLabel
                value="in"
                control={<Radio color="primary" />}
                label="Entrada"
                labelPlacement="right"
              />
              <FormControlLabel
                value="out"
                control={<Radio color="primary" />}
                label="Saída"
                labelPlacement="right"
              />
            </RadioGroup>
            <div className="flex-row-w">

              <div className="flex-col-h">
                <label htmlFor="name">Descrição *</label>
                <input
                  required
                  type="text"
                  id="description"
                  placeholder="Descrição da entrada/saída de caixa"
                  title="Descrição da entrada/saída de caixa"
                  value={description}
                  onChange={event => setDescription(event.target.value)}
                />
              </div>
            </div>

            <div className="flex-row-w">
              <div className="flex-col-h">
                <label htmlFor="value">Valor *</label>
                <input
                  required
                  type="number"
                  id="value"
                  placeholder="Valor do registro de caixa"
                  title="Valor do registro de caixa"
                  value={value}
                  onChange={event => setValue(event.target.value)}
                />
              </div>

              <div className="flex-col-h">
                <label htmlFor="paidIn">Data *</label>
                <div className="keyboardpicker-modal-taxpayer">
                  <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
                    <KeyboardDatePicker
                      className="nomargin-datepicker"

                      format="dd/MM/yyyy"
                      value={paidIn}
                      onChange={date => setPaidIn(date)}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      cancelLabel="SAIR"
                    />
                  </MuiPickersUtilsProvider>
                </div>
              </div>
            </div>

          </div>

        </div>

        <div className="flex-row-w">
          <div className="flex-col-h">
            <label htmlFor="observation">Observação</label>
            <input
              type="text"
              id="observation"
              placeholder="Observação sobre o registro de caixa"
              title="Observação sobre o registro de caixa"
              value={observation}
              onChange={event => setObservation(event.target.value)}
            />
          </div>
        </div>

        <div className="flex-row-w modal-form-btn">
          <button type="button" onClick={closeModal} className="btn-cancel">CANCELAR</button>
          <button type="submit" className="btn-ok">SALVAR</button>
        </div>
      </form>
    </div>
  )
}