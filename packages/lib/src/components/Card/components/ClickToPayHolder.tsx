import { Fragment, h } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import useClickToPayContext from '../../internal/ClickToPay/context/useClickToPayContext';
import { CtpState } from '../../internal/ClickToPay/services/ClickToPayService';
import ClickToPayComponent from '../../internal/ClickToPay';
import ContentSeparator from '../../internal/ContentSeparator';
import Button from '../../internal/Button';
import { useCoreContext } from '../../../core/Context/CoreProvider';

type ClickToPayWrapperProps = {
    children(isCardPrimaryInput?: boolean): h.JSX.Element;
};

const ClickToPayHolder = ({ children }: ClickToPayWrapperProps) => {
    const { i18n } = useCoreContext();
    const [isCardInputVisible, setIsCardInputVisible] = useState<boolean>(null);
    const { ctpState, isCtpPrimaryPaymentMethod, setIsCtpPrimaryPaymentMethod, status } = useClickToPayContext();

    const areFieldsNotSet = isCardInputVisible === null && isCtpPrimaryPaymentMethod === null;

    useEffect(() => {
        if (areFieldsNotSet) {
            if (ctpState === CtpState.ShopperIdentified || ctpState === CtpState.Ready) {
                setIsCardInputVisible(false);
                setIsCtpPrimaryPaymentMethod(true);
                return;
            }
            if (ctpState === CtpState.NotAvailable) {
                setIsCardInputVisible(true);
                setIsCtpPrimaryPaymentMethod(false);
            }
        }
    }, [ctpState, areFieldsNotSet]);

    const handleOnShowCardButtonClick = useCallback(() => {
        setIsCardInputVisible(true);
        setIsCtpPrimaryPaymentMethod(false);
    }, []);

    const handleButtonKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                void handleOnShowCardButtonClick();
            }
        },
        [handleOnShowCardButtonClick]
    );

    if (ctpState === CtpState.NotAvailable) {
        return children();
    }

    if (ctpState === CtpState.Loading || ctpState === CtpState.ShopperIdentified) {
        return <ClickToPayComponent />;
    }

    return (
        <Fragment>
            <ClickToPayComponent onDisplayCardComponent={handleOnShowCardButtonClick} />

            <ContentSeparator classNames={['bubp-checkout-ctp__separator']} label={i18n.get('ctp.separatorText')} />

            {isCardInputVisible ? (
                children(!isCtpPrimaryPaymentMethod)
            ) : (
                <Button
                    variant="secondary"
                    disabled={status === 'loading'}
                    label={i18n.get('ctp.manualCardEntry')}
                    onClick={handleOnShowCardButtonClick}
                    onKeyDown={handleButtonKeyDown}
                />
            )}
        </Fragment>
    );
};

export default ClickToPayHolder;
