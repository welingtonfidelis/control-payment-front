import React, { useState } from 'react';
import ReportByDate from '../../components/ReportBydDate';
import ReportByTaxpayer from '../../components/ReportByTaxpayer';

import './styles.scss';

export default function ReceivaByDate() {
    const [selectTab, setSelectTab] = useState(<ReportByDate />);
    const [selectDiv, setSelectDiv] = useState('repDate');


    function handleSwitTab(opt) {
        let select = '';
        let div = '';
        switch (opt) {
            case 1:
                select = <ReportByDate />;
                div = 'repDate';
                break;

            case 2:
                select = <ReportByTaxpayer />;
                div = 'repTax';
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
            <div className="flex-col-h">
                <div className="select-tab">
                    <div id="repDate" className="selected-tab" onClick={() => handleSwitTab(1)}>Mês atual</div>
                    <div id="repTax" onClick={() => handleSwitTab(2)}>Escolher data</div>
                </div>
                
                {selectTab}
            </div>
        </div>
    )
}