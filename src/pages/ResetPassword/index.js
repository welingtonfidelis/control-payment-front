import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Load from '../../components/Load/Load';
import api from '../../services/api';
import Swal from '../../components/SweetAlert/SwetAlert';

export default function ResetPassword() {
    const ImageLogo = `${process.env.PUBLIC_URL}/favicon.ico`;
    const [email, setEmail] = useState('');
    const [errorLogin, setErrorLogin] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);

        try {
            const query = await api.post('/user/resetmail', { email })

            console.log(query);

            // se login estiver correto, armazena variaveis e vai para Dashboard
            const { status } = query.data;
            if (status) {
                Swal.swalInform('Recuperação de senha',
                    'Enviamos um email para você. Por favor, acesse ' +
                    'sua caixa de entrada e siga as instruções.');
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
                        <h3>Recuperação de senha</h3>
                        <br></br>

                        Por favor, insira seu <strong>email</strong> abaixo 
                        para prosseguir com a recuperação de senha.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">Email *</label>
                        <input
                            required
                            type="email"
                            id="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={event => setEmail(event.target.value)}
                        />
                        <button type="submit" className="btn-ok">ENVIAR</button>
                        {errorLogin ?
                            <span
                                className="invalid-login"
                                title="Por favor, vefique seus dados e tente novamente.">
                                Email inválido
                        </span>
                            : ''
                        }
                    </form>

                    <div className="back-link">
                        <Link to='/'>Voltar para tela de login</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}