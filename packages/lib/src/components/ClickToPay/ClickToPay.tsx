import { h } from 'preact';
import UIElement from '../internal/UIElement/UIElement';
import { CoreProvider } from '../../core/Context/CoreProvider';
import { ClickToPayConfiguration, ClickToPayPaymentData } from './types';
import collectBrowserInfo from '../../utils/browserInfo';
import { ClickToPayCheckoutPayload, IClickToPayService } from '../internal/ClickToPay/services/types';
import { ClickToPayProps } from '../internal/ClickToPay/types';
import createClickToPayService from '../internal/ClickToPay/services/create-clicktopay-service';
import { CtpState } from '../internal/ClickToPay/services/ClickToPayService';
import ClickToPayProvider from '../internal/ClickToPay/context/ClickToPayProvider';
import ClickToPayComponent from '../internal/ClickToPay';
import BubpCheckoutError from '../../core/Errors/BubpCheckoutError';
import { TxVariants } from '../tx-variants';
import type { ICore } from '../../core/types';

export class ClickToPayElement extends UIElement<ClickToPayConfiguration> {
    public static type = TxVariants.clicktopay;

    private readonly clickToPayService: IClickToPayService | null;
    private readonly ctpConfiguration: ClickToPayProps;

    constructor(checkout: ICore, props?: ClickToPayConfiguration) {
        super(checkout, props);

        this.ctpConfiguration = {
            shopperEmail: this.props.shopperEmail,
            telephoneNumber: this.props.telephoneNumber,
            merchantDisplayName: this.props.merchantDisplayName,
            locale: this.props.locale,
            onReady: this.props.onReady,
            onTimeout: this.props.onTimeout
        };

        this.clickToPayService = createClickToPayService(this.props.configuration, this.ctpConfiguration, this.props.environment);
        this.clickToPayService?.initialize().catch(error => {
            this.handleError(new BubpCheckoutError('ERROR', error.toString(), { cause: error }));
        });

        if (!this.clickToPayService) {
            console.warn('ClickToPay not initialized - Likely the payment method is not configured or its configuration is missing');
        }
    }

    get isValid() {
        return true;
    }

    get browserInfo() {
        return collectBrowserInfo();
    }

    public formatData(): ClickToPayPaymentData {
        const { srcScheme, srcCorrelationId, srcTokenReference, srcCheckoutPayload, srcDigitalCardId } = this.state.data;
        return {
            paymentMethod: {
                type: ClickToPayElement.type,
                ...(srcScheme && { srcScheme }),
                ...(srcCorrelationId && { srcCorrelationId }),
                ...(srcTokenReference && { srcTokenReference }),
                ...(srcCheckoutPayload && { srcCheckoutPayload }),
                ...(srcDigitalCardId && { srcDigitalCardId })
            },
            browserInfo: this.browserInfo,
            origin: window?.location?.origin
        };
    }

    protected formatProps(props: ClickToPayConfiguration) {
        return {
            ...props,
            disableOtpAutoFocus: props.disableOtpAutoFocus || false,
            shopperEmail: props.shopperEmail || this.core.options?.session?.shopperEmail,
            telephoneNumber: props.telephoneNumber || this.core.options?.session?.telephoneNumber,
            locale: props.locale || props.i18n?.locale?.replace('-', '_')
        };
    }

    /**
     * Method used to let the merchant know if the shopper have a valid CtP accoubt
     *
     * Resolves Promise if the Shopper has cookies OR has valid CtP account
     * Rejects Promise if account isn't found or if Login screen is triggered
     */
    public override async isAvailable(): Promise<void> {
        if (!this.clickToPayService) {
            return Promise.reject();
        }

        if (this.clickToPayService.shopperAccountFound) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            this.clickToPayService.subscribeOnStateChange((state: CtpState) => {
                if (this.clickToPayService.shopperAccountFound) resolve();
                if (state === CtpState.NotAvailable || state === CtpState.Login || state === CtpState.Idle) reject();
            });
        });
    }

    private handleClickToPaySubmit = (payload: ClickToPayCheckoutPayload) => {
        this.setState({ data: { ...payload }, valid: {}, errors: {}, isValid: true });
        this.submit();
    };

    render() {
        return (
            <CoreProvider i18n={this.props.i18n} loadingContext={this.props.loadingContext} resources={this.resources}>
                <ClickToPayProvider
                    isStandaloneComponent={true}
                    configuration={this.ctpConfiguration}
                    amount={this.props.amount}
                    clickToPayService={this.clickToPayService}
                    setClickToPayRef={this.setComponentRef}
                    onSetStatus={this.setElementStatus}
                    onSubmit={this.handleClickToPaySubmit}
                    onError={this.handleError}
                >
                    <ClickToPayComponent />
                </ClickToPayProvider>
            </CoreProvider>
        );
    }
}

export default ClickToPayElement;
