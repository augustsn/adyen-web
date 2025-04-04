import { createSession } from './checkout-api-calls';
import { RETURN_URL, SHOPPER_REFERENCE } from '../config/commonConfig';
import { handleError, handleFinalState } from './checkout-handlers';
import getCurrency from '../utils/get-currency';
import { BubpCheckoutProps } from '../stories/types';
import Checkout from '../../src/core/core';
import { BubpCheckout } from '../../src/core/BubpCheckout';

async function createSessionsCheckout({
    showPayButton,
    countryCode,
    shopperLocale,
    amount,
    sessionData,
    ...restCheckoutProps
}: BubpCheckoutProps): Promise<Checkout> {
    const session = await createSession({
        amount: {
            currency: getCurrency(countryCode),
            value: Number(amount)
        },
        shopperLocale,
        countryCode,
        reference: 'ABC123',
        returnUrl: RETURN_URL,
        shopperReference: SHOPPER_REFERENCE,
        shopperEmail: 'shopper.ctp1@bubpayment.com',
        ...sessionData
    });

    return BubpCheckout({
        clientKey: process.env.CLIENT_KEY,
        environment: process.env.CLIENT_ENV as any,
        countryCode,
        session,
        showPayButton,

        beforeSubmit: (data, component, actions) => {
            actions.resolve(data);
        },

        onPaymentCompleted(result, element) {
            console.log('onPaymentCompleted', result, element);
            handleFinalState(result, element);
        },

        onPaymentFailed(result, element) {
            console.log('onPaymentFailed', result, element);
            handleFinalState(result, element);
        },

        onError: (error, component) => {
            handleError(error, component);
        },

        ...restCheckoutProps
    });
}

export { createSessionsCheckout };
