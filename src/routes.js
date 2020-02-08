import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../src/services/auth';

import Login from './pages/Login';
import Main from './components/Main/Main';
import NotFound from './pages/NotFound';

const PrivateRoute = ({component: Component, ...rest}) => (
    <Route { ... rest } render={props => (
        isAuthenticated() ? (
            <Component { ... props} />
        ) : (
            <Redirect to={{pathname: '/', state: { from: props.location }}} />
        )
    )}/>
)

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Login} />
                <PrivateRoute path="/main" component={Main} />

                <Route path="*" component={NotFound} />
            </Switch>
        </BrowserRouter>
    )
}