import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { useCoreContext } from '../../../core/Context/CoreProvider';
import { ChangeActionOptions, ChangePaymentDetailsButtonProps } from '../types';

export default function ChangePaymentDetailsButton(props: ChangePaymentDetailsButtonProps) {
    const { i18n } = useCoreContext();
    const { amazonRef, amazonCheckoutSessionId } = props;

    useEffect(() => {
        const changeActionOptions: ChangeActionOptions = {
            amazonCheckoutSessionId,
            changeAction: 'changeAddress'
        };

        amazonRef.Pay.bindChangeAction('.bubp-checkout__amazonpay__button--changeAddress', changeActionOptions);
    }, []);

    return (
        <button type="button" className="bubp-checkout__button bubp-checkout__button--ghost bubp-checkout__amazonpay__button--changeAddress">
            {i18n.get('amazonpay.changePaymentDetails')}
        </button>
    );
}
