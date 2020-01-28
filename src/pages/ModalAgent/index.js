import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import pt from 'date-fns/locale/pt-BR';
import Select from 'react-select';

import Load from '../../components/Load/Load';
import Swal from '../../components/SweetAlert/SwetAlert';

import ImageProfile from '../../assets/user.png';

import './styles.scss';
import api from '../../services/api';

import util from '../../services/util.js';

export default function ModalUser(props) {
  registerLocale("pt", pt); //seta idioma local pra uso no date picker  
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailCtrl, setEmailCtrl] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [birth, setBirth] = useState(new Date());
  const [commission, setComission] = useState('');
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [optState, setOptState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [agentId, setAgentId] = useState(0);
  const [addressId, setAddressId] = useState(0);
  let teste = [];
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    //recupera informações básicas para construir as opções nos inputs
    getInfo();

    //atualizar/detalhar representante (chamada vem do dropmenu de detalhes)
    if (props.location.state) getAgent();
  }, [])

  async function getInfo() {
    setLoading(true);
    try {
      let resp = await api.get('/util/state', {
        headers: { token }
      });

      resp = resp.data
      let tmp = [];
      (resp.response).forEach(el => {
        tmp.push({ value: el.code, label: el.name })
      });
      setOptState(tmp)
      teste = tmp;
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  async function getAgent() {
    const { id } = props.location.state;

    setLoading(true);
    try {
      let resp = await api.get(`/agent/${id}`, {
        headers: { token }
      });

      resp = resp.data

      if (resp.status) {
        const { response } = resp;
        const { Address } = response;
        
        setAgentId(response.id);
        setName(response.name);
        setBirth(new Date(response.birth));
        setEmail(response.email);
        setEmailCtrl(response.email);
        setCellphone(response.cellphone);
        setComission(response.commission);

        setAddressId(Address.id);
        setCep(Address.cep ? Address.cep : '');
        setStreet(Address.street ? Address.street : '');
        setNumber(Address.number ? Address.number : '');
        setComplement(Address.complement ? Address.complement : '');
        setDistrict(Address.district ? Address.district : '');
        setCity(Address.city ? Address.city : '');
        setState(Address.state ? Address.state : '');

        console.log(teste.length);
        
        teste.forEach((el, index) => {
          console.log(el);
          
        })
      }
      else {
        Swal.swalInform('Usuário', 'Houve um problema ao carregar as ' +
          'informações. Por favor, Tente novamente.', 'error');
      }

    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const stateTmp = state.value;
    const data = {
      'agent': { name, email, commission, cellphone, birth },
      'address': { cep, 'state': stateTmp, city, district, street, complement, number }
    }

    try {
      let query = null;

      if (agentId > 0) {
        data.address.id = addressId;

        query = await api.put('/agent/' + agentId, data, {
          headers: { token },
        });
      }
      else {
        query = await api.post('/agent', data, {
          headers: { token },
        });
      }

      if (query.data.status) {
        Swal.swalInform('Representante', 'Salvo com sucesso.', 'success');

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
    //para evitar validar um email existente que já pertence ao representante atual
    if (emailCtrl === '' || emailCtrl !== email) {
      setLoading(true);
      try {
        const query = await api.get('/agent/byemail', {
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
        console.log(resp);

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

  //avisa representante sobre um erro ocorrido
  function errorDisplay() {
    Swal.swalInform('Usuário', 'Parece que algo deu errado. Por favor, ' +
      'revise os dados inseridos e tente novamente.', 'error');
  }

  return (
    <div className="content">
      <Load loading={loading} />

      <form className="flex-col modal-form" autoComplete="off" onSubmit={handleSubmit}>
        <h1 className="title-modal">CADASTRO</h1>

        <div className="flex-row">
          <img className="img-rad-large" src={ImageProfile} alt="Foto perfil" />

          <div className="flex-col">
            <div className="flex-row">
              <div className="flex-col" style={{ flex: 3 }}>
                <label htmlFor="name">Nome *</label>
                <input
                  required
                  id="name"
                  placeholder="Nome do representante"
                  value={name}
                  onChange={event => setName(event.target.value)}
                />
              </div>
              <div className="flex-col" style={{ flex: 1 }}>
                <label htmlFor="birth">Data de nascimento *</label>
                <DatePicker
                  locale="pt"
                  onChange={date => setBirth(date)}
                  selected={birth}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
              </div>
            </div>

            <div className="flex-row">
              <div className="flex-col">
                <label htmlFor="email">E-Mail *</label>
                <input
                  required
                  type="email"
                  id="email"
                  placeholder="E-mail do representante"
                  title="E-mail deve ser único no sistema."
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  onBlur={handleCheckEmail}
                />
              </div>
              <div className="flex-col">
                <label htmlFor="cellphone">Celular *</label>
                <input
                  required
                  type="text"
                  pattern="\d*"
                  minLength="9"
                  id="cellphone"
                  placeholder="Celular do representante"
                  title="Telefone com no mínimo 9 dígitos."
                  value={cellphone}
                  onChange={event => setCellphone(event.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-row">
          <div className="flex-col">
            <div className="flex-row">
              <div className="flex-col">
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
              <div className="flex-col">
                <label htmlFor="street">Rua</label>
                <input
                  id="street"
                  placeholder="Rua"
                  value={street}
                  onChange={event => setStreet(event.target.value)}
                />
              </div>
            </div>

            <div className="flex-row">
              <div className="flex-col">
                <label htmlFor="number">Número</label>
                <input
                  type="number"
                  id="number"
                  placeholder="Número"
                  value={number}
                  onChange={event => setNumber(event.target.value)}
                />
              </div>
              <div className="flex-col">
                <label htmlFor="complement">Complemento</label>
                <input
                  id="complement"
                  placeholder="Complemento"
                  value={complement}
                  onChange={event => setComplement(event.target.value)}
                />
              </div>
            </div>

            <div className="flex-row">
              <div className="flex-col">
                <label htmlFor="district">Bairro</label>
                <input
                  id="district"
                  placeholder="Bairro"
                  value={district}
                  onChange={event => setDistrict(event.target.value)}
                />

              </div>
              <div className="flex-col">
                <label htmlFor="city">Cidade</label>
                <input
                  id="city"
                  placeholder="Cidade"
                  value={city}
                  onChange={event => setCity(event.target.value)}
                />
              </div>
              <div className="flex-col">
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

        <div className="flex-row">
          <div className="flex-col">
            <label htmlFor="commission">Comissão por venda</label>
            <input
              type="commission"
              id="commission"
              placeholder="Comissão por venda"
              value={commission}
              onChange={event => setComission(event.target.value)}
            />
          </div>
        </div>

        <div className="flex-row">
          <button type="button" onClick={closeModal} className="btn-cancel">CANCELAR</button>
          <button type="submit" className="btn-ok">SALVAR</button>
        </div>
      </form>
    </div>
  )
}