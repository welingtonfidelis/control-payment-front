import React, { useState } from 'react';

import api from '../../services/api';

import logo from '../../assets/sua-logo-aqui.png'
import './styles.scss';

export default function Login({ history }) {
    const [user, setUser] = useState('');
    const [password, setpassWord] = useState('');
    const [errorLogin, setErrorLogin] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const _response = await api.post('/user/login', { user, password })

            //se login estiver correto, armazena variaveis e vai prossegue Dashboard
            const { status } = _response.data;
            if (status) {
                const { name, token } = _response.data.response;

                localStorage.setItem('token', token);
                localStorage.setItem('userName', name);
                history.push('/main/dashboard');
            }

        } catch (error) {
            setErrorLogin(true);
            upAndDownShake();
        }
    }

    //Função para "chacoalhar" tela de login com erro de usuario ou senha
    let counter = 1;
    function upAndDownShake() {
        let shakingElements = [], magnitude = 16;
        const startX = 0, startY = 0, numberOfShakes = 15,
            magnitudeUnit = magnitude / numberOfShakes;
        const randomInt = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        const element = document.getElementById('box-login');

        if (counter < numberOfShakes) {
            element.style.transform = 'translate(' + startX + 'px, ' + startY + 'px)';

            magnitude -= magnitudeUnit;

            const randomX = randomInt(-magnitude, magnitude);
            const randomY = randomInt(-magnitude, magnitude);

            element.style.transform = 'translate(' + randomX + 'px, ' + randomY + 'px)';
            counter += 1;

            requestAnimationFrame(upAndDownShake);
        }
        else counter = 1;

        if (counter >= numberOfShakes) {
            element.style.transform = 'translate(' + startX + ', ' + startY + ')';
            shakingElements.splice(shakingElements.indexOf(element), 1);
        }
    }

    return (
        <div className="container-login">
            <div>
                <img className="logo-login" src={logo} alt="Logo" />
            </div>

            <div className="content-login" id="box-login">
                <p>Por favor, insira seu <strong>usuário</strong> e <strong>senha</strong> abaixo.</p>

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
            </div>
        </div>
    )
}