import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import Select from 'react-select';

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
  const [user, setUser] = useState('');
  const [userCtrl, setUserCtrl] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [phone, setPhone] = useState('');
  const [birth, setBirth] = useState(new Date());
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [optState, setOptState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(0);
  const [addressId, setAddressId] = useState(0);

  const token = localStorage.getItem('token');
  
  useEffect(() => {
    //recupera informações básicas para construir as opções nos inputs
    getInfo();

    //atualizar/detalhar usuário (chamada vem do dropmenu de detalhes)
    if (props.location.state) {
      disableInputPswd(true); //desativa campos de senha no update
      getUser();
    }
    else disableInputPswd(false);
  }, [])

  async function getInfo() {
    setLoading(true);

    try {
      let resp = await api.get('/address/state', {
        headers: { token }
      });

      resp = resp.data
      let tmp = [];
      (resp.response).forEach(el => {
        tmp.push({ value: el.code, label: el.name })
      });
       setOptState(tmp)

    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  async function getUser() {
    const { id } = props.location.state;

    setLoading(true);
    try {
      let resp = await api.get(`/user/${id}`, {
        headers: { token }
      });

      resp = resp.data

      if (resp.status) {
        const { response } = resp;
        const { Address } = response;

        setUserId(response.id);
        setName(response.name);
        setBirth(new Date(response.birth));
        setEmail(response.email);
        setEmailCtrl(response.email);
        setPhone(response.phone);
        setUser(response.user);
        setUserCtrl(response.user);

        setAddressId(Address.id);
        setCep(Address.cep ? Address.cep : '');
        setStreet(Address.street ? Address.street : '');
        setNumber(Address.number ? Address.number : '');
        setComplement(Address.complement ? Address.complement : '');
        setDistrict(Address.district ? Address.district : '');
        setCity(Address.city ? Address.city : '');
        setState(Address.state ? { value: Address.state, label: Address.state } : '');
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

    const stateTmp = state.value;
    const data = {
      'user': { name, email, user, password, phone, birth },
      'address': { cep, 'state': stateTmp, city, district, street, complement, number }
    }

    try {
      let query = null;

      if (userId > 0) {
        delete data.user.password; //atualização deste modal não envia senha
        data.address.id = addressId;

        query = await api.put('/user/' + userId, data, {
          headers: { token },
        });
      }
      else {
        query = await api.post('/user', data, {
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

  async function handleCheckUser() {
    //se userCtrl não estiver vazio, ele armazena o user da atualização 
    //verifica-se se o user na entrada atual é diferente do anterior, 
    //para evitar validar um user existente que já pertence ao usuário atual
    if (userCtrl === '' || userCtrl !== user) {
      setLoading(true);
      try {
        const query = await api.get('/user/byuser', {
          data: {},
          params: { user },
          headers: { token }
        });

        const resp = query.data;
        const div = document.getElementById('user');

        if (resp.response) div.setCustomValidity("Usuário já em uso.");
        else div.setCustomValidity("");

      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
  }

  async function handleCheckEmail() {
    //se emailCtrl não estiver vazio, ele armazena o email da atualização 
    //verifica-se se o email na entrada atual é diferente do anterior, 
    //para evitar validar um email existente que já pertence ao usuário atual
    if (emailCtrl === '' || emailCtrl !== email) {
      setLoading(true);
      try {
        const query = await api.get('/user/byemail', {
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

  function handleCheckConfirmPassword() {
    const div = document.getElementById('passwordConfirm');

    if (password !== passwordConfirm) div.setCustomValidity('Repita a senha anterior.');
    else div.setCustomValidity("");
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

  //avisa usuário sobre um erro ocorrido
  function errorDisplay() {
    Swal.swalErrorInform();
  }

  //ativa/desativa campo de senha e confirmação de senha (atualização de usuário nao pode inserir senha nova)
  function disableInputPswd(opt) {
    (document.getElementById('password')).disabled = opt;
    (document.getElementById('passwordConfirm')).disabled = opt;
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
              <div className="flex-col-h" style={{ flex: 3 }}>
                <label htmlFor="name">Nome *</label>
                <input
                  required
                  id="name"
                  placeholder="Nome do usuário"
                  value={name}
                  onChange={event => setName(event.target.value)}
                />
              </div>
              <div className="flex-col-h" style={{ flex: 1 }}>
                <label htmlFor="birth">Data de nascimento *</label>
                <DatePicker
                  locale="pt"
                  onChange={date => setBirth(date)}
                  selected={birth}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </div>

            <div className="flex-row-w">
              <div className="flex-col-h">
                <label htmlFor="email">E-Mail *</label>
                <input
                  required
                  type="email"
                  id="email"
                  placeholder="E-mail do usuário"
                  title="E-mail deve ser único no sistema."
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  onBlur={handleCheckEmail}
                />
              </div>
              <div className="flex-col-h">
                <label htmlFor="phone">Celular *</label>
                <input
                  required
                  type="text"
                  pattern="\d*"
                  minLength="9"
                  id="phone"
                  placeholder="Celular do usuário"
                  title="Telefone com no mínimo 9 dígitos."
                  value={phone}
                  onChange={event => setPhone(event.target.value)}
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

            <label htmlFor="user">Usuário *</label>
            <input
              required
              id="user"
              placeholder="Usuário"
              title="Usuário deve ser único no sistema."
              value={user}
              onChange={event => setUser(event.target.value)}
              onBlur={handleCheckUser}
            />

            <label htmlFor="password">Senha *</label>
            <input
              required
              pattern=".{8,}"
              id="password"
              type="password"
              placeholder="Senha do usuário"
              title="A senha deve conter no mínimo 8 caracteres."
              value={password}
              onChange={event => setPassword(event.target.value)}
            />

            <label htmlFor="passwordConfirm">Confirmar senha *</label>
            <input
              required
              id="passwordConfirm"
              type="password"
              placeholder="Confirmar senha"
              title="Repita a senha anterior."
              value={passwordConfirm}
              onChange={event => setPasswordConfirm(event.target.value)}
              onBlur={handleCheckConfirmPassword}
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