import DataSfSpan from '../../Card/components/CardInput/components/DataSfSpan';
import classNames from 'classnames';
import Field from '../../internal/FormFields/Field';
import { h } from 'preact';
import { GiftcardFieldProps } from '../../Giftcard/components/types';
import { alternativeLabelContent } from '../../Card/components/CardInput/components/FieldLabelAlternative';

export const MealVoucherExpiryField = ({ i18n, sfpState, focusedElement, setFocusOn }: GiftcardFieldProps) => {
    return (
        <Field
            label={i18n.get('giftcard.expiryDate.label')}
            classNameModifiers={['expireDate', '50']}
            errorMessage={sfpState.errors.encryptedExpiryDate && i18n.get(sfpState.errors.encryptedExpiryDate)}
            focused={focusedElement === 'encryptedExpiryDate'}
            onFocusField={() => setFocusOn('encryptedExpiryDate')}
            dir={'ltr'}
            name={'encryptedExpiryDate'}
            contextVisibleToScreenReader={false}
            useLabelElement={false}
            renderAlternativeToLabel={alternativeLabelContent}
        >
            <DataSfSpan
                encryptedFieldType={'encryptedExpiryDate'}
                className={classNames('bubp-checkout__input', 'bubp-checkout__input--small', 'bubp-checkout__card__exp-date__input', {
                    'bubp-checkout__input--error': sfpState.errors.encryptedExpiryDate,
                    'bubp-checkout__input--focus': focusedElement === 'encryptedExpiryDate',
                    'bubp-checkout__input--valid': !!sfpState.valid.encryptedExpiryMonth && !!sfpState.valid.encryptedExpiryYear
                })}
            />
        </Field>
    );
};
