import { h, RefObject } from 'preact';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import BubpCheckoutError from '../../../core/Errors/BubpCheckoutError';
import Spinner from '../../internal/Spinner';
import { CashAppPayEvents, ICashAppService } from '../services/types';
import { CashAppPayEventData } from '../types';
import StoreDetails from '../../internal/StoreDetails';
import './CashAppComponent.scss';
import { UIElementStatus } from '../../internal/UIElement/types';

interface CashAppComponentProps {
    enableStoreDetails?: boolean;
    cashAppService: ICashAppService;
    onClick(): void;
    onChangeStoreDetails(data: any): void;
    onAuthorize(payEventData: CashAppPayEventData): void;
    onError(error: BubpCheckoutError): void;
    ref(ref: RefObject<typeof CashAppComponent>): void;
}

export function CashAppComponent({
    enableStoreDetails,
    cashAppService,
    onClick,
    onChangeStoreDetails,
    onAuthorize,
    onError
}: CashAppComponentProps): h.JSX.Element {
    const cashAppRef = useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState<UIElementStatus>('loading');
    const subscriptions = useRef<Function[]>([]);
    const [storePaymentMethod, setStorePaymentMethod] = useState<boolean>(false);

    this.setStatus = setStatus;

    const initializeCashAppSdk = useCallback(async () => {
        try {
            await cashAppService.initialize();

            subscriptions.current = [
                cashAppService.subscribeToEvent(CashAppPayEvents.CustomerDismissed, () => {
                    onError(new BubpCheckoutError('CANCEL', 'Customer dismissed the modal'));
                }),
                cashAppService.subscribeToEvent(CashAppPayEvents.CustomerRequestDeclined, async () => {
                    onError(new BubpCheckoutError('ERROR', 'Payment declined by CashAppPay'));
                    await cashAppService.restart();
                    await cashAppService.renderButton(cashAppRef.current);
                }),

                cashAppService.subscribeToEvent(CashAppPayEvents.CustomerRequestApproved, ({ customerProfile, grants }) => {
                    const cashAppPaymentData: CashAppPayEventData = {
                        ...(customerProfile?.id && { customerId: customerProfile.id }),
                        ...(customerProfile?.cashtag && { cashTag: customerProfile.cashtag }),
                        ...(grants?.payment?.grantId && { grantId: grants.payment.grantId }),
                        ...(grants?.onFile?.grantId && { onFileGrantId: grants.onFile.grantId })
                    };

                    onAuthorize(cashAppPaymentData);
                }),
                cashAppService.subscribeToEvent(CashAppPayEvents.CustomerRequestFailed, () => {
                    onError(new BubpCheckoutError('ERROR', 'Customer request failed'));
                })
            ];

            await cashAppService.renderButton(cashAppRef.current);

            setStatus('ready');
        } catch (error) {
            if (error instanceof BubpCheckoutError) onError(error);
            else onError(new BubpCheckoutError('ERROR', 'Error when initializing CashAppPay', { cause: error }));
        }
    }, [cashAppService, onError, onAuthorize]);

    useEffect(() => {
        if (enableStoreDetails) {
            cashAppService.setStorePaymentMethod(storePaymentMethod);
            onChangeStoreDetails(storePaymentMethod);
        }
    }, [enableStoreDetails, storePaymentMethod]);

    useEffect(() => {
        void initializeCashAppSdk();
        return () => {
            void cashAppService.restart();
            subscriptions.current.forEach(unsubscribeFn => unsubscribeFn());
        };
    }, [cashAppService, initializeCashAppSdk]);

    return (
        <div className="bubp-checkout__cashapp" aria-live="polite" aria-busy={status === 'loading'}>
            {status === 'loading' && <Spinner />}
            {status !== 'loading' && enableStoreDetails && <StoreDetails storeDetails={storePaymentMethod} onChange={setStorePaymentMethod} />}

            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
            <div onClick={onClick} className={'bubp-checkout__cashapp-button'} ref={cashAppRef}></div>
        </div>
    );
}
