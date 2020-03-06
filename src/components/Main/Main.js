import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import Menu from '../../components/Menu/Menu';

import Dashboard from '../../pages/Dashboard';
import User from '../../pages/User';
import Taxpayer from '../../pages/Taxpayer';
import ModalUser from '../../pages/ModalUser';
import ModalTaxpayer from '../../pages/ModalTaxpayer';
import Receive from '../../pages/Receive';
import Donation from '../../pages/Donation';
import ModalDonation from '../../pages/ModalDonation';
import ModalCashRegister from '../../pages/ModalCashRegister';
import CashRegister from '../../pages/CashRegister';
import Report from '../../pages/Report';
import { isAdministrator } from '../../services/auth';
import './styles.css';

const PrivateRoute = ({component: Component, ...rest}) => (
    <Route { ... rest } render={props => (
        isAdministrator() ? (
            <Component { ... props} />
        ) : (
            <Redirect to={{pathname: '/main/dashboard', state: { from: props.location }}} />
        )
    )}/>
)

export default function Main() {
    return (
        <div id="main">
            <Menu page={window.location.href} />
            <Route path="/main/dashboard" component={Dashboard} />
            <Route path="/main/taxpayer" component={Taxpayer} />
            <Route path="/main/modaltaxpayer" component={ModalTaxpayer} />
            <Route path="/main/receive" component={Receive} />
            <Route path="/main/donation" component={Donation} />
            <Route path="/main/modaldonation" component={ModalDonation} />
            <Route path="/main/modalcashregister" component={ModalCashRegister} />
            <Route path="/main/cashregister" component={CashRegister} />
            <PrivateRoute path="/main/user" component={User} />
            <PrivateRoute path="/main/modaluser" component={ModalUser} />
            <PrivateRoute path="/main/report" component={Report} />
        </div>
    );
}