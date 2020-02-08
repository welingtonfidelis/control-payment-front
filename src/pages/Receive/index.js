import React, { useState } from 'react';

import ReceiveBydate from '../../components/ReceiveByDate';
import ReceiveByMonth from '../../components/ReceiveByMonth';
import ReceiveByTaxpayer from '../../components/ReceiveByTaxpayer';

import './styles.scss';

export default function User() {
    const [selectTab, setSelectTab] = useState(<ReceiveByMonth />);
    const [selectDiv, setSelectDiv] = useState('recMonth');

    function handleSwitTab(opt) {
        let select = '';
        let div = '';
        switch (opt) {
            case 1:
                select = <ReceiveByMonth />;
                div = 'recMonth';
                break;

            case 2:
                select = <ReceiveBydate />;
                div = 'recDate';
                break;

            case 3:
                select = <ReceiveByTaxpayer />;
                div = 'recTaxp'
                break;

            default:
                break;
        }

        document.getElementById(selectDiv).classList.remove('selected-tab');
        document.getElementById(div).classList.add('selected-tab');
        setSelectDiv(div);

        setSelectTab(select);
    };

    return (
        <div className="content">
            <div className="select-tab">
                <div id="recMonth" className="selected-tab" onClick={() => handleSwitTab(1)}>Mês atual</div>
                <div id="recDate" onClick={() => handleSwitTab(2)}>Escolher data</div>
                <div id="recTaxp" onClick={() => handleSwitTab(3)}>Escolher contribuinte</div>
            </div>

            {selectTab}
        </div>
    )
}
