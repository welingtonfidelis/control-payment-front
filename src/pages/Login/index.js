import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Load from '../../components/Load/Load';
import api from '../../services/api';
import Swal from '../../components/SweetAlert/SwetAlert';

export default function Login({ history }) {
    const ImageLogo = `${process.env.PUBLIC_URL}/favicon.ico`;
    const [user, setUser] = useState('');
    const [password, setpassWord] = useState('');
    const [errorLogin, setErrorLogin] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);

        try {
            const _response = await api.post('/user/login', { user, password })

            //se login estiver correto, armazena variaveis e vai para Dashboard
            const { status } = _response.data;
            if (status) {
                const { name, token, isAdm, nameOng, logoOng } = _response.data.response;

                localStorage.setItem('token', token);
                localStorage.setItem('userName', name);
                localStorage.setItem('isAdm', isAdm);
                localStorage.setItem('nameOng', nameOng);
                localStorage.setItem('logoOng', logoOng);

                history.push('/main/dashboard');
                return;
            }
            else {
                setErrorLogin(true);
            }

        } catch (error) {
            Swal.swalErrorInform();
        }
        setLoading(false);
    }

    return (
        <div className="body-login">
            <div className="container-login">
                <div>
                </div>

                <div className="content-login" id="box-login">
                    <Load id="divLoading" loading={loading} />
                    <img className="logo-login" src={ImageLogo} alt="Logo" />

                    <p>
                        Por favor, insira seu <strong>usuário</strong> e <strong>senha</strong> abaixo.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <label htmlFor="user">Usuário</label>
                        <input
                            type="text"
                            id="user"
                            placeholder="seu usuário"
                            value={user}
                            onChange={event => setUser(event.target.value)}
                        />
                        <label htmlFor="password">Senha</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="*******"
                            value={password}
                            onChange={event => setpassWord(event.target.value)}
                        />

                        <button type="submit" className="btn-ok">ENTRAR</button>
                        {errorLogin ?
                            <span
                                className="invalid-login"
                                title="Por favor, vefique seus dados e tente novamente.">
                                Usuário ou senha inválidos
                        </span>
                            : ''
                        }
                    </form>

                    <div className="back-link">
                        <Link to='/resetpassword'>Esqueci minha senha</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}