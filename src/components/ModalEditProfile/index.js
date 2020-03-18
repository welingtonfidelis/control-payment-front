import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Modal, Backdrop, Fade,
  Tab, AppBar, Tabs, Typography,
  Box
} from "@material-ui/core/";
import { AccountCircle, Home, Lock } from "@material-ui/icons";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import PropTypes from "prop-types";
import DateFnsUtils from "@date-io/date-fns";
import { ptBR } from "date-fns/locale";
import Select from "react-select";
import NumberFormat from "react-number-format";

import Load from "../../components/Load/Load";
import Swal from "../../components/SweetAlert/SwetAlert";

import api from "../../services/api";

import util from "../../services/util.js";

import ImageProfile from "../../assets/images/user.png";
import "./styles.scss";

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper
  }
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-prevent-tabpanel-${index}`}
      aria-labelledby={`scrollable-prevent-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `scrollable-prevent-tab-${index}`,
    "aria-controls": `scrollable-prevent-tabpanel-${index}`
  };
}

export default function TransitionsModal() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailCtrl, setEmailCtrl] = useState("");
  const [user, setUser] = useState("");
  const [userCtrl, setUserCtrl] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [birth, setBirth] = useState(new Date());
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [optState, setOptState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(0);
  const [addressId, setAddressId] = useState(0);
  const [loadUserInfo, setLoadUserInfo] = useState(true);

  const token = localStorage.getItem("token");

  const handleOpen = () => {
    setOpen(true);
    setLoadUserInfo(!loadUserInfo);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    //recupera informações básicas para construir as opções nos inputs
    async function getInfo() {
      setLoading(true);

      try {
        let resp = await api.get("/address/state", {
          headers: { token }
        });

        resp = resp.data;
        let tmp = [];
        resp.response.forEach(el => {
          tmp.push({ value: el.code, label: el.name });
        });
        setOptState(tmp);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    getInfo();
  }, []);

  useEffect(() => {
    //recupera informações do usuário
    async function getUser() {
      setLoading(true);
      try {
        let resp = await api.get(`/user/bytoken`, {
          headers: { token }
        });
  
        resp = resp.data;
  
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
          setCep(Address.cep ? Address.cep : "");
          setStreet(Address.street ? Address.street : "");
          setNumber(Address.number ? Address.number : "");
          setComplement(Address.complement ? Address.complement : "");
          setDistrict(Address.district ? Address.district : "");
          setCity(Address.city ? Address.city : "");
          setState(
            Address.state ? { value: Address.state, label: Address.state } : ""
          );
        } else {
          Swal.swalErrorInform();
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    getUser();
  }, [loadUserInfo]);


  async function handleSaveUser(event) {
    event.preventDefault();
    setLoading(true);

    const data = {
      user: { name, email, phone, birth, user }
    };

    try {
      const query = await api.put("/user/" + userId, data, {
        headers: { token }
      });

      if (query.data.status) {
        Swal.swalInform();
      } else errorDisplay();
    } catch (error) {
      errorDisplay();
      console.log(error);
    }

    setLoading(false);
  }

  async function handleSaveAddress(event) {
    event.preventDefault();
    setLoading(true);

    const stateTmp = state.value;
    const data = {
      address: {
        id: addressId,
        cep,
        street,
        number,
        complement,
        district,
        city,
        state: stateTmp
      },
      returnInf: true
    };

    try {
      const query = await api.put("/address", data, {
        headers: { token }
      });

      if (query.data.status) {
        Swal.swalInform();
      } else errorDisplay();
    } catch (error) {
      errorDisplay();
      console.log(error);
    }

    setLoading(false);
  }

  async function handleSaveLoginInfo(event, type = null) {
    event.preventDefault();

    if (oldPassword === "") {
      const userName = localStorage.getItem('userName');
      Swal.swalErrorInform(userName, "É necessário inserir sua senha atual");
    } else {
      let data = {};
      switch (type) {
        case 1:
          data = { oldPassword, user };
          break;

        case 2:
          data = { oldPassword, password };
          break;

        default:
          break;
      }

      setLoading(true);

      try {
        const query = await api.put("/user/login", data, {
          headers: { token }
        });

        if (query.data.status) {
          Swal.swalInform();
          setOldPassword('');
          setPassword('');
          setPasswordConfirm('');
        }
        else errorDisplay();

      } catch (error) {
        errorDisplay();
        console.log(error);
      }

      setLoading(false);
    }
  }

  async function handleCheckUser() {
    //se userCtrl não estiver vazio, ele armazena o user da atualização
    //verifica-se se o user na entrada atual é diferente do anterior,
    //para evitar validar um user existente que já pertence ao usuário atual
    if (userCtrl === "" || userCtrl !== user) {
      setLoading(true);
      try {
        const query = await api.get("/user/byuser", {
          data: {},
          params: { user },
          headers: { token }
        });

        const resp = query.data;
        const div = document.getElementById("user");

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
    if (emailCtrl === "" || emailCtrl !== email) {
      setLoading(true);
      try {
        const query = await api.get("/user/byemail", {
          data: {},
          params: { email },
          headers: { token }
        });

        const resp = query.data;
        const div = document.getElementById("email");

        if (resp.response) div.setCustomValidity("Email já em uso.");
        else div.setCustomValidity("");
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
  }

  async function handleCep() {
    //valor com . (ponto) também é um número, mas não um cep válido
    const cepTmp = cep.replace(".", "");
    setCep(cepTmp);

    if (!isNaN(cepTmp) && cepTmp.length === 8) {
      setLoading(true);
      try {
        const resp = (await util.getCep(cepTmp)).data;

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

  function handleCheckConfirmPassword() {
    const div = document.getElementById("passwordConfirm");

    if (password !== passwordConfirm)
      div.setCustomValidity("Repita a senha anterior.");
    else div.setCustomValidity("");
  }

  //avisa usuário sobre um erro ocorrido
  function errorDisplay() {
    Swal.swalErrorInform();
  }

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <img
        className="edit-profile-img"
        onClick={handleOpen}
        src={ImageProfile}
        alt="Foto perfil"
        title="Perfil do usuário"
      />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open} className="modal-profile-content">
          <div className={classes.root}>
            <AppBar position="static">
              <Load id="divLoading" loading={loading} />
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="off"
                aria-label="scrollable prevent tabs example"
              >
                <Tab icon={<AccountCircle />} aria-label="phone" {...a11yProps(0)} />
                <Tab
                  icon={<Home />}
                  aria-label="favorite"
                  {...a11yProps(1)}
                />
                <Tab
                  icon={<Lock />}
                  aria-label="person"
                  {...a11yProps(2)}
                />
              </Tabs>
            </AppBar>

            <TabPanel className="modal-profile-tab1" value={value} index={0}>
              <img
                className="image-profile-large"
                src={ImageProfile}
                alt="Foto perfil"
              />

              <form onSubmit={handleSaveUser} className="flex-col-h">
                <label htmlFor="birth">Data de nascimento *</label>
                <div className="keyboardpicker-modal-taxpayer">
                  <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
                    <KeyboardDatePicker
                      className="nomargin-datepicker"
                      format="dd/MM/yyyy"
                      value={birth}
                      onChange={date => setBirth(date)}
                      KeyboardButtonProps={{
                        "aria-label": "change date"
                      }}
                      cancelLabel="SAIR"
                    />
                  </MuiPickersUtilsProvider>
                </div>
                <label htmlFor="name">Nome *</label>
                <input
                  required
                  id="name"
                  placeholder="Nome do usuário"
                  value={name}
                  onChange={event => setName(event.target.value)}
                />

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

                <label htmlFor="phone">Celular *</label>
                <NumberFormat
                  required
                  id="phone"
                  value={phone}
                  onChange={event => setPhone(event.target.value)}
                  format="(##) # ####-####"
                  placeholder="(00) 9 0000-0000"
                  title="Telefone com no 9 dígitos."
                  mask="_"
                />

                <div className="flex-row-w">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn-cancel"
                  >
                    CANCELAR
                  </button>
                  <button type="submit" className="btn-ok">
                    SALVAR
                  </button>
                </div>
              </form>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <form
                id="profile-user-info"
                className="flex-col-h"
                onSubmit={handleSaveAddress}
              >
                <label htmlFor="cep">CEP</label>
                <NumberFormat
                  id="cep"
                  value={cep}
                  onChange={event => setCep(event.target.value)}
                  format="########"
                  placeholder="00000000"
                  title="Cep do usuário"
                  mask="_"
                  onBlur={handleCep}
                />

                <label htmlFor="street">Rua</label>
                <input
                  id="street"
                  placeholder="Rua"
                  value={street}
                  onChange={event => setStreet(event.target.value)}
                />

                <label htmlFor="number">Número</label>
                <input
                  type="number"
                  id="number"
                  placeholder="Número"
                  value={number}
                  onChange={event => setNumber(event.target.value)}
                />

                <label htmlFor="complement">Complemento</label>
                <input
                  id="complement"
                  placeholder="Complemento"
                  value={complement}
                  onChange={event => setComplement(event.target.value)}
                />

                <label htmlFor="district">Bairro</label>
                <input
                  id="district"
                  placeholder="Bairro"
                  value={district}
                  onChange={event => setDistrict(event.target.value)}
                />

                <div className="flex-row-w">
                  <div className="flex-col-h" style={{ flex: 2 }}>
                    <label htmlFor="city">Cidade</label>
                    <input
                      id="city"
                      placeholder="Cidade"
                      value={city}
                      onChange={event => setCity(event.target.value)}
                    />
                  </div>
                  <div className="flex-col-h" style={{ flex: 1 }}>
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

                <div className="flex-row-w">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn-cancel"
                  >
                    CANCELAR
                  </button>
                  <button type="submit" className="btn-ok">
                    SALVAR
                  </button>
                </div>
              </form>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <div className="flex-col-h">
                <label htmlFor="oldPassword">Senha Atual*</label>
                <input
                  required
                  pattern=".{8,}"
                  id="oldPassword"
                  type="password"
                  placeholder="Senha do usuário"
                  title="A senha deve conter no mínimo 8 caracteres."
                  value={oldPassword}
                  onChange={event => setOldPassword(event.target.value)}
                />

                <label htmlFor="user">Usuário *</label>
                <form
                  id="profile-user-info"
                  className="flex-row-w"
                  onSubmit={event => {
                    handleSaveLoginInfo(event, 1);
                  }}
                >
                  <input
                    required
                    id="user"
                    placeholder="Usuário"
                    title="Usuário deve ser único no sistema."
                    value={user}
                    onChange={event => setUser(event.target.value)}
                    onBlur={handleCheckUser}
                  />

                  <button type="submit" className="btn-ok">
                    SALVAR
                  </button>
                </form>

                <form
                  id="profile-user-info"
                  onSubmit={event => {
                    handleSaveLoginInfo(event, 2);
                  }}
                  className="flex-col-h"
                >
                  <label htmlFor="password">Nova senha *</label>
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

                  <label htmlFor="passwordConfirm">
                    Confirmar nova senha *
                  </label>
                  <div className="flex-row-w">
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

                    <button type="submit" className="btn-ok">
                      SALVAR
                    </button>
                  </div>
                </form>
              </div>
            </TabPanel>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
