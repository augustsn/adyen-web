import { ICashAppSdkLoader } from './CashAppSdkLoader';
import BubpCheckoutError from '../../../core/Errors/BubpCheckoutError';
import { CashAppPayEvents, CashAppServiceConfig, ICashAppSDK, ICashAppService } from './types';

export default class CashAppService implements ICashAppService {
    private readonly sdkLoader: ICashAppSdkLoader;
    private readonly configuration: CashAppServiceConfig;

    private pay: ICashAppSDK;

    /**
     * Reference to CashApp 'begin' method
     */
    private startAuthorization?: () => void;

    constructor(sdkLoader: ICashAppSdkLoader, configuration: CashAppServiceConfig) {
        this.configuration = configuration;
        this.sdkLoader = sdkLoader;

        if (!configuration.clientId) {
            console.warn('CashAppService: clientId is missing');
        }
    }

    get hasOneTimePayment() {
        const { amount } = this.configuration;
        return amount?.value > 0;
    }

    get hasOnFilePayment() {
        return this.configuration.storePaymentMethod;
    }

    public setStorePaymentMethod(store: boolean) {
        this.configuration.storePaymentMethod = store;
    }

    public async initialize(): Promise<void> {
        try {
            const { environment, clientId } = this.configuration;
            const cashApp = await this.sdkLoader.load(environment);
            this.pay = await cashApp.pay({ clientId });
        } catch (error) {
            throw new BubpCheckoutError('ERROR', 'Error during initialization', { cause: error });
        }
    }

    public async renderButton(target: HTMLElement): Promise<void> {
        try {
            const { button, useCashAppButtonUi } = this.configuration;

            const { begin } = await this.pay.render(target, {
                manage: false,
                button: useCashAppButtonUi ? { width: 'full', shape: 'semiround', ...button } : false
            });
            this.startAuthorization = begin;
        } catch (error) {
            throw new BubpCheckoutError('ERROR', 'Error rendering CashAppPay button', { cause: error });
        }
    }

    public begin(): void {
        if (!this.startAuthorization) console.warn('CashAppService - begin() not available');
        else this.startAuthorization();
    }

    public subscribeToEvent(eventType: CashAppPayEvents, callback: Function): Function {
        this.pay.addEventListener(eventType, callback);
        return () => {
            this.pay.removeEventListener(eventType, callback);
        };
    }

    public async createCustomerRequest(): Promise<void> {
        try {
            const { referenceId, amount, scopeId, redirectURL = window.location.href } = this.configuration;

            const customerRequest = {
                referenceId,
                redirectURL,
                actions: {
                    ...(this.hasOneTimePayment && {
                        payment: {
                            amount,
                            scopeId
                        }
                    }),
                    ...(this.hasOnFilePayment && {
                        onFile: {
                            scopeId
                        }
                    })
                }
            };
            await this.pay.customerRequest(customerRequest);
        } catch (error) {
            throw new BubpCheckoutError('ERROR', 'Something went wrong during customerRequest creation', { cause: error });
        }
    }

    public async restart(): Promise<void> {
        await this.pay.restart();
    }
}
