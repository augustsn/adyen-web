import { h } from 'preact';
import classNames from 'classnames';
import Field from '../../../../internal/FormFields/Field';
import DataSfSpan from '../../../../Card/components/CardInput/components/DataSfSpan';
import { alternativeLabelContent } from '../../../../Card/components/CardInput/components/FieldLabelAlternative';
import { capitalizeFirstLetter } from '../../../../../utils/textUtils';

const AchSFInput = ({ id, dataInfo, className = '', label, focused, filled, errorMessage = '', isValid = false, onFocusField, dir }) => {
    const capitalisedId = capitalizeFirstLetter(id);
    const encryptedIdStr = `encrypted${capitalisedId}`;

    return (
        <Field
            label={label}
            focused={focused}
            filled={filled}
            classNameModifiers={[id]}
            onFocusField={() => onFocusField(encryptedIdStr)}
            errorMessage={errorMessage}
            isValid={isValid}
            className={className}
            dir={dir}
            name={id}
            contextVisibleToScreenReader={false}
            useLabelElement={false}
            renderAlternativeToLabel={alternativeLabelContent}
        >
            <DataSfSpan
                encryptedFieldType={encryptedIdStr}
                data-info={dataInfo}
                className={classNames({
                    'bubp-checkout__input': true,
                    'bubp-checkout__input--large': true,
                    'bubp-checkout__input--error': errorMessage.length,
                    'bubp-checkout__input--focus': focused,
                    'bubp-checkout__input--valid': isValid
                })}
            />
        </Field>
    );
};

export default AchSFInput;
