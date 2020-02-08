import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
    AppBar, CssBaseline, Divider, Drawer, Hidden, IconButton,
    List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography
} from '@material-ui/core';
import {
    Dashboard, Person, People, MonetizationOn, Menu as MenuIcon,
    Storefront, TrendingUp
} from '@material-ui/icons';

import Swal from '../SweetAlert/SwetAlert';

import './styles.scss';
import CompanyLogo from '../../assets/images/sua-logo-aqui.png';
import ImageProfile from '../../assets/images/user.png';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        }
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

function Menu({ container, page }) {
    const [component, setComponent] = useState('');
    const [titleToolbar, setTitleToolbar] = useState();
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const history = useHistory();
    const userName = localStorage.getItem('userName');

    async function exit() {
        if (await Swal.swalConfirm('Sair do sistema', 'Deseja realmente sair do sistema?')) {
            localStorage.clear();
            history.push('/');

            Swal.swalInform('Até breve.', '');
        }
    }

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    useEffect(() => {
        const selected = page.split('/');
        setComponent(selected[selected.length - 1]);
    }, []);

    useEffect(() => {
        setTitleToolbar(component);

        switch (component) {
            case 'Dashboard':
            case 'dashboard':
                setTitleToolbar('Dashboard');
                history.push('/main/dashboard');
                break;

            case 'Usuário':
            case 'user':
            case 'modaluser':
                setTitleToolbar('Usuário');
                history.push('/main/user');
                break;

            case 'Contribuinte':
            case 'taxpayer':
            case 'modaltaxpayer':
                setTitleToolbar('Contribuinte');
                history.push('/main/taxpayer');
                break;

            case 'Doação':
            case 'donation':
            case 'modaldonation':
                setTitleToolbar('Doação');
                history.push('/main/donation');
                break;

            case 'Recolhimento':
            case 'receive':
                setTitleToolbar('Recolhimento');
                history.push('/main/receive');
                break;

            case 'Relatório':
                console.log('vamos pro relatorio');
                break;

            default:
                break;
        }
    }, [component])

    const options = [
        { text: 'Dashboard', icon: < Dashboard /> }, { text: 'Usuário', icon: <Person /> },
        { text: 'Contribuinte', icon: <Storefront /> }, { text: 'Doação', icon: <People /> },
        { text: 'Recolhimento', icon: <MonetizationOn /> }, { text: 'Relatório', icon: <TrendingUp /> },
    ]
    const drawer = (
        <div className="content-menu">
            <header id="hdr">
                <div id="logo">
                    <img src={CompanyLogo} alt="Sua logo" />
                </div>
                <div id="company-name">
                    <h2>Nome da empresa</h2>
                </div>
            </header>
            <Divider />
            <List className="content-list">
                {options.map((el, index) => (
                    <ListItem
                        button key={index}
                        selected={el.text === titleToolbar}
                        onClick={() => {
                            setComponent(el.text);
                        }}
                    >
                        <ListItemIcon>{el.icon}</ListItemIcon>
                        <ListItemText primary={el.text} />
                    </ListItem>
                ))}
            </List>
            <Divider />

            <footer>
                <div className="content-footer">
                    <div id="image-profile">
                        <img src={ImageProfile} alt="Foto perfil" />
                        <div id="name-profile">
                            {userName}
                        </div>
                    </div>

                    <div id="exit-profile">
                        <button id="mini-button-1" onClick={() => exit()}>SAIR</button>
                    </div>
                </div>
            </footer>
        </div>
    );

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color="primary"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon style={{color: "#fff"}}/>
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        {titleToolbar}
                    </Typography>
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
        </div>
    );
}

Menu.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    container: PropTypes.instanceOf(typeof Element === 'undefined' ? Object : Element),
};

export default Menu;