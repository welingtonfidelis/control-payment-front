import React, { useState } from 'react';

import './styles.scss';

import api from '../../services/api';
import ReceiveBydate from '../../components/ReceiveByDate';
import ReceiveByMonth from '../../components/ReceiveByMonth';
import ReceiveByTaxpayer from '../../components/ReceiveByTaxpayer';

export default function User() {
    const [selectTab, setSelectTab] = useState(<ReceiveByMonth />);

    function handleSwitTab(opt) {
        let select = '';
        switch (opt) {
            case 1:
                select = <ReceiveByMonth />;
                break;

            case 2:
                select = <ReceiveBydate />;
                break;

            case 3:
                select = <ReceiveByTaxpayer />;
                break;

            default:
                break;
        }

        setSelectTab(select);
    };

    return (
        <div className="content">
            <div className="select-tab">
                <div onClick={() => handleSwitTab(1)}>Mês atual</div>
                <div onClick={() => handleSwitTab(2)}>Escolher data</div>
                <div onClick={() => handleSwitTab(3)}>Escolher contribuinte</div>
            </div>

            {selectTab}
        </div>
    )
}
