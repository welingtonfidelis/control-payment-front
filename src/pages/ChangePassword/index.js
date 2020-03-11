import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Load from '../../components/Load/Load';
import api from '../../services/api';
import Swal from '../../components/SweetAlert/SwetAlert';

export default function ChangePassword({ history }) {
    const ImageLogo = `${process.env.PUBLIC_URL}/favicon.ico`;
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setToken((window.location.href).split('changepassword/')[1]);
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);

        console.log(password, token);

        try {
            const query = await api.post('/user/resetpassword', { password }, {
                headers: { token },
            });

            console.log(query);

            // se login estiver correto, armazena variaveis e vai para Dashboard
            const { status, code } = query.data;
            if (status) {
                history.push('/main/dashboard');

                Swal.swalInform('Recuperação de senha', 'Sua senha foi alterada com sucesso.');

                return;
            }
            else {
                let msg = '';

                switch (code) {
                    case 401:
                    case 402:
                        msg = 'Seu token de autenticação é inválido ou expirou. ' +
                            'Por favor, volte à tela de recuperação de senha e tente novamente. ' +
                            'Lembre-se, você tem até 10 minutos para efeturar a troca de senha após ' +
                            'receber o email com as instruções.'
                        break;

                    case 21:
                        msg = 'Sua senha precisa ter ao menos 8 caracteres.'
                        break;

                    case 22:
                        msg = 'Houve um erro interno, por favor, tente novamente.'
                        break;

                    default:
                        break;
                }
                Swal.swalInform('Recuperação de senha', msg);
            }

        } catch (error) {
            console.log(error.stack || error.errors || error.message || error);

            Swal.swalErrorInform();
        }
        setLoading(false);
    }

    function handleCheckConfirmPassword() {
        const div = document.getElementById('changePasswordConfirm');

        if (password !== passwordConfirm) div.setCustomValidity('Repita a senha anterior.');
        else div.setCustomValidity("");
    }

    return (
        <div className="body-login">
            <div className="container-login">
                <div className="content-login" id="box-login">
                    <Load id="divLoading" loading={loading} />
                    <img className="logo-login" src={ImageLogo} alt="Logo" />

                    <p>
                        <h3>Recuperação de senha</h3>
                        <br></br>
                        Por favor, insira sua nova <strong>senha</strong> abaixo
                        para prosseguir com a recuperação de senha.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <label htmlFor="changePassword">Senha *</label>
                        <input
                            required
                            pattern=".{8,}"
                            id="changePassword"
                            type="password"
                            placeholder="Senha do usuário"
                            title="A senha deve conter no mínimo 8 caracteres."
                            value={password}
                            onChange={event => setPassword(event.target.value)}
                        />

                        <label htmlFor="changePasswordConfirm">Confirmar senha *</label>
                        <input
                            required
                            id="changePasswordConfirm"
                            type="password"
                            placeholder="Confirmar senha"
                            title="Repita a senha anterior."
                            value={passwordConfirm}
                            onChange={event => setPasswordConfirm(event.target.value)}
                            onBlur={handleCheckConfirmPassword}
                        />
                        <button type="submit" className="btn-ok">ENVIAR</button>
                    </form>

                    <div className="back-link">
                        <Link to='/'>Voltar para tela de login</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}