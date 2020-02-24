import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";
import { ptBR } from 'date-fns/locale';
import Select from 'react-select';

import Load from '../../components/Load/Load';
import Swal from '../../components/SweetAlert/SwetAlert';

import ImageProfile from '../../assets/images/user.png';

import './styles.scss';
import api from '../../services/api';

export default function ModalDonation(props) {
  const history = useHistory();
  const [value, setValue] = useState('');
  const [taxpayer, setTaxpayer] = useState('');
  const [observation, setObservation] = useState('');
  const [donationId, setDonationId] = useState(0);
  const [paidIn, setPaidIn] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [optTaxpayer, setOptTaxpayer] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    //recupera informações básicas para construir as opções nos inputs
    getInfo();

    //atualizar/detalhar doação (chamada vem do dropmenu de detalhes)
    if (props.location.state) {
      getDonation();
    }
  }, [])

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

    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  async function getDonation() {
    const { id } = props.location.state;

    setLoading(true);
    try {
      let resp = await api.get(`/donation/${id}`, {
        headers: { token }
      });

      resp = resp.data

      if (resp.status) {
        const { response } = resp;
        const { Taxpayer } = response;

        setDonationId(response.id);
        setValue(response.value);
        setPaidIn(new Date(response.paidIn));
        setObservation(response.observation);
        setTaxpayer({ value: Taxpayer.id, label: Taxpayer.name });
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

    const taxpayerTmp = taxpayer.value;
    const data = {
      'donation': { value, paidIn, observation, 'TaxpayerId': taxpayerTmp }
    }
    
    try {
      let query = null;

      //update
      if (donationId > 0) {
        query = await api.put('/donation/' + donationId, data, {
          headers: { token },
        });
      }
      //create
      else {
        query = await api.post('/donation', data, {
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

  function handleChangeTaxpayer(event){
    setTaxpayer(event);
    setValue(event.payment);
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
      <Load  id="divLoading" loading={loading} />

      <form className="flex-col-h modal-form" autoComplete="off" onSubmit={handleSubmit}>
        <h1 className="title-modal">CADASTRO</h1>

        <div className="flex-row-w">
          <img className="img-rad-large" src={ImageProfile} alt="Foto perfil" />

          <div className="flex-col-h">
            <div className="flex-row-w">
              <div className="flex-col-h">
                <label htmlFor="name">Nome *</label>
                <Select
                  className="select-default"
                  placeholder="Escolha um contribuinte"
                  value={taxpayer}
                  onChange={event => handleChangeTaxpayer(event)}
                  options={optTaxpayer}
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
                  placeholder="Valor da doação"
                  title="E-mail deve ser único no sistema."
                  value={value}
                  onChange={event => setValue(event.target.value)}
                />
              </div>
              <div className="flex-col-h">
                <label htmlFor="paidIn">Data *</label>
                <div className="keyboardpicker-modal-taxpayer">
                  <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
                    <KeyboardDateTimePicker
                      className="nomargin-datepicker"
                      
                      format="dd/MM/yyyy hh:mm"
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

            <div className="flex-row-w">
              <div className="flex-col-h">
                <label htmlFor="observation">Observação</label>
                <input
                  type="text"
                  id="observation"
                  placeholder="Observação sobre a doação"
                  title="E-mail deve ser único no sistema."
                  value={observation}
                  onChange={event => setObservation(event.target.value)}
                />
              </div>
            </div>
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