import Field from '../../FormFields/Field';
import { h } from 'preact';
import { AddressLookupItem } from '../types';
import { useCallback, useEffect, useState, useMemo } from 'preact/hooks';
import './AddressSearch.scss';
import { useCoreContext } from '../../../../core/Context/CoreProvider';
import { debounce } from '../../../../utils/debounce';
import Select from '../../FormFields/Select';
import { AddressData } from '../../../../types';

export type OnAddressLookupType = (
    value: string,
    actions: {
        resolve: (value: Array<AddressLookupItem>) => void;
        reject: (reason?: any) => void;
    }
) => Promise<void>;

export type OnAddressSelectedType = (
    value: string,
    actions: {
        resolve: (value: AddressLookupItem) => void;
        reject: (reason?: any) => void;
    }
) => Promise<void>;

interface AddressSearchProps {
    onAddressLookup?: OnAddressLookupType;
    onAddressSelected?: OnAddressSelectedType;
    onSelect: (addressItem: AddressData) => void;
    onManualAddress: any;
    externalErrorMessage: string;
    hideManualButton: boolean;
    showContextualElement?: boolean;
    contextualText?: string;
    placeholder?: string;
    addressSearchDebounceMs?: number;
}

interface RejectionReason {
    errorMessage: string;
}

export default function AddressSearch({
    onAddressLookup,
    onAddressSelected,
    onSelect,
    onManualAddress,
    externalErrorMessage,
    hideManualButton,
    showContextualElement,
    contextualText,
    placeholder,
    addressSearchDebounceMs
}: Readonly<AddressSearchProps>) {
    const [formattedData, setFormattedData] = useState([]);
    const [originalData, setOriginalData] = useState([]);

    const [errorMessage, setErrorMessage] = useState('');

    const { i18n } = useCoreContext();
    const mapDataToSelect = data => data.map(({ id, name }) => ({ id, name }));

    const handlePromiseReject = useCallback((reason: RejectionReason) => {
        if (reason?.errorMessage) {
            setErrorMessage(reason.errorMessage);
        }
    }, []);

    const onTextInput = useCallback(
        (inputValue: string) => {
            new Promise<Array<AddressLookupItem>>((resolve, reject) => {
                void onAddressLookup(inputValue, { resolve, reject });
            })
                .then(searchArray => {
                    setOriginalData(searchArray);
                    setFormattedData(mapDataToSelect(searchArray));
                    setErrorMessage('');
                })
                .catch(reason => handlePromiseReject(reason));
        },
        [onAddressLookup]
    );

    // update error message when there's a new one
    useEffect(() => {
        setErrorMessage(externalErrorMessage);
    }, [externalErrorMessage]);

    const onSelectItem = event => {
        if (!event.target.value) {
            setErrorMessage(i18n.get('address.errors.incomplete'));
            return;
        }
        const value = originalData.find(item => item.id === event.target.value);

        // 1. in case we don't get a function just select item
        if (typeof onAddressSelected !== 'function') {
            onSelect(value);
            setFormattedData([]);
            return;
        }

        // 2. in case callback is provided, create and call onAddressSelected
        new Promise<AddressLookupItem>((resolve, reject) => {
            void onAddressSelected(value, { resolve, reject });
        })
            .then(fullData => {
                onSelect(fullData);
                setFormattedData([]);
            })
            .catch(reason => handlePromiseReject(reason));
    };

    const debounceInputHandler = useMemo(() => debounce(onTextInput, addressSearchDebounceMs), []);

    return (
        <div className={'bubp-checkout__address-search bubp-checkout__field-group'}>
            <Field
                label={i18n.get('address')}
                classNameModifiers={['address-search']}
                errorMessage={errorMessage}
                name={'address-search'}
                showContextualElement={showContextualElement}
                contextualText={contextualText}
            >
                <Select
                    name={'address-search'}
                    className={'bubp-checkout__address-search__dropdown'}
                    placeholder={placeholder}
                    onInput={debounceInputHandler}
                    items={formattedData}
                    onChange={onSelectItem}
                    disableTextFilter={true}
                    blurOnClose={true}
                />
            </Field>
            {!hideManualButton && (
                <span className="bubp-checkout__address-search__manual-add">
                    <button
                        type="button"
                        className="bubp-checkout__button bubp-checkout__button--inline bubp-checkout__button--link bubp-checkout__address-search__manual-add__button"
                        onClick={onManualAddress}
                    >
                        {'+ ' + i18n.get('address.enterManually')}
                    </button>
                </span>
            )}
        </div>
    );
}
