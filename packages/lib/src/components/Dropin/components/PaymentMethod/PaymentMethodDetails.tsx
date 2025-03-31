import { h } from 'preact';

const PaymentMethodDetails = ({ paymentMethodComponent, isLoaded }) => {
    if (paymentMethodComponent && isLoaded) {
        return <div className={'bubp-checkout__payment-method__details__content'}>{paymentMethodComponent}</div>;
    }

    return null;
};

export default PaymentMethodDetails;
