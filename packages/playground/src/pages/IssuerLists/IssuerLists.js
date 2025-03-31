import {
    BubpCheckout,
    BillDeskOnline,
    BillDeskWallet,
    PayuCashcard,
    PayuNetBanking,
    Dotpay,
    OnlineBankingPL,
    MolPayEBankingMY,
    PayByBank,
    Redirect
} from '@bubp/web';
import '@bubp/web/styles/bubp.css';

import { createSession } from '../../services';
import { shopperLocale, countryCode, returnUrl } from '../../config/commonConfig';
import '../../../config/polyfills';
import '../../style.scss';

(async () => {
    const session = await createSession({
        amount: {
            value: 123,
            currency: 'EUR'
        },
        reference: 'ABC123',
        returnUrl,
        countryCode
    });

    window.core = await BubpCheckout({
        session,
        clientKey: process.env.__CLIENT_KEY__,
        locale: shopperLocale,
        environment: process.env.__CLIENT_ENV__,
        onError: console.error
    });

    // iDEAL
    window.ideal = new Redirect(window.core, { type: 'ideal' }).mount('.ideal-field');

    // BillDesk Online
    window.billdesk_online = new BillDeskOnline(window.core).mount('.billdesk_online-field');
    // return;

    //  BillDesk Wallet
    window.billdesk_wallet = new BillDeskWallet(window.core).mount('.billdesk_wallet-field');

    // PayU CashCard
    window.payu_cashcard = new PayuCashcard(window.core).mount('.payu_cc-field');

    //  PayU NetBanking
    window.payu_nb = new PayuNetBanking(window.core).mount('.payu_nb-field');

    // Dotpay
    window.dotpay = new Dotpay(window.core).mount('.dotpay-field');

    // Online banking PL
    window.onlineBanking_PL = new OnlineBankingPL(window.core).mount('.onlinebanking_PL-field');

    // Molpay MY
    window.molpay = new MolPayEBankingMY(window.core).mount('.molpay-field');

    // Pay By Bank
    window.paybybank_NL = new PayByBank(window.core).mount('.paybybank_NL-field');
})();
