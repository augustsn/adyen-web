import classNames from 'classnames';
import { h } from 'preact';
import './PaymentMethodName.scss';

const PaymentMethodName = ({ displayName, additionalInfo, isSelected }) => (
    <span className={'bubp-checkout__payment-method__name_wrapper'}>
        <span
            className={classNames({
                'bubp-checkout__payment-method__name': true,
                'bubp-checkout__payment-method__name--selected': isSelected
            })}
        >
            {displayName}
        </span>

        {additionalInfo && (
            <span
                className={classNames({
                    'bubp-checkout__payment-method__additional-info': true,
                    'bubp-checkout__payment-method__additional-info--selected': isSelected
                })}
            >
                {additionalInfo}
            </span>
        )}
    </span>
);

export default PaymentMethodName;
