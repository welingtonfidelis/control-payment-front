import React from 'react';
import Routes from './routes';
import dateFormat from 'dateformat';
import './App.scss';
import './assets/css/react-date-picker.css';

function App() {
  //seta formato de data para padrão brasileiro
  dateFormat.i18n = {
    dayNames: [
      'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab',
      'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'
    ],
    monthNames: [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto',
      'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    timeNames: [
      'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
    ]
  };
  
  return (
    <Routes />
  );
}

export default App;
