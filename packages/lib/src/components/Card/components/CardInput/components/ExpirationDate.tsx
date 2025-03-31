import { h } from 'preact';
import classNames from 'classnames';
import Field from '../../../../internal/FormFields/Field';
import { useCoreContext } from '../../../../../core/Context/CoreProvider';
import { ExpirationDateProps } from './types';
import DataSfSpan from './DataSfSpan';

import {
    DATE_POLICY_HIDDEN,
    DATE_POLICY_OPTIONAL,
    DATE_POLICY_REQUIRED,
    ENCRYPTED_EXPIRY_DATE
} from '../../../../internal/SecuredFields/lib/constants';
import useImage from '../../../../../core/Context/useImage';
import { alternativeLabelContent } from './FieldLabelAlternative';

export default function ExpirationDate(props: ExpirationDateProps) {
    const {
        label,
        focused,
        filled,
        onFocusField,
        className = '',
        error = '',
        isValid = false,
        expiryDatePolicy = DATE_POLICY_REQUIRED,
        showContextualElement,
        contextualText
    } = props;
    const { i18n } = useCoreContext();
    const getImage = useImage();

    const fieldClassnames = classNames(className, {
        'bubp-checkout__field__exp-date': true,
        'bubp-checkout__card__exp-date__input--hidden': expiryDatePolicy === DATE_POLICY_HIDDEN,
        'bubp-checkout__field__exp-date--optional': expiryDatePolicy === DATE_POLICY_OPTIONAL
    });

    const fieldLabel = expiryDatePolicy !== DATE_POLICY_OPTIONAL ? label : `${label} ${i18n.get('field.title.optional')}`;

    const handleIconClick = () => {
        onFocusField(ENCRYPTED_EXPIRY_DATE);
    };

    const imageDescription = `${fieldLabel} ${contextualText}`;

    return (
        <Field
            label={fieldLabel}
            classNameModifiers={['expiryDate']}
            className={fieldClassnames}
            focused={focused}
            filled={filled}
            onFocusField={() => onFocusField(ENCRYPTED_EXPIRY_DATE)}
            errorMessage={error}
            isValid={isValid}
            dir={'ltr'}
            name={'encryptedExpiryDate'}
            i18n={i18n}
            contextVisibleToScreenReader={false}
            useLabelElement={false}
            renderAlternativeToLabel={alternativeLabelContent}
            showContextualElement={showContextualElement}
            contextualText={contextualText}
        >
            <DataSfSpan
                encryptedFieldType={ENCRYPTED_EXPIRY_DATE}
                className={classNames('bubp-checkout__input', 'bubp-checkout__input--small', 'bubp-checkout__card__exp-date__input', {
                    'bubp-checkout__input--error': error,
                    'bubp-checkout__input--focus': focused,
                    'bubp-checkout__input--valid': isValid
                })}
            />
            <span
                className={classNames('bubp-checkout__field__exp-date_hint_wrapper', {
                    'bubp-checkout__field__exp-date_hint_wrapper--hidden': error || isValid
                })}
            >
                {/*eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions*/}
                <img
                    src={getImage({ imageFolder: 'components/' })('expiry_date_hint')}
                    className="bubp-checkout__field__exp-date_hint"
                    alt={imageDescription}
                    onClick={handleIconClick}
                />
            </span>
        </Field>
    );
}
