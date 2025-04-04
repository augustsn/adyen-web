import { h } from 'preact';
import CVC from './CVC';
import Field from '../../../../internal/FormFields/Field';
import { useCoreContext } from '../../../../../core/Context/CoreProvider';
import { StoredCardFieldsProps } from './types';
import { ENCRYPTED_SECURITY_CODE } from '../../../../internal/SecuredFields/lib/constants';
import InputText from '../../../../internal/FormFields/InputText';

export default function StoredCardFields({
    brand,
    hasCVC,
    onFocusField,
    errors,
    valid,
    cvcPolicy,
    focusedElement,
    lastFour,
    expiryMonth,
    expiryYear,
    showContextualElement
}: StoredCardFieldsProps) {
    const { i18n } = useCoreContext();
    const storedCardDescription = i18n.get('creditCard.storedCard.description.ariaLabel').replace('%@', lastFour);
    const storedCardDescriptionSuffix = expiryMonth && expiryYear ? ` ${i18n.get('creditCard.expiryDate.label')} ${expiryMonth}/${expiryYear}` : '';
    const ariaLabel = `${storedCardDescription}${storedCardDescriptionSuffix}`;
    const isAmex = brand === 'amex';
    const cvcContextualText = isAmex
        ? i18n.get('creditCard.securityCode.contextualText.4digits')
        : i18n.get('creditCard.securityCode.contextualText.3digits');

    const getError = (errors, fieldType) => {
        return errors[fieldType] ? i18n.get(errors[fieldType]) : null;
    };

    return (
        <div className="bubp-checkout__card__form bubp-checkout__card__form--oneClick" aria-label={ariaLabel}>
            <div className="bubp-checkout__card__exp-cvc bubp-checkout__field-wrapper">
                {expiryMonth && expiryYear && (
                    <Field
                        label={i18n.get('creditCard.expiryDate.label')}
                        className="bubp-checkout__field--50"
                        classNameModifiers={['storedCard']}
                        name={'expiryDateField'}
                        disabled
                    >
                        <InputText
                            name={'expiryDateField'}
                            className={'bubp-checkout__input bubp-checkout__input--disabled bubp-checkout__card__exp-date__input--oneclick'}
                            value={`${expiryMonth} / ${expiryYear}`}
                            disabled={true}
                            dir={'ltr'}
                        />
                    </Field>
                )}

                {hasCVC && (
                    <CVC
                        cvcPolicy={cvcPolicy}
                        error={getError(errors, ENCRYPTED_SECURITY_CODE)}
                        focused={focusedElement === 'encryptedSecurityCode'}
                        filled={!!valid.encryptedSecurityCode || !!errors.encryptedSecurityCode}
                        isValid={!!valid.encryptedSecurityCode}
                        label={i18n.get('creditCard.securityCode.label')}
                        onFocusField={onFocusField}
                        {...(expiryMonth && expiryYear && { className: 'bubp-checkout__field--50' })}
                        classNameModifiers={['storedCard']}
                        frontCVC={isAmex}
                        showContextualElement={showContextualElement}
                        contextualText={cvcContextualText}
                    />
                )}
            </div>
        </div>
    );
}
