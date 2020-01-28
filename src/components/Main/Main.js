import React from 'react';
import { Route } from 'react-router-dom';

import Menu from '../../components/Menu/Menu';

import Dashboard from '../../pages/Dashboard';
import User from '../../pages/User';
import Agent from '../../pages/Agent';
import ModalUser from '../../pages/ModalUser';
import ModalAgent from '../../pages/ModalAgent';

import './styles.css';

export default function Main() {
    return (
        <div id="main">
            <Menu page={window.location.href} />
            <Route path="/main/dashboard" component={Dashboard} />
            <Route path="/main/user" component={User} />
            <Route path="/main/agent" component={Agent} />
            <Route path="/main/modaluser" component={ModalUser} />
            <Route path="/main/modalagent" component={ModalAgent} />
        </div>
    );
}