import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import Field from '../../../../../internal/FormFields/Field';
import { useCoreContext } from '../../../../../../core/Context/CoreProvider';
import { InstallmentsItem, InstallmentsProps } from '../types';
import Fieldset from '../../../../../internal/FormFields/Fieldset/Fieldset';
import RadioGroup from '../../../../../internal/FormFields/RadioGroup';
import Select from '../../../../../internal/FormFields/Select';
import { alternativeLabelContent } from '../FieldLabelAlternative';
import './Installments.scss';

export interface InstallmentsObj {
    value: number;
    plan?: 'revolving';
}

/**
 * Installments generic dropdown
 */
function Installments(props: InstallmentsProps) {
    const { i18n } = useCoreContext();
    const { amount, brand, onChange, type } = props;
    const installmentOptions = props.installmentOptions[brand] || props.installmentOptions.card;
    const readOnly = installmentOptions?.values?.length === 1;
    const [installmentAmount, setInstallmentAmount] = useState(installmentOptions?.preselectedValue || installmentOptions?.values[0]);
    const [radioBtnValue, setRadioBtnValue] = useState('onetime');

    // hasRadioButtonUI determines if we have 3 radio buttons in the UI ('onetime', 'installments' and 'revolving')
    const hasRadioButtonUI = installmentOptions?.plans?.includes('revolving');
    const getPartialAmount = (divider: number): string => i18n.amount(amount.value / divider, amount.currency);

    const onSelectInstallment = e => {
        const selectedInstallments = e.target.value;
        setInstallmentAmount(Number(selectedInstallments));
    };

    const onRadioSelect = e => {
        const selectedBtn = e.currentTarget.getAttribute('value');
        setRadioBtnValue(selectedBtn);
    };

    const installmentItemsMapper = (value: number): InstallmentsItem => {
        let translationKey;
        let translationObj;

        if (type === 'amount') {
            translationKey = 'installmentOption';
            translationObj = { count: value, values: { times: value, partialValue: getPartialAmount(value) } };
        } else {
            translationKey = `installmentOptionMonths`;
            translationObj = { count: value, values: { times: value } };
        }

        return {
            id: value,
            name: amount.value ? i18n.get(translationKey, translationObj) : `${value}`
        };
    };

    useEffect(() => {
        if (installmentOptions?.values?.includes(installmentAmount)) {
            return;
        }

        setInstallmentAmount(installmentOptions?.preselectedValue ?? installmentOptions?.values[0]);
    }, [brand]);

    useEffect(() => {
        const stateObj: InstallmentsObj = {
            value: installmentAmount, // No radio button interface or "installments" radio button selected
            ...(hasRadioButtonUI && radioBtnValue === 'revolving' && { plan: radioBtnValue, value: 1 }),
            ...(hasRadioButtonUI && radioBtnValue === 'onetime' && { value: 1 })
        };

        onChange(installmentOptions ? stateObj : { value: null });
    }, [installmentAmount, installmentOptions, radioBtnValue]);

    if (!installmentOptions) return null;
    if (amount.value === 0) return null;

    // Alternate interface for installments with the possibility of a "revolving" plan
    if (hasRadioButtonUI) {
        return (
            <div className="bubp-checkout__installments">
                <Field
                    label={i18n.get('installments')}
                    classNameModifiers={['installments']}
                    name={'installmentsPseudoLabel'}
                    useLabelElement={false}
                    showContextualElement={false}
                    renderAlternativeToLabel={alternativeLabelContent}
                >
                    <Fieldset classNameModifiers={['revolving-plan']} label={''}>
                        <RadioGroup
                            items={[
                                { id: 'onetime', name: 'installments.oneTime' },
                                { id: 'installments', name: 'installments.installments' },
                                { id: 'revolving', name: 'installments.revolving' }
                            ]}
                            onChange={onRadioSelect}
                            value={radioBtnValue}
                            ariaLabel={i18n.get('installments')}
                        />

                        <Field
                            className={radioBtnValue !== 'installments' ? 'revolving-plan-installments__disabled' : 'revolving-plan-installments'}
                            classNameModifiers={['revolving-plan-installments']}
                            name={''}
                            useLabelElement={false}
                            showContextualElement={false}
                        >
                            <Select
                                filterable={false}
                                items={installmentOptions.values.map(installmentItemsMapper)}
                                selectedValue={installmentAmount}
                                onChange={onSelectInstallment}
                                name={'installments'}
                                disabled={radioBtnValue !== 'installments'}
                            />
                        </Field>
                    </Fieldset>
                </Field>
            </div>
        );
    }

    return (
        <div className="bubp-checkout__installments">
            <Field label={i18n.get('installments')} classNameModifiers={['installments']} name={'installments'} showContextualElement={false}>
                <Select
                    filterable={false}
                    items={installmentOptions.values.map(installmentItemsMapper)}
                    selectedValue={installmentAmount}
                    onChange={onSelectInstallment}
                    name={'installments'}
                    readonly={readOnly}
                    allowIdOnButton={true}
                />
            </Field>
        </div>
    );
}

Installments.defaultProps = {
    brand: '',
    amount: {},
    onChange: () => {}
};

export default Installments;
