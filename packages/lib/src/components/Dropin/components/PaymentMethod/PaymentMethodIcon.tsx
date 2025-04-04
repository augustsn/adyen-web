import { h } from 'preact';
import Img from '../../../internal/Img';
import classNames from 'classnames';

interface PaymentMethodIconProps {
    /** URL to the payment method icon */
    src: string;

    /** Alt description of payment method used of a11y */
    altDescription: string;

    /** Type of the payment method*/
    type: string;

    disabled?: boolean;
}

const paymentMethodsWithoutBorder = ['googlepay', 'paywithgoogle'];

const PaymentMethodIcon = ({ src, altDescription, type, disabled = false }: PaymentMethodIconProps) => {
    return (
        <span
            className={classNames('bubp-checkout__payment-method__image__wrapper', {
                'bubp-checkout__payment-method__image__wrapper--outline': !paymentMethodsWithoutBorder.includes(type),
                'bubp-checkout__payment-method__image__wrapper--disabled': !!disabled
            })}
        >
            <Img className="bubp-checkout__payment-method__image" src={src} alt={altDescription} />
        </span>
    );
};

export default PaymentMethodIcon;
