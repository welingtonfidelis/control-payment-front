import React, { useState } from 'react';
import DonationByDate from '../../components/DonationByDate';
import DonationByTaxpayer from '../../components/DonationByTaxpayer';
import ListTaxpayer from '../../components/ListTaxpayer';
import ReportCashRegister from '../../components/ReportCashRegister';

import './styles.scss';

export default function ReceivaByDate() {
    const [selectTab, setSelectTab] = useState(<DonationByDate />);
    const [selectDiv, setSelectDiv] = useState('repDate');


    function handleSwitTab(opt) {
        let select = '';
        let div = '';
        switch (opt) {
            case 1:
                select = <DonationByDate />;
                div = 'repDate';
                break;

            case 2:
                select = <DonationByTaxpayer />;
                div = 'repTax';
                break;

            case 3:
                select = <ListTaxpayer />;
                div = 'listTax';
                break;

            case 4:
                select = <ReportCashRegister />;
                div = 'cashReg';
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
                    <div id="repDate" className="selected-tab" onClick={() => handleSwitTab(1)}>Doações por data</div>
                    <div id="repTax" onClick={() => handleSwitTab(2)}>Doações por contribuinte</div>
                    <div id="listTax" onClick={() => handleSwitTab(3)}>Contribuintes</div>
                    <div id="cashReg" onClick={() => handleSwitTab(4)}>Caixa</div>
                </div>

                {selectTab}
            </div>
        </div>
    )
}