import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";
import { ptBR } from 'date-fns/locale';

import Load from '../../components/Load/Load';
import Swal from '../../components/SweetAlert/SwetAlert';

import ImageProfile from '../../assets/images/user.png';

import './styles.scss';
import api from '../../services/api';

import util from '../../services/util.js';

export default function ModalUser(props) {
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailCtrl, setEmailCtrl] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [birth, setBirth] = useState(new Date());
  const [value, setValue] = useState('');
  const [expiration, setExpiration] = useState('');
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [optState, setOptState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [taxpayerId, setTaxpayerId] = useState(0);
  const [addressId, setAddressId] = useState(0);
  const [paymentId, setPaymentId] = useState(0);
  const token = localStorage.getItem('token');
  const [hourStart, setHourStart] = useState(new Date());
  const [hourEnd, setHourEnd] = useState(new Date());
  const optExpiration = [
    { value: "01", label: "01" }, { value: "02", label: "02" }, { value: "03", label: "03" },
    { value: "04", label: "04" }, { value: "05", label: "05" }, { value: "06", label: "06" },
    { value: "07", label: "07" }, { value: "08", label: "08" }, { value: "09", label: "09" },
    { value: "10", label: "10" }, { value: "11", label: "11" }, { value: "12", label: "12" },
    { value: "13", label: "13" }, { value: "14", label: "14" }, { value: "15", label: "15" },
    { value: "16", label: "16" }, { value: "17", label: "17" }, { value: "18", label: "18" },
    { value: "19", label: "19" }, { value: "20", label: "20" }, { value: "21", label: "21" },
    { value: "22", label: "22" }, { value: "23", label: "23" }, { value: "24", label: "24" },
    { value: "25", label: "25" }, { value: "26", label: "26" }, { value: "27", label: "27" },
    { value: "28", label: "28" }, { value: "29", label: "29" }, { value: "30", label: "30" },
    { value: "31", label: "31" }
  ];

  useEffect(() => {
    //recupera informações básicas para construir as opções nos inputs
    getInfo();

    //atualizar/detalhar contribuinte (chamada vem do dropmenu de detalhes)
    if (props.location.state) getTaxpayer();
  }, [])

  async function getInfo() {
    setLoading(true);
    //seta dia 01 como default
    setExpiration(optExpiration[0]);

    try {
      let resp = await api.get('/address/state', {
        headers: { token }
      });

      resp = resp.data
      let tmp = [];
      (resp.response).forEach(el => {
        tmp.push({ value: el.code, label: el.name });
      });
      setOptState(tmp);

    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  async function getTaxpayer() {
    const { id } = props.location.state;

    setLoading(true);
    try {
      let resp = await api.get(`/taxpayer/${id}`, {
        headers: { token }
      });

      resp = resp.data

      if (resp.status) {
        const { response } = resp;
        const { Address } = response;
        const { Payment } = response;

        setTaxpayerId(response.id);
        setName(response.name);
        setBirth(new Date(response.birth));
        setEmail(response.email);
        setEmailCtrl(response.email);
        setPhone1(response.phone1);
        setPhone2(response.phone2);

        setAddressId(Address.id);
        setCep(Address.cep ? Address.cep : '');
        setStreet(Address.street ? Address.street : '');
        setNumber(Address.number ? Address.number : '');
        setComplement(Address.complement ? Address.complement : '');
        setDistrict(Address.district ? Address.district : '');
        setCity(Address.city ? Address.city : '');
        setState(Address.state ? { value: Address.state, label: Address.state } : '');

        setPaymentId(Payment.id);
        setValue(Payment.value);
        setExpiration(optExpiration[Payment.expiration - 1]);
        setHourStart(new Date(Payment.hourStart));
        setHourEnd(new Date(Payment.hourEnd));
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

    const stateTmp = state.value, expirationTmp = expiration.value;
    const data = {
      'taxpayer': { name, email, phone1, phone2, birth },
      'address': { cep, 'state': stateTmp, city, district, street, complement, number },
      'payment': { value, expiration: expirationTmp, hourStart, hourEnd }
    }

    try {
      let query = null;

      if (taxpayerId > 0) {
        data.address.id = addressId;
        data.payment.id = paymentId;

        query = await api.put('/taxpayer/' + taxpayerId, data, {
          headers: { token },
        });
      }
      else {
        query = await api.post('/taxpayer', data, {
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

  async function handleCheckEmail() {
    //se emailCtrl não estiver vazio, ele armazena o email da atualização 
    //verifica-se se o email na entrada atual é diferente do anterior, 
    //para evitar validar um email existente que já pertence ao contribuinte atual
    if (emailCtrl === '' || emailCtrl !== email) {
      setLoading(true);
      try {
        const query = await api.get('/taxpayer/byemail', {
          data: {},
          params: { email },
          headers: { token }
        });

        const resp = query.data;
        const div = document.getElementById('email');

        if (resp.response) div.setCustomValidity("Email já em uso.");
        else div.setCustomValidity("");

      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
  }

  function closeModal() {
    history.goBack()
  }

  async function handleCep() {
    //valor com . (ponto) também é um número, mas não um cep válido
    const cepTmp = cep.replace('.', '');
    setCep(cepTmp);

    if (!isNaN(cepTmp) && cepTmp.length === 8) {
      setLoading(true);
      try {
        const resp = (await util.getCep(cepTmp)).data

        if (resp) {
          setStreet(resp.logradouro);
          setComplement(resp.complemento);
          setDistrict(resp.bairro);
          setCity(resp.localidade);
          setState({ value: resp.uf, label: resp.uf });
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
  }

  //avisa contribuinte sobre um erro ocorrido
  function errorDisplay() {
    Swal.swalErrorInform();
  }

  return (
    <div className="content">
      <Load id="divLoading" loading={loading} />

      <form className="flex-col-h modal-form" autoComplete="off" onSubmit={handleSubmit}>
        <h1 className="title-modal">CADASTRO</h1>

        <div className="flex-row-w">
          <img className="img-rad-large" src={ImageProfile} alt="Foto perfil" />

          <div className="flex-col-h">
            <div className="flex-row-w">
              <div className="flex-col-h" style={{ flex: 3 }}>
                <label htmlFor="name">Nome *</label>
                <input
                  required
                  id="name"
                  placeholder="Nome do contribuinte"
                  value={name}
                  onChange={event => setName(event.target.value)}
                />
              </div>
              <div className="flex-col-h" style={{ flex: 1 }}>
                <label htmlFor="birth">Data de nascimento *</label>
                <div className="keyboardpicker-modal-taxpayer">
                  <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
                    <KeyboardDatePicker
                      className="nomargin-datepicker"
                      id="date-picker-dialog"
                      format="dd/MM/yyyy"
                      value={birth}
                      onChange={date => setBirth(date)}
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
                <label htmlFor="email">E-Mail *</label>
                <input
                  required
                  type="email"
                  id="email"
                  placeholder="E-mail do contribuinte"
                  title="E-mail deve ser único no sistema."
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  onBlur={handleCheckEmail}
                />
              </div>
              <div className="flex-col-h">
                <label htmlFor="phone1">Telefone 1 *</label>
                <input
                  required
                  type="text"
                  pattern="\d*"
                  minLength="9"
                  id="phone1"
                  placeholder="Celular do contribuinte"
                  title="Telefone com no mínimo 9 dígitos."
                  value={phone1}
                  onChange={event => setPhone1(event.target.value)}
                />
              </div>
              <div className="flex-col-h">
                <label htmlFor="phone2">Telefone 2 *</label>
                <input
                  required
                  type="text"
                  pattern="\d*"
                  minLength="9"
                  id="phone2"
                  placeholder="Celular do contribuinte"
                  title="Telefone com no mínimo 9 dígitos."
                  value={phone2}
                  onChange={event => setPhone2(event.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-row-w">
          <div className="flex-col-h">
            <div className="flex-row-w">
              <div className="flex-col-h">
                <label htmlFor="cep">CEP</label>
                <input
                  type="text"
                  pattern="\d*"
                  maxLength="8"
                  id="cep"
                  placeholder="CEP"
                  title="Apenas números. 8 dígitos."
                  value={cep}
                  onChange={event => setCep(event.target.value)}
                  onBlur={handleCep}
                />
              </div>
              <div className="flex-col-h">
                <label htmlFor="street">Rua</label>
                <input
                  id="street"
                  placeholder="Rua"
                  value={street}
                  onChange={event => setStreet(event.target.value)}
                />
              </div>
            </div>

            <div className="flex-row-w">
              <div className="flex-col-h">
                <label htmlFor="number">Número</label>
                <input
                  type="number"
                  id="number"
                  placeholder="Número"
                  value={number}
                  onChange={event => setNumber(event.target.value)}
                />
              </div>
              <div className="flex-col-h">
                <label htmlFor="complement">Complemento</label>
                <input
                  id="complement"
                  placeholder="Complemento"
                  value={complement}
                  onChange={event => setComplement(event.target.value)}
                />
              </div>
            </div>

            <div className="flex-row-w">
              <div className="flex-col-h">
                <label htmlFor="district">Bairro</label>
                <input
                  id="district"
                  placeholder="Bairro"
                  value={district}
                  onChange={event => setDistrict(event.target.value)}
                />

              </div>
              <div className="flex-col-h">
                <label htmlFor="city">Cidade</label>
                <input
                  id="city"
                  placeholder="Cidade"
                  value={city}
                  onChange={event => setCity(event.target.value)}
                />
              </div>
              <div className="flex-col-h">
                <label htmlFor="state">Estado</label>
                <Select
                  className="select-default"
                  placeholder="Escolha um estado"
                  value={state}
                  onChange={event => setState(event)}
                  options={optState}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-row-w">
          <div className="flex-col-h">
            <label htmlFor="value">Valor da contribuição</label>
            <input
              required
              type="number"
              id="value"
              placeholder="Valor da contribuição"
              value={value}
              onChange={event => setValue(event.target.value)}
            />
          </div>
          <div className="flex-col-h">
            <label htmlFor="value">Dia para recolhimento</label>
            <Select
              className="select-default"
              placeholder="Escolha um dia"
              value={expiration}
              onChange={event => setExpiration(event)}
              options={optExpiration}
            />
          </div>
          <div className="flex-col-h">
            <label htmlFor="value">Horário para recolhimento</label>
            <div className="flex-row-w keyboardpicker-modal-taxpayer">
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
                <KeyboardTimePicker
                  className="nomargin-timepicker"
                  margin="normal"
                  id="time-picker"
                  value={hourStart}
                  onChange={date => setHourStart(date)}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />
                <KeyboardTimePicker
                  className="nomargin-timepicker"
                  margin="normal"
                  id="time-picker"
                  value={hourEnd}
                  onChange={date => setHourEnd(date)}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                  cancelLabel="SAIR"
                />
              </MuiPickersUtilsProvider>
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