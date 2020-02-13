import React from 'react';
import { Route } from 'react-router-dom';

import Menu from '../../components/Menu/Menu';

import Dashboard from '../../pages/Dashboard';
import User from '../../pages/User';
import Taxpayer from '../../pages/Taxpayer';
import ModalUser from '../../pages/ModalUser';
import ModalTaxpayer from '../../pages/ModalTaxpayer';
import Receive from '../../pages/Receive';
import Donation from '../../pages/Donation';
import ModalDonation from '../../pages/ModalDonation';
import Report from '../../pages/Report';

import './styles.css';

export default function Main() {
    return (
        <div id="main">
            <Menu page={window.location.href} />
            <Route path="/main/dashboard" component={Dashboard} />
            <Route path="/main/user" component={User} />
            <Route path="/main/taxpayer" component={Taxpayer} />
            <Route path="/main/modaluser" component={ModalUser} />
            <Route path="/main/modaltaxpayer" component={ModalTaxpayer} />
            <Route path="/main/receive" component={Receive} />
            <Route path="/main/donation" component={Donation} />
            <Route path="/main/modaldonation" component={ModalDonation} />
            <Route path="/main/report" component={Report} />
        </div>
    );
}